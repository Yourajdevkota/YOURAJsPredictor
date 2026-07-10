import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, SlidersHorizontal, EyeOff, Volume2, RefreshCw, AlertCircle, Check, HelpCircle, X } from 'lucide-react';
import { PlatformStats } from '../types';
import { audio } from '../utils/audio';
import GlassCard from './GlassCard';

interface SettingsScreenProps {
  stats: PlatformStats;
  setStats: (stats: PlatformStats) => void;
}

export default function SettingsScreen({ stats, setStats }: SettingsScreenProps) {
  const [showSuperDisclaimer, setShowSuperDisclaimer] = useState(false);
  const [seed, setSeed] = useState('0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase() + 'f982a7b2e');
  const [isRotating, setIsRotating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('predictx_sound_enabled');
    return saved !== 'false';
  });

  const handleSoundToggle = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('predictx_sound_enabled', String(nextVal));
  };

  const regenerateSeed = () => {
    setIsRotating(true);
    setTimeout(() => {
      const newSeed = '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase() + Math.floor(Math.random() * 16777215).toString(16).toLowerCase();
      setSeed(newSeed);
      setIsRotating(false);
    }, 1000);
  };

  const handleReset = () => {
    if(confirm("Permanently wipe your accumulated metrics? This resets PredictX multipliers to initial default values.")) {
      const defaults = {
        predictionsToday: 0,
        averageMultiplier: 0,
        highestGenerated: 0,
        lowestGenerated: 0,
        totalGenerated: 0
      };
      setStats(defaults);
      localStorage.setItem('predictx_stats', JSON.stringify(defaults));
    }
  };

  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4 text-white">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <span className="text-[10px] bg-[#7C4DFF]/15 border border-[#7C4DFF]/25 text-[#7C4DFF] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          CORE CONSOLES & PRESETS
        </span>
        <h1 className="text-2xl font-black font-display text-white mt-2 flex items-center justify-center gap-2">
          <Sliders className="text-brand-primary animate-pulse" />
          <span>HUD Settings</span>
        </h1>
        <p className="text-xs text-gray-400 font-sans">Toggle telemetry parameters and seed generation controls</p>
      </div>

      {/* SEED LAYER CARD */}
      <GlassCard className="p-5 mb-5 space-y-4 border border-white/5" glowColor="rgba(0, 191, 255, 0.2)">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className={`text-brand-primary ${isRotating ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold text-white">Dynamic Platform Seed</span>
          </div>
          <button
            onClick={regenerateSeed}
            disabled={isRotating}
            className="text-[9px] text-[#7C4DFF] font-black uppercase cursor-pointer hover:text-[#00E676] transition-colors"
          >
            Re-seed
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 font-sans">Active browser pseudo-entropy address:</p>
          <div className="bg-[#121212] p-2.5 rounded-lg border border-white/5 font-mono text-[10px] text-brand-secondary break-all flex justify-between items-center">
            <span>{seed}</span>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ml-2">
              ACTIVE
            </span>
          </div>
        </div>

        <p className="text-[9px] text-gray-500 leading-relaxed font-sans">
          Re-seeding resets browser timestamp deviances, supplying fresh starting vectors for random crash simulations.
        </p>
      </GlassCard>

      {/* TELEMETRY CONTROLS list */}
      <div className="space-y-3 mb-6">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">SFX Alerts</span>
            <span className="text-[10px] text-gray-500 font-sans">Audio feedback when rolling targets match</span>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={handleSoundToggle}
            className="w-5 h-5 accent-[#00BFFF] cursor-pointer"
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3.5 bg-rose-950/15 border border-rose-900/35 hover:bg-rose-950/25 text-rose-400 font-bold rounded-2xl text-xs tracking-wide transition-all cursor-pointer"
        >
          Reset Local Metrics DB
        </button>
      </div>

      {/* Tiny absolute corner button for the professional legalese disclaimer */}
      <div className="flex justify-center pb-10">
        <button
          onClick={() => { setShowSuperDisclaimer(true); audio.playClick(); }}
          className="text-[7px] tracking-widest text-zinc-600 hover:text-zinc-400 uppercase font-mono px-3 py-1 bg-white/[0.01] border border-white/5 rounded-md cursor-pointer transition-all hover:bg-white/[0.03]"
          style={{ fontSize: '7px' }}
        >
          Jurisdictional Aperçu
        </button>
      </div>

      <AnimatePresence>
        {showSuperDisclaimer && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuperDisclaimer(false)}
              className="absolute inset-0 bg-black/95"
            />

            {/* Bottom Sheet container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#161616] rounded-t-[30px] border-t border-white/10 p-6 pb-12 max-h-[85vh] overflow-y-auto no-scrollbar z-50 text-white"
            >
              {/* Drag bar */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6" />

              {/* Title & Close */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
                  <AlertCircle size={12} className="text-[#7C4DFF]" />
                  <span>REGULATORY CODIFIED APERÇU</span>
                </h3>
                <button
                  onClick={() => setShowSuperDisclaimer(false)}
                  className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="space-y-4 text-[10px] font-sans text-gray-400 leading-relaxed text-justify">
                <p className="font-bold text-white text-xs mb-2">
                  HERETOFORE ACKNOWLEDGED REGULATORY APERÇU AND DISPENSATION CONCERNING PROBABILISTIC ALGORITHMIC SEQUENCING
                </p>
                <p>
                  Pursuant to the codified tenets of jurisdictions governing digital simulations, the user hereby accedes to the absolute covenant that the computational outputs of PredictX, including but not limited to rolling multipliers, statistical clusters, and cognitive pseudo-synthesized insights (hereinafter denominated "algorithmic outputs"), represent purely deterministic, speculative, and high-fidelity mathematical modeling configurations.
                </p>
                <p>
                  No warranties, express or implied, are hereby promulgated regarding any correlation between the simulated metrics and actual statistical variances or indices of external wagering platforms or sportsbooks. The interface is designated in perpetuity as a diagnostic, aesthetic, and recreative instrument, devoid of transactional efficacy or financial interface capability.
                </p>
                <p>
                  By engaging with this simulated network, the user holds the proprietary entity harmless from any and all liability, deviance, or misconception arising from the interpretation of these simulated parameters. Any attempt to associate the recreational mathematical indices produced herein with material speculation is strictly beyond the designated scope of the interface architecture.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
