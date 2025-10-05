import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface FloatingIconProps {
  Icon: LucideIcon;
  size?: number;
  color?: string;
  glowColor?: string;
  animationDelay?: number;
  onClick?: () => void;
  className?: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  Icon,
  size = 24,
  color = "hsl(217, 100%, 50%)",
  glowColor = "hsl(217, 100%, 50%)",
  animationDelay = 0,
  onClick,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (onClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick();
    }
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${onClick ? 'hover:scale-110' : ''}
        ${className}
      `}
      style={{
        transform: `
          scale(${isClicked ? 0.95 : isHovered ? 1.1 : 1})
          translateY(${isHovered ? -5 : 0}px)
          rotateY(${isHovered ? 10 : 0}deg)
        `,
        transformStyle: 'preserve-3d',
        animationDelay: `${animationDelay}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse-glow"
        style={{
          background: `radial-gradient(circle, ${glowColor}40, transparent 70%)`,
          transform: `scale(${isHovered ? 1.5 : 1.2})`,
          transition: 'all 0.3s ease-out',
        }}
      />
      
      {/* Glass container */}
      <div
        className="relative glass-surface border border-primary/30 rounded-full p-3 animate-floating"
        style={{
          background: `linear-gradient(135deg, 
            ${color}20, 
            ${color}10, 
            transparent)`,
          boxShadow: `
            0 8px 32px ${glowColor}30,
            inset 0 1px 0 ${color}20,
            inset 0 -1px 0 ${color}10
          `,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Icon */}
        <Icon
          size={size}
          className="relative z-10 animate-bounce-3d"
          style={{
            color: isHovered ? '#ffffff' : color,
            filter: `drop-shadow(0 0 8px ${glowColor}60)`,
            transition: 'all 0.3s ease-out',
          }}
        />
        
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}40, transparent 70%)`,
          }}
        />
      </div>

      {/* Particle trail effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                background: glowColor,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingIcon;