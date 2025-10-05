import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  glowColor?: string;
}

const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = "",
  style = {},
  intensity = 1,
  glowColor = "hsl(217, 100%, 50%)"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  const getTransform = () => {
    const { x, y } = mousePosition;
    const rotateX = (y - 0.5) * 20 * intensity;
    const rotateY = (x - 0.5) * 20 * intensity;
    const translateZ = isHovered ? 20 * intensity : 0;
    
    return `
      perspective(1000px) 
      rotateX(${-rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(${translateZ}px)
      scale(${isHovered ? 1.02 : 1})
    `;
  };

  const getGradientPosition = () => {
    const { x, y } = mousePosition;
    return `${x * 100}% ${y * 100}%`;
  };

  return (
    <Card
      ref={cardRef}
      className={`
        glass-surface border-primary/20 transition-all duration-300 ease-out
        relative overflow-hidden group cursor-pointer
        ${className}
      `}
      style={{
        ...style,
        transform: getTransform(),
        transformStyle: 'preserve-3d',
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${glowColor}40, 0 0 0 1px ${glowColor}20` 
          : `0 10px 25px -5px ${glowColor}20`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${getGradientPosition()}, ${glowColor}15, transparent 70%)`,
        }}
      />
      
      {/* Rainbow shimmer effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            ${glowColor}20, 
            hsl(280, 100%, 70%)20, 
            hsl(160, 100%, 50%)20, 
            ${glowColor}20)`,
          backgroundSize: '400% 400%',
          animation: isHovered ? 'holographic 2s ease infinite' : 'none',
        }}
      />

      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent, ${glowColor}30, transparent)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          padding: '1px',
        }}
      />

      <CardContent className="relative z-10">
        {children}
      </CardContent>
    </Card>
  );
};

export default HolographicCard;