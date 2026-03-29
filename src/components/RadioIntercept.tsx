'use client';

import { useState, useRef, useEffect } from 'react';

export default function RadioIntercept() {
  const [active, setActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const morseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleRadio = () => {
    if (active) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (morseTimeoutRef.current) clearTimeout(morseTimeoutRef.current);
      setActive(false);
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
        
        // Bandpass filter to sound like an old radio transmitter
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1200 + Math.random() * 500;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime); // low volume background static
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (bufferSize / ctx.sampleRate));

        noise.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
        
        timeoutRef.current = setTimeout(playStaticBurst, Math.random() * 6000 + 1000);
      };

      // Function to play Morse-code style encrypted data beeps
      const playMorseBeep = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1); // Quick 100ms beep
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);

        morseTimeoutRef.current = setTimeout(playMorseBeep, Math.random() * 400 + 100);
      };

      playStaticBurst();
      // Start morse sequence delayed
      morseTimeoutRef.current = setTimeout(playMorseBeep, 2000);
      setActive(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (morseTimeoutRef.current) clearTimeout(morseTimeoutRef.current);
    };
  }, []);

  return (
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
  );
}
