import React, { useEffect, useRef } from "react";
import { LOLA_COLORS } from "./lolaVoice";

export default function CloudAnimation({ state = "idle", emotion = "calm" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const timeRef = useRef(0);
  const energyRef = useRef(0);

  /* ---------------- AUDIO ENERGY (MIC) ---------------- */

  useEffect(() => {
    if (state !== "listening" && state !== "speaking") return;

    let analyser;
    let data;
    let ctx;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      data = new Uint8Array(analyser.frequencyBinCount);

      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);

      const loop = () => {
        analyser.getByteFrequencyData(data);
        energyRef.current =
          data.reduce((a, b) => a + b, 0) / data.length / 255;
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    }).catch(err => {
      console.error("Microphone access denied:", err);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ctx) ctx.close();
    };
  }, [state]);

  /* ---------------- CLOUD RENDER ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const SIZE = 72;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const noise = (x, y, t) =>
      Math.sin(x * 2 + t) * Math.cos(y * 2 + t * 0.7);

    const draw = () => {
      timeRef.current += 0.01;
      const t = timeRef.current;
      const cx = SIZE / 2;
      const cy = SIZE / 2;

      ctx.clearRect(0, 0, SIZE, SIZE);

      const base =
        state === "idle" ? 22 :
        state === "listening" ? 26 :
        state === "thinking" ? 30 :
        28;

      const energy =
        state === "idle" ? Math.sin(t) * 0.03 :
        state === "thinking" ? Math.sin(t * 4) * 0.15 :
        energyRef.current * 0.6;

      ctx.beginPath();

      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const n =
          noise(Math.cos(a) * 2, Math.sin(a) * 2, t) * 0.4 +
          noise(Math.cos(a) * 4, Math.sin(a) * 4, t * 0.5) * 0.2;

        const r = base * (1 + n + energy);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.closePath();

      const [c1, c2] = LOLA_COLORS[emotion] || LOLA_COLORS.calm;
      
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
      };

      const rgb1 = hexToRgb(c1);
      const rgb2 = hexToRgb(c2);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2);
      g.addColorStop(0, `rgba(${rgb1.r},${rgb1.g},${rgb1.b},${state === "idle" ? 0.4 : 0.9})`);
      g.addColorStop(0.5, `rgba(${rgb2.r},${rgb2.g},${rgb2.b},0.4)`);
      g.addColorStop(1, `rgba(60,60,60,0.15)`);

      ctx.fillStyle = g;
      ctx.fill();

      ctx.strokeStyle =
        state === "thinking"
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.4)";
      ctx.lineWidth = state === "thinking" ? 1.6 : 1;
      ctx.shadowBlur = state !== "idle" ? 12 : 0;
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, emotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        transition: "transform 600ms ease",
        transform:
          state === "listening" || state === "speaking"
            ? "scale(1.08)"
            : "scale(1)"
      }}
    />
  );
}