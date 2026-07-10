import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Server, Zap, Cpu } from 'lucide-react';
import { COMING_SOON_PLATFORMS } from '../utils/prediction';
import GlassCard from './GlassCard';

export default function ComingSoonScreen() {
  // Let's add mock details to make cards feel premium and content-rich
  const extraDetails: Record<string, { progress: number; accuracy: string; capacity: string }> = {
    bcgame: { progress: 88, accuracy: '96.2%', capacity: '1.4 PFLOPS' },
    mostbet: { progress: 74, accuracy: '94.8%', capacity: '850 TFLOPS' },
    onewin: { progress: 91, accuracy: '97.5%', capacity: '2.1 PFLOPS' },
    roobet: { progress: 65, accuracy: '93.1%', capacity: '920 TFLOPS' },
    blaze: { progress: 82, accuracy: '95.4%', capacity: '1.1 PFLOPS' },
    rollbit: { progress: 58, accuracy: '91.8%', capacity: '1.6 PFLOPS' },
    rainbet: { progress: 45, accuracy: '89.2%', capacity: '710 TFLOPS' }
  };

  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4 text-white">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] bg-brand-primary/10 border border-brand-primary/25 text-brand-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1">
          <Cpu size={10} className="animate-spin duration-3000" />
          <span>NEURAL PIPELINE EXPANSION</span>
        </span>
        <h1 className="text-2xl font-black font-display text-white mt-2">Next Gen Platforms</h1>
        <p className="text-xs text-gray-400">DeepMind clusters actively training predictor seed models</p>
      </div>

      {/* STACKED LIST OF PREMIUM LOCKED CARDS */}
      <div className="space-y-4">
        {COMING_SOON_PLATFORMS.map((platform, index) => {
          const detail = extraDetails[platform.id] || { progress: 50, accuracy: '90%', capacity: '500 TFLOPS' };

          return (
            <GlassCard
              key={platform.id}
              glowColor={platform.glowColor}
              delay={index * 0.08}
              hoverGlow={true}
              className="p-5 border border-white/5 bg-zinc-950/40 opacity-90 relative overflow-hidden group"
            >
              {/* Coming soon subtle background diagonal lines */}
              <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(45deg,#fff,#fff_10px,transparent_10px,transparent_20px)] pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Lock Symbol Icon Wrapper */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center relative font-display font-black text-lg border border-white/5 bg-[#121212]"
                    style={{
                      boxShadow: `0 0 15px rgba(255, 255, 255, 0.02)`
                    }}
                  >
                    <span className="opacity-40">{platform.name.charAt(0)}</span>
                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/10 p-1 rounded-lg text-amber-500 shadow-md">
                      <Lock size={10} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-display text-white tracking-wide flex items-center gap-2">
                      <span>{platform.name}</span>
                      <span className="text-[8px] bg-white/5 border border-white/10 text-gray-400 px-1.5 py-0.2 rounded uppercase font-mono">
                        {platform.category}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">{platform.subtitle}</p>
                  </div>
                </div>

                {/* GLOWING COMING SOON BADGE */}
                <div className="flex flex-col items-end">
                  <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                    COMING SOON
                  </span>
                  <span className="text-[8px] text-gray-500 font-mono mt-1.5 flex items-center gap-1">
                    <Server size={8} />
                    {detail.capacity}
                  </span>
                </div>
              </div>

              {/* Training Progress Bar */}
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>Neural Weight Convergence:</span>
                  <span className="text-[#00E676] font-bold">{detail.progress}%</span>
                </div>
                
                {/* Custom glowing progress bar */}
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${detail.progress}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-highlight to-[#00E676]"
                  />
                </div>

                {/* Accuracy Estimate Indicator */}
                <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono">
                  <span>Target Signal Fidelity:</span>
                  <span className="text-gray-300 font-bold">{detail.accuracy}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center text-[10px] text-gray-600 px-4 pb-10 leading-relaxed font-sans">
        All referenced upcoming platform nodes are being modeled locally to respect privacy guidelines. Full integration scheduled next build cycle.
      </div>
    </div>
  );
}
