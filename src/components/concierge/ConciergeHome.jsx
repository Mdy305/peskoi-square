import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Volume2, VolumeX } from "lucide-react";
import { COLORS, TYPOGRAPHY, SPACING, ANIMATION } from "../design/tokens";

export default function ConciergeHome() {
  const [state, setState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const startListening = () => {
    setState('listening');
    setTranscript('');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };
      
      recognition.onerror = () => {
        setState('idle');
      };
      
      recognition.onend = () => {
        setState('idle');
      };
      
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      const text = prompt("Voice not available. Type your command:");
      if (text) {
        processCommand(text);
      } else {
        setState('idle');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setState('idle');
  };

  const processCommand = async (text) => {
    setState('processing');
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    
    try {
      const res = await base44.functions.invoke('PESKOI_BRAIN_V2', {
        text,
        threadId,
        mode: 'short',
        streaming: false
      });

      const result = res.data;
      
      if (result.threadId) {
        setThreadId(result.threadId);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.speech, 
        display: result.display,
        actions: result.actions,
        timestamp: new Date() 
      }]);
      
      setResponse(result);
      
      // Speak response if not muted
      if (!isMuted && result.speech) {
        setState('speaking');
        speak(result.speech);
      } else {
        setState('idle');
      }
    } catch (error) {
      setState('idle');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Unable to process command.',
        timestamp: new Date()
      }]);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setState('idle');
      };
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setState('idle');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setState('idle');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.black,
      color: COLORS.white,
      padding: SPACING[6],
      fontFamily: TYPOGRAPHY.fontFamily.sans
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: SPACING[12],
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.light,
            letterSpacing: TYPOGRAPHY.letterSpacing.wide,
            marginBottom: SPACING[2]
          }}>
            PESKOI Concierge
          </h1>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: COLORS.gray[600],
            letterSpacing: TYPOGRAPHY.letterSpacing.wider,
            textTransform: 'uppercase'
          }}>
            Voice Intelligence
          </p>
        </div>

        {/* Voice Orb */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: SPACING[12]
        }}>
          <motion.button
            onClick={state === 'listening' ? stopListening : state === 'speaking' ? stopSpeaking : startListening}
            disabled={state === 'processing'}
            animate={{
              scale: state === 'listening' ? [1, 1.1, 1] : state === 'processing' ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: state === 'listening' || state === 'processing' ? Infinity : 0,
              ease: ANIMATION.easing.smooth
            }}
            style={{
              width: '160px',
              height: '160px',
              borderRadius: RADIUS.full,
              background: state === 'idle' 
                ? COLORS.gray[100] 
                : state === 'listening' 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                : state === 'processing'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
                : 'linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.1))',
              border: `1px solid ${state === 'idle' ? COLORS.gray[200] : COLORS.gray[400]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: state === 'processing' ? 'not-allowed' : 'pointer',
              transition: ANIMATION.duration.normal,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {state === 'listening' ? (
              <Square size={40} color={COLORS.white} />
            ) : state === 'speaking' ? (
              <Volume2 size={40} color={COLORS.state.success} />
            ) : (
              <Mic size={40} color={COLORS.gray[700]} />
            )}
          </motion.button>
        </div>

        {/* Live Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                textAlign: 'center',
                marginBottom: SPACING[8],
                padding: SPACING[4],
                background: COLORS.gray[50],
                borderRadius: RADIUS.lg,
                fontSize: TYPOGRAPHY.fontSize.lg,
                color: COLORS.gray[800]
              }}
            >
              {transcript}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation History */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING[4]
        }}>
          {messages.slice(-5).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: SPACING[4],
                background: msg.role === 'user' ? COLORS.gray[100] : COLORS.gray[50],
                borderRadius: RADIUS.lg,
                border: `1px solid ${COLORS.gray[100]}`
              }}
            >
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.xs,
                color: COLORS.gray[600],
                marginBottom: SPACING[2],
                textTransform: 'uppercase',
                letterSpacing: TYPOGRAPHY.letterSpacing.wider
              }}>
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.base,
                color: COLORS.white,
                lineHeight: TYPOGRAPHY.lineHeight.relaxed
              }}>
                {msg.display || msg.content}
              </div>
              {msg.actions && msg.actions.length > 0 && (
                <div style={{
                  marginTop: SPACING[3],
                  display: 'flex',
                  gap: SPACING[2]
                }}>
                  {msg.actions.map((action, i) => (
                    <button
                      key={i}
                      style={{
                        padding: `${SPACING[2]} ${SPACING[4]}`,
                        background: 'transparent',
                        border: `1px solid ${COLORS.gray[300]}`,
                        borderRadius: RADIUS.base,
                        color: COLORS.white,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        cursor: 'pointer',
                        transition: ANIMATION.duration.fast
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          marginTop: SPACING[12],
          display: 'flex',
          justifyContent: 'center',
          gap: SPACING[4]
        }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              padding: SPACING[3],
              background: 'transparent',
              border: `1px solid ${COLORS.gray[200]}`,
              borderRadius: RADIUS.full,
              color: COLORS.gray[700],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}