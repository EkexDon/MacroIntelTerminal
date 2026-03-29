'use client';

import { useState, useRef, useEffect } from 'react';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': ' '
};

const INTERCEPTS = [
  "FLEET MOVEMENT DETECTED SOUTH CHINA SEA",
  "SIGNAL LOST SUEZ CANAL",
  "SECURE CHANNEL ESTABLISHED",
  "ENCRYPTED PACKET INTERCEPTED HORMUZ",
  "STRATEGIC ASSET RELOCATED TAIWAN",
  "ORACLE UNKNOWN WHALE ACCUMULATION",
  "USGS SEISMIC ANOMALY SECTOR 7",
  "DEFCON MATRIX CALIBRATED",
  "BLACKROCK LIQUIDITY INJECTION DETECTED"
];

export default function RadioIntercept() {
  const [active, setActive] = useState(false);
  const [interceptText, setInterceptText] = useState<string>("");
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    charTimeoutsRef.current.forEach(t => clearTimeout(t));
    charTimeoutsRef.current = [];
  };

  const toggleRadio = () => {
    if (active) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      clearAllTimeouts();
      setActive(false);
      setInterceptText("");
    } else {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Function to play a burst of encrypted radio static
      const playStaticBurst = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        
        const bufferSize = ctx.sampleRate * (Math.random() * 0.5 + 0.2); // 0.2s - 0.7s of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1200 + Math.random() * 500;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (bufferSize / ctx.sampleRate));

        noise.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
        
        timeoutRef.current = setTimeout(playStaticBurst, Math.random() * 8000 + 4000);
      };

      // Play authentic morse code synced with text rendering
      const playSynchronizedIntercept = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        
        const message = INTERCEPTS[Math.floor(Math.random() * INTERCEPTS.length)];
        setInterceptText(""); // Reset text
        
        const DOT_MS = 60;
        const DASH_MS = DOT_MS * 3;
        const SYMBOL_SPACE_MS = DOT_MS;
        const LETTER_SPACE_MS = DOT_MS * 3;
        const WORD_SPACE_MS = DOT_MS * 7;
        
        let currentTimeOffsetMs = 0;
        let builtText = "";

        const hz = 600 + Math.random() * 200; // slightly randomize pitch per transmission

        // Parse message
        for (let i = 0; i < message.length; i++) {
          const char = message[i];
          const morse = MORSE_CODE[char];
          
          if (!morse) {
            // Space between words
            currentTimeOffsetMs += WORD_SPACE_MS - LETTER_SPACE_MS;
            builtText += " ";
            
            const txt = builtText;
            charTimeoutsRef.current.push(
              setTimeout(() => { setInterceptText(txt); }, currentTimeOffsetMs)
            );
            continue;
          }

          // Schedule audio for this character's morse symbols
          for (let j = 0; j < morse.length; j++) {
            const symbol = morse[j];
            const durationMs = symbol === '.' ? DOT_MS : DASH_MS;
            
            // Schedule Oscillator
            const startTime = ctx.currentTime + (currentTimeOffsetMs / 1000);
            const durationSec = durationMs / 1000;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = hz;
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.05, startTime + 0.005);
            gain.gain.setValueAtTime(0.05, startTime + durationSec - 0.005);
            gain.gain.linearRampToValueAtTime(0, startTime + durationSec);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + durationSec);
            
            currentTimeOffsetMs += durationMs + SYMBOL_SPACE_MS;
          }

          builtText += char;
          const txt = builtText;
          // Reveal character right as its morse finishes transmitting
          charTimeoutsRef.current.push(
            setTimeout(() => { setInterceptText(txt); }, currentTimeOffsetMs)
          );

          currentTimeOffsetMs += LETTER_SPACE_MS - SYMBOL_SPACE_MS; // gap between letters
        }

        // Schedule next transmission
        sequenceTimeoutRef.current = setTimeout(playSynchronizedIntercept, currentTimeOffsetMs + (Math.random() * 5000 + 4000));
      };

      playStaticBurst();
      sequenceTimeoutRef.current = setTimeout(playSynchronizedIntercept, 2000);
      setActive(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="flex items-center gap-3 shrink-0">
      {active && interceptText && (
        <div className="hidden lg:flex items-center gap-2 bg-[#001a0d] border border-primary/30 px-3 py-1 rounded-sm">
           <div className="w-1.5 h-3 bg-primary animate-pulse" />
           <span className="font-mono text-[10px] text-primary tracking-widest uppercase truncate max-w-[300px]">
             {interceptText}
           </span>
        </div>
      )}

      <button 
        onClick={toggleRadio}
        className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 font-mono tracking-widest text-[10px] uppercase shrink-0 ${
          active 
            ? 'bg-danger/20 text-danger border-danger shadow-[0_0_10px_rgba(255,51,102,0.3)]' 
            : 'bg-black border-white/20 text-gray-500 hover:text-white'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-danger animate-pulse' : 'bg-gray-600'}`}></div>
        <span>{active ? 'COMMS SECURED' : 'RADIO INTERCEPT'}</span>
      </button>
    </div>
  );
}
