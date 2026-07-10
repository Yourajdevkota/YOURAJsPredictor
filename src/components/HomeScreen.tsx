import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Cpu,
  Zap,
  Star,
  Activity,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { PlatformId, PlatformConfig, PlatformStats } from '../types';
import { PLATFORMS } from '../utils/prediction';
import GlassCard from './GlassCard';
import Platform3DIcon from './Platform3DIcon';

interface HomeScreenProps {
  onSelectPlatform: (id: PlatformId) => void;
  onNavigateToComingSoon: () => void;
  stats: PlatformStats;
}

export default function HomeScreen({
  onSelectPlatform,
  onNavigateToComingSoon,
  stats
}: HomeScreenProps) {
  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4 text-white">
      {/* BRANDING GRAPHICS HERO */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#161616] to-[#0A0A0A] border border-white/5 p-6 mb-8 mt-2">
        {/* Decorative background visualizers */}
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 rounded-full bg-gradient-to-tr from-[#7C4DFF] to-[#00BFFF] opacity-15 filter blur-[40px] animate-pulse" />
        <div className="absolute left-[-20px] bottom-[-20px] w-36 h-36 rounded-full bg-gradient-to-tr from-[#00E676] to-[#7C4DFF] opacity-10 filter blur-[35px]" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="relative inline-block mb-1">
              {/* Green Flame Aura / Backdrop flicker */}
              <motion.div
                className="absolute inset-0 bg-emerald-500/25 rounded-full blur-md"
                animate={{
                  scale: [1, 1.15, 0.95, 1.1, 1],
                  opacity: [0.6, 0.9, 0.7, 0.95, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Flame Particles rising up */}
              <div className="absolute inset-x-0 -top-6 bottom-0 pointer-events-none overflow-visible">
                {[...Array(6)].map((_, i) => {
                  const size = 6 + (i % 3) * 3; // varying particle widths
                  const leftOffset = 10 + i * 16; // spread across the badge width
                  const delay = i * 0.2;
                  const duration = 1.0 + (i % 2) * 0.3;
                  return (
                    <motion.div
                      key={i}
                      className="absolute bottom-1 rounded-full bg-gradient-to-t from-emerald-300 via-emerald-500 to-transparent blur-[1px]"
                      style={{
                        width: size,
                        height: size * 2.2,
                        left: `${leftOffset}%`,
                      }}
                      initial={{ y: 2, scale: 1, opacity: 0 }}
                      animate={{
                        y: -18 - (i % 2) * 8,
                        scale: [0.8, 1.1, 0.5, 0],
                        opacity: [0, 0.9, 0.6, 0],
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: delay,
                      }}
                    />
                  );
                })}
              </div>

              {/* The Badge itself with premium look */}
              <span className="relative z-10 text-[9px] bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full font-bold tracking-widest uppercase inline-flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                PREDICTOR ACTIVE
              </span>
            </div>
            <h1 className="text-3xl font-black font-display tracking-tight text-white mt-3 leading-none">
              PredictX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-highlight to-brand-secondary">AI</span>
            </h1>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Unlock simulated multi-platform crash multipliers. High accuracy prediction simulations.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 pt-4 border-t border-white/5 text-center font-mono">
            <div>
              <span className="text-[7.5px] text-gray-500 uppercase tracking-wider">Platforms</span>
              <span className="text-xs font-black text-white block mt-0.5">3 Live</span>
            </div>
            <div className="border-x border-white/5 px-1">
              <span className="text-[7.5px] text-gray-500 uppercase tracking-wider">Total Runs</span>
              <span className="text-xs font-black text-brand-primary block mt-0.5">{stats.totalGenerated}</span>
            </div>
            <div>
              <span className="text-[7.5px] text-gray-500 uppercase tracking-wider">Avg Yield</span>
              <span className="text-xs font-black text-brand-secondary block mt-0.5">{stats.averageMultiplier.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE HOME SCREEN PLATFORM CARDS DISPLAY */}
      <h2 className="text-xs font-black font-display text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 px-1">
        <Cpu size={12} className="text-brand-primary animate-pulse" />
        <span>Active Platforms</span>
      </h2>

      <div className="space-y-4">
        {PLATFORMS.map((platform, index) => {
          return (
            <GlassCard
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              glowColor={platform.glowColor}
              delay={0.1 + index * 0.08}
              className="p-5 flex items-center justify-between glass-card-hover group border border-white/5 relative"
            >
              <div className="flex items-center gap-4">
                {/* 3D Premium Platform Icon */}
                <div className="transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <Platform3DIcon platformId={platform.id} size={48} />
                </div>

                <div>
                  <h3 className="text-sm font-black font-display text-white tracking-wide">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    {platform.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button Indicator */}
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#7C4DFF] group-hover:text-white transition-all duration-300">
                <ArrowRight size={14} />
              </div>
            </GlassCard>
          );
        })}

        {/* 4th Card: More Platforms (Coming Soon) */}
        <GlassCard
          onClick={onNavigateToComingSoon}
          glowColor="rgba(255, 145, 0, 0.25)"
          delay={0.1 + PLATFORMS.length * 0.08}
          className="p-5 flex items-center justify-between border border-dashed border-white/10 bg-zinc-950/20 hover:border-amber-500/35 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-dashed border-white/10 bg-white/5 text-amber-500">
              <Sparkles size={18} className="animate-pulse" />
            </div>

            <div>
              <h3 className="text-sm font-black font-display text-white tracking-wide">
                More Platforms
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                BC.Game, Roobet, 1Win & more
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
              SOON
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-amber-400 transition-colors">
              <ArrowRight size={14} />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
