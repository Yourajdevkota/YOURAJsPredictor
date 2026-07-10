import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string; // e.g. rgba(0, 191, 255, 0.45)
  delay?: number;
  hoverGlow?: boolean;
  id?: string;
  key?: any;
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  glowColor,
  delay = 0,
  hoverGlow = true,
  id
}: GlassCardProps) {
  const isClickable = !!onClick;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        isClickable && hoverGlow
          ? {
              scale: 1.02,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: glowColor
                ? `0 10px 30px -5px ${glowColor}, 0 0 15px -3px ${glowColor}`
                : '0 10px 30px -5px rgba(255, 255, 255, 0.05)',
              y: -2
            }
          : undefined
      }
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        glass-card rounded-[22px] p-5 relative overflow-hidden transition-all duration-300
        ${isClickable ? 'cursor-pointer select-none active:opacity-90' : ''}
        ${className}
      `}
      style={{
        boxShadow: !isClickable && glowColor ? `0 0 25px -10px ${glowColor}` : undefined
      }}
    >
      {/* Dynamic ambient background glow inside the card */}
      {glowColor && (
        <div
          className="absolute -right-20 -top-20 w-40 h-40 rounded-full filter blur-[50px] opacity-15 pointer-events-none transition-all duration-700"
          style={{ background: glowColor }}
        />
      )}
      {glowColor && (
        <div
          className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full filter blur-[50px] opacity-10 pointer-events-none transition-all duration-700"
          style={{ background: glowColor }}
        />
      )}
      
      {/* Subtle border highlight shine */}
      <div className="absolute inset-0 rounded-[22px] border border-white/5 pointer-events-none" />

      {/* Ripple Effect Canvas overlay when clicked (will let standard react clicks handle, or simple CSS overlay active state) */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
