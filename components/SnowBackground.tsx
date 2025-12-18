import React, { useEffect, useRef } from 'react';

const SnowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Set canvas size
    const resizeCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    
    resizeCanvas();

    const particles: { x: number; y: number; radius: number; speed: number; wind: number; opacity: number }[] = [];
    // Adjust particle count based on screen width for performance
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100); 

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        ctx.fill();
      }
      
      update();
      requestAnimationFrame(draw);
    };

    const update = () => {
      angle += 0.01;
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += p.speed;
        // Add sinusoidal movement for natural sway
        p.x += Math.sin(angle + p.radius) * 0.3 + p.wind;

        // Reset if out of bounds
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width + 5) p.x = -5;
        if (p.x < -5) p.x = width + 5;
      }
    };

    const handleResize = () => {
        resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default SnowBackground;