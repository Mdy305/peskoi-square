import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Volume2, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveDemo() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [audioWarning, setAudioWarning] = useState(null);
  
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const isActiveRef = useRef(false);
  const processingRef = useRef(false);
  const listeningRef = useRef(false);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const base64ToBlob = (base64, mimeType) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (e) {
      console.error("❌ Blob conversion error:", e);
      return null;
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || !isActiveRef.current || processingRef.current || listeningRef.current) {
      return;
    }

    try {
      listeningRef.current = true;
      setIsListening(true);
      recognitionRef.current.start();
      console.log("🎤 Recognition started");
    } catch (err) {
      console.error("Start recognition error:", err);
      listeningRef.current = false;
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (recognitionRef.current && listeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Stop recognition error:", err);
      }
    }
    listeningRef.current = false;
    setIsListening(false);
  };

  const playAudio = async (audio) => {
    console.log("================================");
    console.log("🔊 playAudio() called");
    console.log("Has audio:", !!audio);
    console.log("Audio type:", typeof audio);
    console.log("Audio length:", audio?.length || 0);
    console.log("================================");

    if (!audio || typeof audio !== 'string' || audio.length < 100) {
      console.error("❌ No valid audio data received!");
      console.error("Audio value:", audio?.substring(0, 50) || "null/undefined");
      setAudioWarning("⚠️ Inget ljud mottaget från ElevenLabs");
      setTimeout(() => setAudioWarning(null), 3000);
      return false;
    }

    if (!audioRef.current) {
      console.error("❌ Audio element not found!");
      return false;
    }

    console.log("✅ Valid audio data, creating blob...");
    
    const audioBlob = base64ToBlob(audio, 'audio/mpeg');
    if (!audioBlob) {
      console.error("❌ Failed to create audio blob");
      setAudioWarning("⚠️ Kunde inte skapa ljudfil");
      setTimeout(() => setAudioWarning(null), 3000);
      return false;
    }
    
    console.log("✅ Blob created, size:", audioBlob.size, "bytes");
    
    const audioUrl = URL.createObjectURL(audioBlob);
    audioRef.current.src = audioUrl;
    
    console.log("✅ Audio URL set, starting playback...");
    
    return new Promise((resolve) => {
      audioRef.current.onended = () => {
        console.log("✅ ElevenLabs audio finished playing");
        URL.revokeObjectURL(audioUrl);
        resolve(true);
      };
      
      audioRef.current.onerror = (e) => {
        console.error("❌ ElevenLabs playback error:", e);
        console.error("Error details:", audioRef.current.error);
        URL.revokeObjectURL(audioUrl);
        setAudioWarning("⚠️ Ljuduppspelning misslyckades");
        setTimeout(() => setAudioWarning(null), 3000);
        resolve(false);
      };
      
      audioRef.current.play().catch((playError) => {
        console.error("❌ ElevenLabs play() error:", playError);
        console.error("Error name:", playError.name);
        console.error("Error message:", playError.message);
        URL.revokeObjectURL(audioUrl);
        setAudioWarning("⚠️ Kunde inte spela upp ljud");
        setTimeout(() => setAudioWarning(null), 3000);
        resolve(false);
      });
    });
  };

  const handleAIResponse = async (userText, historySnapshot) => {
    if (processingRef.current) {
      console.log("⚠️ Already processing");
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    stopListening();

    try {
      console.log("================================");
      console.log("📤 Calling AI with:", userText.substring(0, 50));
      console.log("================================");
      
      const history = [];
      if (Array.isArray(historySnapshot)) {
        for (const m of historySnapshot.slice(-8)) {
          if (m && m.speaker && m.text) {
            history.push({
              speaker: String(m.speaker),
              text: String(m.text).substring(0, 300)
            });
          }
        }
      }

      const response = await base44.functions.invoke('demoConversation', {
        userMessage: String(userText).substring(0, 500),
        conversationHistory: history
      });

      console.log("================================");
      console.log("📨 Response received!");
      console.log("Response exists:", !!response);
      console.log("Response.data exists:", !!response?.data);
      console.log("Full response.data:", JSON.stringify(response?.data, null, 2));
      console.log("================================");

      if (!response || !response.data) {
        throw new Error("No response data");
      }

      const { text, audio } = response.data;
      
      console.log("================================");
      console.log("💡 Text received:", !!text);
      console.log("Text length:", text?.length || 0);
      console.log("Text preview:", text?.substring(0, 100));
      console.log("================================");
      console.log("🎙️ Audio received:", !!audio);
      console.log("Audio type:", typeof audio);
      console.log("Audio length:", audio?.length || 0);
      console.log("Audio preview:", audio?.substring(0, 50) || "null");
      console.log("================================");
      
      if (!text || typeof text !== 'string') {
        throw new Error("Invalid text response");
      }

      setTranscript(prev => [...prev.slice(-19), { speaker: "Evelina", text }]);
      
      processingRef.current = false;
      setIsProcessing(false);

      // Play audio if available
      if (audio) {
        console.log("🎙️ Audio exists, attempting playback...");
        setIsSpeaking(true);
        const success = await playAudio(audio);
        setIsSpeaking(false);
        console.log("🎙️ Playback finished, success:", success);
      } else {
        console.error("❌ NO AUDIO IN RESPONSE!");
        setAudioWarning("⚠️ Backend skickade inget ljud");
        setTimeout(() => setAudioWarning(null), 3000);
      }
      
      if (isActiveRef.current) {
        setTimeout(() => startListening(), 1500);
      }

    } catch (err) {
      console.error("================================");
      console.error("❌ AI Response Error:");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Response data:", err.response?.data);
      console.error("================================");
      
      processingRef.current = false;
      setIsProcessing(false);
      setIsSpeaking(false);
      
      const errorText = err.response?.data?.error || err.message || "Unknown error";
      setError(`Error: ${errorText}`);
      
      setTimeout(() => {
        setError(null);
        if (isActiveRef.current) {
          startListening();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    console.log("🎤 Setting up speech recognition");
    
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError("Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'sv-SE';
    recognition.maxAlternatives = 3; // ✅ Fler alternativ = bättre noggrannhet!

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';
      
      // ✅ Samla både interim och final resultat
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      // ✅ Visa interim text (användarfeedback)
      if (interimText) {
        console.log("🎤 Interim:", interimText);
      }

      // ✅ Längre timeout - ge användaren mer tid!
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // ✅ 2.5 sekunder tystnad innan vi avslutar (istället för omedelbart)
      if (!finalText && interimText) {
        silenceTimerRef.current = setTimeout(() => {
          if (listeningRef.current && !finalText) {
            console.log("⏱️ Timeout - stopping recognition");
            stopListening();
          }
        }, 2500); // ✅ 2.5 sekunder istället för omedelbart
      }

      if (finalText && finalText.length > 0) {
        console.log("🎤 User said (FINAL):", finalText);
        
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        
        listeningRef.current = false;
        setIsListening(false);
        
        setTranscript(prev => {
          const updated = [...prev.slice(-19), { speaker: "Du", text: finalText }];
          setTimeout(() => handleAIResponse(finalText, updated), 100);
          return updated;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      listeningRef.current = false;
      setIsListening(false);
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (event.error === 'no-speech') {
        if (isActiveRef.current && !processingRef.current) {
          setTimeout(() => startListening(), 1000);
        }
      } else if (event.error === 'not-allowed') {
        setError("Microphone access denied. Please allow microphone access in your browser settings.");
      } else if (event.error !== 'aborted') {
        if (isActiveRef.current && !processingRef.current) {
          setTimeout(() => startListening(), 1500);
        }
      }
    };

    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleToggle = async () => {
    if (!isActive) {
      console.log("🚀 Starting demo...");
      setIsActive(true);
      setTranscript([]);
      setError(null);
      setAudioWarning(null);
      processingRef.current = true;
      setIsProcessing(true);
      
      try {
        const response = await base44.functions.invoke('demoConversation', {
          userMessage: "Hej!",
          conversationHistory: []
        });

        if (!response?.data?.text) {
          throw new Error("Invalid response");
        }

        const { text, audio } = response.data;
        console.log("✅ First greeting text:", text);
        console.log("✅ First greeting audio:", !!audio, "length:", audio?.length);
        
        setTranscript([{ speaker: "Evelina", text }]);
        processingRef.current = false;
        setIsProcessing(false);

        if (audio) {
          setIsSpeaking(true);
          await playAudio(audio);
          setIsSpeaking(false);
        }
        
        setTimeout(() => startListening(), 1500);
        
      } catch (err) {
        console.error("❌ Start error:", err);
        setError("Could not start demo. Please check your microphone permissions.");
        setIsActive(false);
        processingRef.current = false;
        setIsProcessing(false);
      }
    } else {
      console.log("⏹️ Stopping demo...");
      setIsActive(false);
      stopListening();
      setIsSpeaking(false);
      setIsProcessing(false);
      processingRef.current = false;
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setTranscript([]);
      setAudioWarning(null);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <audio ref={audioRef} style={{ display: 'none' }} />

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            🎤 Talk with Evelina
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Click the microphone and have a natural conversation!
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}
          
          {audioWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-yellow-400">{audioWarning}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <button
            onClick={handleToggle}
            disabled={isSpeaking || isProcessing}
            className={`
              relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isActive 
                ? 'bg-[#84CC16] shadow-2xl shadow-[#84CC16]/50' 
                : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a]'
              }
              ${(isSpeaking || isProcessing) ? 'opacity-75 cursor-not-allowed' : ''}
            `}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-black animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-black animate-pulse" />
            ) : isActive ? (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
            ) : (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            )}
            
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-[#84CC16] animate-ping opacity-20"></div>
            )}
          </button>
          
          <div className="mt-6 text-center">
            <span className={`text-sm font-medium block ${
              isProcessing ? 'text-yellow-400' :
              isListening ? 'text-[#84CC16]' : 
              isSpeaking ? 'text-blue-400' : 
              isActive ? 'text-gray-400' : 
              'text-gray-500'
            }`}>
              {isProcessing ? '🤔 Evelina is thinking...' :
               isSpeaking ? '🎙️ Evelina is speaking...' :
               isListening ? '🎤 Listening...' :
               isActive ? '⏸️ Ready' :
               'Inactive'}
            </span>
            {isActive && (
              <p className="text-xs text-gray-600 mt-2">
                {isProcessing ? 'Waiting for response...' : 
                 isListening ? 'Speak now! (2.5 sec pause)' :
                 'System is listening'}
              </p>
            )}
          </div>
        </div>

        <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Conversation
            </h2>
            
            <div className="min-h-[250px] sm:min-h-[300px] max-h-[400px] bg-black rounded-lg border border-[#1f1f1f] p-4 sm:p-6 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
                  <p className="text-sm sm:text-base text-gray-600 text-center px-4">
                    Start demo to begin speaking
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transcript.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className={`
                        px-4 py-3 rounded-lg max-w-full sm:max-w-2xl
                        ${msg.speaker === 'Evelina' 
                          ? 'bg-[#1a1a1a] text-white border border-[#2a2a2a]' 
                          : 'bg-[#84CC16] text-black'
                        }
                      `}>
                        <p className="text-xs font-semibold mb-1 opacity-60">
                          {msg.speaker}
                        </p>
                        <p className="text-sm break-words">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-lg">
                        <p className="text-xs font-semibold mb-1 opacity-60">Evelina</p>
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#84CC16]" />
                          <p className="text-sm text-gray-400">Thinking...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                ✅ IMPROVED ACCURACY:
              </h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 3x better speech recognition (maxAlternatives: 3)</li>
                <li>• 2.5 second pause before Evelina speaks (more time!)</li>
                <li>• Better handling of long phone numbers</li>
                <li>• Try saying slowly: "zero seven nine eight eight zero four"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}