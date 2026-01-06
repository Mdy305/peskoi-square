import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import CloudAnimation from "./CloudAnimation";
import OverlayManager from "./OverlayManager";
import { detectWakeWord, stripWakeWord } from "./wakeWord";
import { speakLola, playSpatial } from "./lolaVoice";

export default function VoiceCommand() {
  const [mode, setMode] = useState("idle");
  const [emotion, setEmotion] = useState("calm");
  const [log, setLog] = useState([]);
  const [overlay, setOverlay] = useState(null);
  const [continuousListening, setContinuousListening] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const recognitionRef = useRef(null);
  const abortRef = useRef(null);

  const startListening = (continuous = false) => {
    if (mode !== "idle" && !continuous) return;

    setContinuousListening(continuous);
    setMode(continuous ? "idle" : "listening");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const text = prompt("Type command:");
      if (text) sendToBrain(text);
      else setMode("idle");
      return;
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;

    rec.lang = "en-US";
    rec.continuous = continuous;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript;

      if (continuous) {
        if (detectWakeWord(text)) {
          setMode("listening");
          setEmotion("focused");
          playSpatial("/audio/lola-confirm.mp3", 0, -0.2, -0.8);
          const command = stripWakeWord(text);
          if (command) {
            setLog(l => [...l, `You: ${command}`]);
            sendToBrain(command);
          }
        }
      } else {
        setLog(l => [...l, `You: ${text}`]);
        sendToBrain(text);
      }
    };

    rec.onerror = () => {
      if (!continuous) setMode("idle");
    };

    rec.onend = () => {
      if (continuous) {
        rec.start();
      } else if (mode === "listening") {
        setMode("idle");
      }
    };

    rec.start();
  };

  const sendToBrain = async (text) => {
    setMode("thinking");
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/functions/brain", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          stream: true,
          voice: true,
          conversation_id: conversationId
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        chunk
          .split("\n")
          .filter(Boolean)
          .forEach(line => {
            try {
              const event = JSON.parse(line);
              handleBrainEvent(event);
            } catch (e) {
              console.error("Parse error:", e);
            }
          });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Brain error:", error);
        setMode("idle");
      }
    }
  };

  const handleBrainEvent = (e) => {
    const eventEmotion = e.emotion || "calm";
    setEmotion(eventEmotion);

    switch (e.type) {
      case "ack":
        setMode("speaking");
        setEmotion("focused");
        speakLola(e.speech);
        break;

      case "speech":
        setLog(l => [...l, `LOLA: ${e.speech}`]);
        speakLola(e.speech);
        break;

      case "clarify":
        setMode("listening");
        setEmotion("alert");
        setLog(l => [...l, `LOLA: ${e.question}`]);
        speakLola(e.question, () => {
          if (!continuousListening) startListening();
        });
        break;

      case "proposal":
        setMode("confirming");
        setEmotion("alert");
        setOverlay({ type: "proposal", data: e.proposal });
        break;

      case "overlay":
        setOverlay({ type: e.overlayType, data: e.overlayData });
        break;

      case "done":
        setMode(continuousListening ? "idle" : "idle");
        setEmotion(e.emotion || "success");
        if (e.conversation_id) setConversationId(e.conversation_id);
        setTimeout(() => setEmotion("calm"), 2000);
        break;

      default:
        console.warn("Unknown event type:", e.type);
    }
  };

  const interrupt = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    if (abortRef.current) abortRef.current.abort();
    window.speechSynthesis.cancel();
    setContinuousListening(false);
    setConversationId(null); // Reset conversation
    setMode("idle");
    setEmotion("calm");
  };

  const toggleContinuousListening = () => {
    if (continuousListening) {
      interrupt();
    } else {
      startListening(true);
    }
  };

  return (
    <>
      <OverlayManager overlay={overlay} onClose={() => setOverlay(null)} />

      <button
        onClick={continuousListening ? interrupt : mode === "idle" ? () => startListening(false) : interrupt}
        onDoubleClick={toggleContinuousListening}
        className="fixed bottom-6 right-6 z-50"
        title={continuousListening ? "LOLA listening (double-click to stop)" : "Click: one command | Double-click: continuous"}
      >
        <CloudAnimation state={mode} emotion={emotion} />
      </button>

      <AnimatePresence>
        {log.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-6 w-[360px] bg-black/90 border border-white/10 rounded-xl p-4 text-sm text-white/80 max-h-[400px] overflow-y-auto z-50"
          >
            {log.slice(-6).map((l, i) => (
              <div key={i} className="mb-1">{l}</div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}