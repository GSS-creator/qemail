import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleSystemProps {
  count?: number;
  className?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 50, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      z: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${217 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`
    }));

    // Create particle elements
    particlesRef.current.forEach((particle, index) => {
      const element = document.createElement('div');
      element.className = 'absolute rounded-full pointer-events-none animate-pulse';
      element.style.width = `${particle.size}px`;
      element.style.height = `${particle.size}px`;
      element.style.background = `radial-gradient(circle, ${particle.color}, transparent)`;
      element.style.boxShadow = `0 0 ${particle.size * 2}px ${particle.color}`;
      element.id = `particle-${index}`;
      container.appendChild(element);
    });

    // Animation loop
    const animate = () => {
      const rect = container.getBoundingClientRect();
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
        if (particle.z < 0) particle.z = 100;
        if (particle.z > 100) particle.z = 0;

        // Update DOM element
        const element = container.querySelector(`#particle-${index}`) as HTMLElement;
        if (element) {
          const scale = (particle.z + 50) / 150;
          element.style.left = `${particle.x}px`;
          element.style.top = `${particle.y}px`;
          element.style.transform = `scale(${scale}) translateZ(${particle.z}px)`;
          element.style.opacity = `${particle.opacity * scale}`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up particle elements
      container.querySelectorAll('[id^="particle-"]').forEach(el => el.remove());
    };
  }, [count]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: '1000px' }}
    />
  );
};

export default ParticleSystem;