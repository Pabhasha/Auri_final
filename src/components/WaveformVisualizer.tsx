import { useEffect, useRef } from "react";

const BAR_COUNT = 32;

const WaveformVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();

    const draw = () => {
      timeRef.current += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barW = w / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        const amplitude =
          Math.sin(timeRef.current * 1.5 + i * 0.3) * 0.3 +
          Math.sin(timeRef.current * 0.7 + i * 0.5) * 0.2 +
          0.5;
        const barH = amplitude * h * 0.8;
        const x = i * barW;
        const y = (h - barH) / 2;

        ctx.fillStyle = `hsla(265, 80%, 65%, ${0.15 + amplitude * 0.25})`;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barW - 4, barH, 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 mb-6 rounded-lg opacity-60"
      aria-hidden="true"
    />
  );
};

export default WaveformVisualizer;
