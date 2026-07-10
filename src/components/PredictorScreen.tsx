import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Star,
  Share2,
  Copy,
  BarChart3,
  Brain,
  History,
  Bell,
  Sliders,
  HelpCircle,
  TrendingUp,
  X,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  AlertTriangle,
  Flame,
  Activity,
  Heart,
  Lock,
  Unlock
} from 'lucide-react';
import { PlatformConfig, Prediction, PlatformStats, PlatformId } from '../types';
import { generateAIInsight, copyToClipboard, saveHistory, saveStats } from '../utils/prediction';
import { audio } from '../utils/audio';
import GlassCard from './GlassCard';
import Platform3DIcon from './Platform3DIcon';
import LoginModal from './LoginModal';

interface PredictorScreenProps {
  platform: PlatformConfig;
  predictions: Prediction[];
  setPredictions: (preds: Prediction[]) => void;
  stats: PlatformStats;
  setStats: (stats: PlatformStats) => void;
}

export default function PredictorScreen({
  platform,
  predictions,
  setPredictions,
  stats,
  setStats
}: PredictorScreenProps) {
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRolling, setCurrentRolling] = useState(1.00);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ title: string; confidence: string; quote: string } | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Verification & Premium lock state
  const [selectedLoginPlat, setSelectedLoginPlat] = useState<'1xbet' | 'melbet' | 'stake' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('predictx_logged_in') === 'true';
  });

  // Keep state in sync with local storage
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('predictx_logged_in') === 'true');
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [showLoginModal]);

  const currentUsageCount = Math.max(
    predictions.length,
    parseInt(localStorage.getItem('predictx_usage_count') || '0', 10)
  );
  const isUsageLimitReached = !isLoggedIn && currentUsageCount >= 7;

  // Stats numbers anim state (to trigger visual load animation)
  const [statsAnim, setStatsAnim] = useState({
    today: 0,
    average: 0.0,
    highest: 0.0,
    total: 0
  });

  // Haptic Feedback simulation
  const triggerHaptic = (ms = 30) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(ms);
      }
    } catch (e) {
      // Caught iframe sandboxed exception safely
    }
  };

  // Run stats visual animation when page/platform changes
  useEffect(() => {
    setStatsAnim({ today: 0, average: 0, highest: 0, total: 0 });
    const duration = 1000; // 1s
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStatsAnim({
        today: Math.floor((stats.predictionsToday * step) / steps),
        average: parseFloat(((stats.averageMultiplier * step) / steps).toFixed(2)),
        highest: parseFloat(((stats.highestGenerated * step) / steps).toFixed(2)),
        total: Math.floor((stats.totalGenerated * step) / steps)
      });

      if (step >= steps) {
        setStatsAnim({
          today: stats.predictionsToday,
          average: stats.averageMultiplier,
          highest: stats.highestGenerated,
          total: stats.totalGenerated
        });
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [platform.id, stats]);

  // Handle generating new prediction
  const handleGenerate = () => {
    if (isGenerating) return;

    if (isUsageLimitReached) {
      triggerHaptic(85);
      audio.playCrash();
      return;
    }
    
    setIsGenerating(true);
    setMultiplier(null);
    setAiInsight(null);
    triggerHaptic(60);
    audio.playClick();

    // Prediction probability: below 6.00x most of the time, sometimes 0 also
    const r = Math.random();
    let finalValue = 0.00;
    if (r < 0.08) {
      finalValue = 0.00; // sometimes 0
    } else if (r < 0.85) {
      // 77% chance: below 6.00x (ranges from 1.00x to 5.99x)
      finalValue = parseFloat((1.00 + Math.random() * 4.99).toFixed(2));
    } else {
      // 15% chance: between 6.00x and 50.00x
      finalValue = parseFloat((6.00 + Math.random() * 44.00).toFixed(2));
    }
    const startVal = finalValue === 0 ? 0.00 : 1.00;
    const rollDuration = 2200; // 2.2s
    const startTime = Date.now();

    const rollInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / rollDuration, 1);
      
      // Cubic easeOut: decelerate towards the end
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = startVal + (finalValue - startVal) * easeProgress;
      
      setCurrentRolling(parseFloat(currentVal.toFixed(2)));
      
      // Play ticking sound
      if (progress < 0.95 && Math.random() > 0.45) {
        audio.playTick(1.3 - progress * 0.6);
      }
      
      // Rapid haptic tap simulation during early fast counting
      if (progress < 0.8 && Math.random() > 0.6) {
        triggerHaptic(15);
      }

      if (progress >= 1) {
        clearInterval(rollInterval);
        
        // Solidify values
        setMultiplier(finalValue);
        setCurrentRolling(finalValue);
        setIsGenerating(false);
        triggerHaptic(100);

        // Play result sound
        if (finalValue === 0) {
          audio.playCrash();
        } else {
          audio.playChime(finalValue);
        }

        // Pre-build AI Insight for this prediction
        const insights = generateAIInsight(finalValue, platform.name);
        setAiInsight(insights);

        // Save prediction item
        const newPred: Prediction = {
          id: 'pred_' + Date.now(),
          platformId: platform.id,
          multiplier: finalValue,
          timestamp: Date.now(),
          isFavorite: false
        };
        const updatedPreds = [newPred, ...predictions];
        setPredictions(updatedPreds);
        saveHistory(updatedPreds);

        // Increment local usage count
        const currentCount = parseInt(localStorage.getItem('predictx_usage_count') || '0', 10);
        localStorage.setItem('predictx_usage_count', String(currentCount + 1));

        // Update statistics
        const newToday = stats.predictionsToday + 1;
        const newTotal = stats.totalGenerated + 1;
        const newHighest = Math.max(stats.highestGenerated, finalValue);
        const newLowest = stats.lowestGenerated === 0 ? finalValue : Math.min(stats.lowestGenerated, finalValue);
        const allMultipliers = updatedPreds.map(p => p.multiplier);
        const newAverage = parseFloat((allMultipliers.reduce((acc, m) => acc + m, 0) / allMultipliers.length).toFixed(2));

        const updatedStats: PlatformStats = {
          predictionsToday: newToday,
          averageMultiplier: newAverage,
          highestGenerated: newHighest,
          lowestGenerated: newLowest,
          totalGenerated: newTotal
        };
        setStats(updatedStats);
        saveStats(updatedStats);
      }
    }, 45);
  };

  const handleCopyText = (val: number) => {
    const text = `🎯 PredictX AI - ${platform.name} Prediction: ${val.toFixed(2)}x Multiplier! (For entertainment purposes only, not real betting advice)`;
    copyToClipboard(text).then((success) => {
      if (success) {
        setCopied(true);
        triggerHaptic(30);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleShare = () => {
    setActiveSheet('share');
    triggerHaptic(30);
  };

  const toggleFavorite = (predId: string) => {
    const updated = predictions.map(p => {
      if (p.id === predId) {
        return { ...p, isFavorite: !p.isFavorite };
      }
      return p;
    });
    setPredictions(updated);
    saveHistory(updated);
    triggerHaptic(30);
  };

  const platformPreds = predictions.filter(p => p.platformId === platform.id);
  const currentFavorite = predictions.find(p => p.platformId === platform.id && p.multiplier === multiplier);

  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4">
      {/* Platform Header Card */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Platform3DIcon platformId={platform.id} size={48} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white tracking-wide">{platform.name}</h1>
            <p className="text-xs text-gray-400 font-sans">{platform.subtitle}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
          <span className="text-[10px] text-emerald-400 font-sans font-semibold">ACTIVE</span>
        </div>
      </div>

      {/* CENTRAL DISPATCH - MULTIPLIER DISPLAY */}
      <div className="relative flex flex-col items-center justify-center py-8 mb-8">
        {/* Glow rings in the background */}
        <div
          className="absolute w-72 h-72 rounded-full opacity-10 filter blur-[45px] animate-pulse transition-colors duration-1000"
          style={{
            background: isGenerating
              ? 'radial-gradient(circle, #7C4DFF 0%, transparent 70%)'
              : `radial-gradient(circle, ${platform.accentColor} 0%, transparent 70%)`
          }}
        />

        {/* The Outer Rim */}
        <div className="relative w-64 h-64 rounded-full flex items-center justify-center p-4">
          {/* PLATFORM-SPECIFIC DISTINCT LOADING ANIMATIONS */}
          {isGenerating && (
            <>
              {/* 1. 1xbet: SONAR RADAR SCANNER SWEEP */}
              {platform.id === '1xbet' && (
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  {/* Rotating Conic Gradient radar beam */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${platform.accentColor}40 0deg, ${platform.accentColor}10 120deg, transparent 270deg, transparent 360deg)`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Pulsing Concentric rings */}
                  <motion.div
                    className="absolute inset-6 rounded-full border border-indigo-500/20"
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-14 rounded-full border border-indigo-400/10"
                    animate={{ scale: [1.15, 0.9, 1.15], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Crosshair lines for the radar look */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-full h-[1px] bg-white" />
                    <div className="h-full w-[1px] bg-white absolute" />
                  </div>
                </div>
              )}

              {/* 2. melbet: SPINNING ORBITAL PLASMA HELIX CORES */}
              {platform.id === 'melbet' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Outer Fast Spin Dash Ring */}
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-dashed border-t-amber-400 border-b-amber-400 border-l-transparent border-r-transparent opacity-60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Inner Fast Reverse Spin Dash Ring */}
                  <motion.div
                    className="absolute inset-3 rounded-full border-2 border-dashed border-l-[#7C4DFF] border-r-[#7C4DFF] border-t-transparent border-b-transparent opacity-60"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Orbiting core dots */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  >
                    {[0, 120, 240].map((angle, idx) => (
                      <div
                        key={idx}
                        className="absolute w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: idx === 0 ? '#7C4DFF' : idx === 1 ? '#00BFFF' : '#FFD700',
                          boxShadow: '0 0 10px currentColor',
                          transform: `rotate(${angle}deg) translate(114px)`
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* 3. stake: CRYPTOGRAPHIC PROVABLY FAIR RIPPLES */}
              {platform.id === 'stake' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
                  {/* Multi-layered expanding ripple waves */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border border-emerald-400/30"
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      initial={{ scale: 0.7, opacity: 0.8 }}
                      animate={{
                        scale: 1.3,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.6,
                      }}
                    />
                  ))}
                  {/* Hexagonal Lattice background rotation */}
                  <motion.div
                    className="absolute inset-6 border border-[#00E676]/15"
                    animate={{ rotate: 180, borderRadius: ["25%", "50%", "25%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ borderRadius: "25%" }}
                  />
                  <motion.div
                    className="absolute inset-10 border border-[#00E676]/25"
                    animate={{ rotate: -180, borderRadius: ["40%", "20%", "40%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ borderRadius: "40%" }}
                  />
                </div>
              )}

              {/* 4. OTHER PLATFORMS (FALLBACK ENHANCED loader) */}
              {platform.id !== '1xbet' && platform.id !== 'melbet' && platform.id !== 'stake' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-transparent border-t-white/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </>
          )}

          {/* Animated SVG Border Circle with stroke-dasharray */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
            <circle
              cx="128"
              cy="128"
              r="116"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="6"
              fill="transparent"
            />
            {isGenerating && (
              <motion.circle
                cx="128"
                cy="128"
                r="116"
                stroke={platform.accentColor}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="728"
                animate={{ strokeDashoffset: [728, 0] }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            )}
            {!isGenerating && multiplier && (
              <circle
                cx="128"
                cy="128"
                r="116"
                stroke="#00E676"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="728"
                strokeDashoffset="0"
                className="transition-colors duration-500"
              />
            )}
          </svg>

          {/* Premium Glass Center Card */}
          <div className="w-52 h-52 rounded-full glass-card flex flex-col items-center justify-center relative shadow-[inset_0_4px_12px_rgba(255,255,255,0.05)] border border-white/10">
            {/* Ambient grid background overlay */}
            <div className="absolute inset-0 rounded-full opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

            {isUsageLimitReached ? (
              <div className="text-center px-4">
                <Lock size={26} className="mx-auto text-amber-400 mb-2.5 animate-bounce" />
                <span className="text-[8px] bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase mb-1.5 inline-block">
                  LIMIT REACHED
                </span>
                <p className="text-[10px] text-gray-300 font-sans leading-relaxed">
                  Connect your Stake, Melbet or 1xBet account to unlock unlimited runs.
                </p>
              </div>
            ) : isGenerating ? (
              <div className="text-center">
                <p className="text-[10px] text-gray-500 font-sans tracking-widest uppercase mb-1">CALCULATING</p>
                <div className="text-4xl font-bold font-display text-white tracking-tight tabular-nums flex items-center justify-center">
                  {currentRolling.toFixed(2)}
                  <span className="text-brand-primary text-xl ml-0.5">x</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-brand-primary animate-bounce delay-100" />
                  <span className="w-1 h-1 rounded-full bg-brand-primary animate-bounce delay-200" />
                  <span className="w-1 h-1 rounded-full bg-brand-primary animate-bounce delay-300" />
                </div>
              </div>
            ) : multiplier ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="text-center"
              >
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase mb-2 inline-block">
                  PREDICTION READY
                </span>
                <div className="text-5xl font-black font-display text-white tracking-tight glow-secondary mb-1">
                  {multiplier.toFixed(2)}
                  <span className="text-[#00E676] text-2xl font-bold">x</span>
                </div>
                <p className="text-[10px] text-gray-400 font-sans tracking-wide">Ready for Next Session</p>
              </motion.div>
            ) : (
              <div className="text-center px-4">
                <Zap size={28} className="mx-auto text-gray-500 mb-2" />
                <p className="text-xs text-gray-400 font-medium font-sans">Predictor Ready</p>
                <p className="text-[9px] text-gray-600 font-sans mt-1 uppercase">TAP GENERATE BELOW</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CORE ACTION OR LIMIT REACHED ACCOUNT CONNECT TILES */}
      <div className="mb-10">
        {isUsageLimitReached ? (
          <div className="space-y-3.5">
            {/* Warning card info */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-2xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={14} />
                <span>Premium Account Connection Required</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                You have reached the limit of 7 free trial predictions. Connect your gaming account to verify your active player status. Your credentials will be verified via WhatsApp for instant authorization.
              </p>
            </div>

            {/* 1xBet Connection Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedLoginPlat('1xbet');
                setShowLoginModal(true);
                audio.playClick();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#0054ff] to-[#002f99] rounded-2xl font-display font-black text-xs text-white border border-blue-400/20 flex items-center justify-between px-5 cursor-pointer shadow-md"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-ping" />
                <span>CONNECT WITH 1XBET</span>
              </span>
              <ChevronRight size={14} className="text-blue-200" />
            </motion.button>

            {/* Melbet Connection Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedLoginPlat('melbet');
                setShowLoginModal(true);
                audio.playClick();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#f5a623] to-[#9b5a00] rounded-2xl font-display font-black text-xs text-white border border-yellow-500/20 flex items-center justify-between px-5 cursor-pointer shadow-md"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
                <span>CONNECT WITH MELBET</span>
              </span>
              <ChevronRight size={14} className="text-yellow-200" />
            </motion.button>

            {/* Stake Connection Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedLoginPlat('stake');
                setShowLoginModal(true);
                audio.playClick();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#00e676] to-[#0f2d1d] rounded-2xl font-display font-black text-xs text-white border border-emerald-400/20 flex items-center justify-between px-5 cursor-pointer shadow-md"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                <span>CONNECT WITH STAKE 1X</span>
              </span>
              <ChevronRight size={14} className="text-emerald-200" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${isGenerating ? 'rgba(124, 77, 255, 0.2)' : 'rgba(0, 191, 255, 0.4)'}` }}
            whileTap={{ scale: 0.97 }}
            disabled={isGenerating}
            onClick={handleGenerate}
            className={`
              w-full py-4.5 rounded-[22px] font-display font-bold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg
              ${isGenerating 
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-primary via-brand-highlight to-brand-primary bg-[size:200%_auto] text-white border border-brand-primary/20 hover:bg-right'
              }
            `}
            style={{
              backgroundImage: isGenerating ? 'none' : 'linear-gradient(135deg, #00BFFF 0%, #7C4DFF 50%, #00BFFF 100%)'
            }}
          >
            {isGenerating ? (
              <>
                <Activity className="animate-spin text-zinc-500" size={18} />
                <span>CALCULATING...</span>
              </>
            ) : (
              <>
                <Sparkles className="animate-pulse" size={18} />
                <span>GENERATE PREDICTION</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* STATS COMPONENT PANEL - Live Animation on mount */}
      <h2 className="text-[10px] font-bold font-display text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1 px-1">
        <BarChart3 size={11} className="text-brand-primary" />
        <span>Platform Live Metrics</span>
      </h2>
      <GlassCard className="grid grid-cols-2 gap-2 p-3 mb-5" glowColor={platform.glowColor} hoverGlow={false}>
        <div className="border-r border-white/5 pr-1.5 py-0.5">
          <p className="text-[9px] text-gray-500 font-sans tracking-wide">Predictions Today</p>
          <div className="text-sm font-black font-display text-white mt-0.5 tabular-nums">
            {statsAnim.today}
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-brand-primary to-transparent rounded-full mt-1" />
        </div>
        <div className="pl-1.5 py-0.5">
          <p className="text-[9px] text-gray-500 font-sans tracking-wide">Average Multiplier</p>
          <div className="text-sm font-black font-display text-[#00E676] mt-0.5 tabular-nums">
            {statsAnim.average.toFixed(2)}x
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent rounded-full mt-1" />
        </div>
        <div className="border-r border-white/5 pr-1.5 pt-1.5 border-t">
          <p className="text-[9px] text-gray-500 font-sans tracking-wide">Highest Generated</p>
          <div className="text-sm font-black font-display text-[#7C4DFF] mt-0.5 tabular-nums">
            {statsAnim.highest.toFixed(2)}x
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent rounded-full mt-1" />
        </div>
        <div className="pl-1.5 pt-1.5 border-t">
          <p className="text-[9px] text-gray-500 font-sans tracking-wide">Total Platform Runs</p>
          <div className="text-sm font-black font-display text-white mt-0.5 tabular-nums">
            {statsAnim.total}
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full mt-1" />
        </div>
      </GlassCard>

      {/* BENTO GRID PREMIUM UTILITY BUTTONS */}
      <h2 className="text-xs font-bold font-display text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 px-1">
        <Sliders size={12} className="text-[#7C4DFF]" />
        <span>PredictX Suite Tools</span>
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {/* Statistics Tool */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveSheet('statistics'); triggerHaptic(30); audio.playClick(); }}
          className="p-4 rounded-2xl glass-card flex flex-col justify-between h-24 text-left border border-white/5 hover:border-brand-primary/20 cursor-pointer"
        >
          <BarChart3 size={18} className="text-brand-primary" />
          <div>
            <div className="text-xs font-bold text-white font-display">Statistics</div>
            <div className="text-[9px] text-gray-500">Live platform indices</div>
          </div>
        </motion.button>

        {/* Platform History */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveSheet('history'); triggerHaptic(30); audio.playClick(); }}
          className="p-4 rounded-2xl glass-card flex flex-col justify-between h-24 text-left border border-white/5 hover:border-[#00E676]/20 cursor-pointer"
        >
          <History size={18} className="text-[#00E676]" />
          <div>
            <div className="text-xs font-bold text-white font-display">Prediction History</div>
            <div className="text-[9px] text-gray-500">Saved multipliers</div>
          </div>
        </motion.button>

        {/* Share Result */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="p-4 rounded-2xl glass-card flex flex-col justify-between h-24 text-left border border-white/5 hover:border-orange-400/20 cursor-pointer"
        >
          <Share2 size={18} className="text-orange-400" />
          <div>
            <div className="text-xs font-bold text-white font-display">Share Result</div>
            <div className="text-[9px] text-gray-500">Export premium slip</div>
          </div>
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveSheet('notifications'); triggerHaptic(30); audio.playClick(); }}
          className="p-4 rounded-2xl glass-card flex flex-col justify-between h-24 text-left border border-white/5 hover:border-amber-400/20 cursor-pointer"
        >
          <Bell size={18} className="text-amber-400" />
          <div>
            <div className="text-xs font-bold text-white font-display">Notifications</div>
            <div className="text-[9px] text-gray-500">System updates</div>
          </div>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveSheet('settings'); triggerHaptic(30); audio.playClick(); }}
          className="p-4 rounded-2xl glass-card flex flex-col justify-between h-24 text-left border border-white/5 hover:border-sky-400/20 cursor-pointer"
        >
          <Sliders size={18} className="text-sky-400" />
          <div>
            <div className="text-xs font-bold text-white font-display">Settings</div>
            <div className="text-[9px] text-gray-500">Vibrations & filters</div>
          </div>
        </motion.button>
      </div>

      {/* ANIMATED PRE-COMPUTED SHEET OVERLAYS (Slide up from bottom) */}
      <AnimatePresence>
        {activeSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="absolute inset-0 bg-[#090909]/90"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#161616] rounded-t-[30px] border-t border-white/10 px-5 pt-4 pb-12 max-h-[80vh] overflow-y-auto no-scrollbar z-50"
            >
              {/* Sheet Drag Indicator Bar */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6" />

              {/* Title & Close */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  {activeSheet === 'statistics' && <BarChart3 className="text-brand-primary" />}
                  {activeSheet === 'history' && <History className="text-[#00E676]" />}
                  {activeSheet === 'share' && <Share2 className="text-orange-400" />}
                  {activeSheet === 'notifications' && <Bell className="text-amber-400" />}
                  {activeSheet === 'settings' && <Sliders className="text-sky-400" />}
                  <span className="capitalize">{activeSheet.replace('_', ' ')}</span>
                </h3>
                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CONTENT DECISION BLOCK */}

              {/* STATISTICS */}
              {activeSheet === 'statistics' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Analytics computed locally from your generated device index. These indexes are updated dynamically upon new prediction requests.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-500 font-sans tracking-wide block">Active Risk Index</span>
                      <span className="text-lg font-bold text-white font-display block mt-1">Medium-High</span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-500 font-sans tracking-wide block">Neural Consistency</span>
                      <span className="text-lg font-bold text-brand-secondary font-display block mt-1">94.8%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <h4 className="text-xs font-bold text-white mb-3">Live Index Summary</h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Total Run Count:</span>
                        <span className="text-white">{stats.totalGenerated}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Highest Run:</span>
                        <span className="text-brand-secondary">{stats.highestGenerated.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Lowest Run:</span>
                        <span className="text-rose-400">{stats.lowestGenerated.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Mean Deviance:</span>
                        <span className="text-brand-primary">{(stats.averageMultiplier * 0.12).toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* HISTORY */}
              {activeSheet === 'history' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 mb-2">Recent runs generated for {platform.name}.</p>
                  {platformPreds.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <History size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No predictions generated yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                      {platformPreds.slice(0, 15).map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between"
                        >
                          <div>
                            <span className="text-base font-bold font-display text-white">{p.multiplier.toFixed(2)}x</span>
                            <span className="text-[10px] text-gray-500 font-mono block">
                              {new Date(p.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SHARE SLIP */}
              {activeSheet === 'share' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Generate an official high-fidelity digital slip of your predictive multiplier to show to friends.
                  </p>
                  
                  {/* Digital Premium Slip Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1E1E1E] to-[#121212] border border-white/10 relative overflow-hidden shadow-2xl">
                    {/* Abstract watermarks */}
                    <div className="absolute right-0 bottom-0 text-[100px] font-black font-display text-white/[0.02] select-none leading-none pointer-events-none">
                      X
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-highlight tracking-wider">
                          PREDICTX AI
                        </span>
                        <span className="text-[8px] bg-brand-primary/10 text-brand-primary font-bold px-1.5 py-0.2 rounded font-mono">
                          VIP SLIP
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-center py-4">
                      <span className="text-[10px] text-gray-400 uppercase font-sans tracking-widest block mb-1">
                        {platform.name} TARGET
                      </span>
                      <div className="text-4xl font-extrabold font-display text-white glow-secondary">
                        {multiplier ? multiplier.toFixed(2) : '18.40'}
                        <span className="text-brand-secondary font-bold text-xl ml-0.5">x</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                      <span>VERIFICATION: SIGNED</span>
                      <span className="text-brand-primary font-bold">PROVABLY SIMULATED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { alert("Exporting Slip Image... saved in mock downloads."); triggerHaptic(30); }}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-center text-xs text-gray-300 font-medium cursor-pointer"
                    >
                      Download PNG
                    </button>
                    <button
                      onClick={() => { handleCopyText(multiplier || 18.40); }}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-center text-xs text-gray-300 font-medium cursor-pointer"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => { alert("Sharing directly... standard API popup triggered."); triggerHaptic(30); }}
                      className="py-3 bg-brand-primary/15 border border-brand-primary/25 hover:bg-brand-primary/25 text-brand-primary rounded-xl text-center text-xs font-bold cursor-pointer"
                    >
                      Share Direct
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeSheet === 'notifications' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">System signal and network events log.</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white font-display">System Update v1.0.8</span>
                        <span className="text-[9px] text-gray-500 font-mono">Active</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        PredictX algorithms upgraded to support hyper-consistent 1xBet neural networks. Enjoy smoother seed animations and reduced latencies.
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-amber-400 font-display flex items-center gap-1">
                          <AlertTriangle size={12} />
                          <span>Platform Alert</span>
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">2h ago</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        High-volatility trends observed on Stake Crash server codes. The PredictX seed engine has safely adjusted default bounds for medium security profiles.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeSheet === 'settings' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">Configure client-side prediction thresholds and system feedback.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Haptic Vibrations</span>
                        <span className="text-[10px] text-gray-500 font-sans">Trigger device pulses on generate</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-brand-primary rounded cursor-pointer"
                        onChange={() => triggerHaptic(40)}
                      />
                    </div>

                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Simulation Risk Weight</span>
                        <span className="text-[10px] text-gray-500 font-sans">High multipliers carry wider standard bounds</span>
                      </div>
                      <select className="bg-[#121212] text-xs text-white border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-brand-primary">
                        <option value="balanced">Balanced (1x - 50x)</option>
                        <option value="conservative">Low Volatility (1x - 5x)</option>
                        <option value="degen">High Octane (10x - 100x)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if(confirm("Are you sure you want to reset all simulated statistics and prediction history? This action is local and irreversible.")) {
                          localStorage.clear();
                          alert("All statistics reset to default states. Please reload the applet.");
                          window.location.reload();
                        }
                      }}
                      className="w-full py-3 bg-red-950/10 border border-red-900/30 text-red-400 rounded-xl text-center text-xs font-bold hover:bg-red-950/20 cursor-pointer"
                    >
                      Clear All Local Seed Data
                    </button>
                  </div>
                </div>
              )}


            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login modal portal for limit lock validation */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginModal(false);
          }}
          defaultPlatform={selectedLoginPlat || '1xbet'}
        />
      )}
    </div>
  );
}
