import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Crown,
  Shield,
  Info,
  Smartphone,
  Mail,
  Send,
  Check,
  Globe,
  Sliders,
  Sparkles,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Brain,
  Activity,
  Lock,
  Unlock
} from 'lucide-react';
import { UserProfile } from '../types';
import { audio } from '../utils/audio';
import GlassCard from './GlassCard';
import LoginModal from './LoginModal';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    username: 'PredictX_Alchemist',
    email: 'yspyhacker@gmail.com',
    membership: 'Premium Elite',
    avatarSeed: 'robot-elite',
    language: 'en',
    vibrationEnabled: true
  });

  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('predictx_logged_in') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPlatform, setLoginPlatform] = useState(() => {
    return localStorage.getItem('predictx_login_platform') || '';
  });
  const [loginUser, setLoginUser] = useState(() => {
    return localStorage.getItem('predictx_login_user') || '';
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginPlatform(localStorage.getItem('predictx_login_platform') || '');
    setLoginUser(localStorage.getItem('predictx_login_user') || '');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    audio.playClick();
    localStorage.removeItem('predictx_logged_in');
    localStorage.removeItem('predictx_login_platform');
    localStorage.removeItem('predictx_login_user');
    localStorage.removeItem('predictx_login_pass');
    localStorage.removeItem('predictx_login_extra');
    setIsLoggedIn(false);
    setLoginPlatform('');
    setLoginUser('');
  };

  // Cycle membership badge for fun premium play
  const cycleMembership = () => {
    const grades: ('Free' | 'Premium Elite' | 'VIP Pro' | 'PredictX God')[] = [
      'Free',
      'Premium Elite',
      'VIP Pro',
      'PredictX God'
    ];
    const nextIdx = (grades.indexOf(profile.membership) + 1) % grades.length;
    setProfile({ ...profile, membership: grades[nextIdx] });
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setTimeout(() => {
      setSupportSent(false);
      setSupportMessage('');
      setActiveSubView(null);
    }, 2000);
  };

  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4 text-white">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] bg-[#7C4DFF]/15 border border-[#7C4DFF]/25 text-[#7C4DFF] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          PROFILE SETTINGS
        </span>
        <h1 className="text-2xl font-black font-display text-white mt-2">PredictX Profile</h1>
        <p className="text-xs text-gray-400">Manage account details and app preferences</p>
      </div>

      {/* PREMIUM PROFILE CARD */}
      <GlassCard
        className="p-6 mb-6 relative overflow-hidden"
        glowColor="rgba(124, 77, 255, 0.35)"
        hoverGlow={true}
      >
        {/* Sparkles background effect */}
        <div className="absolute right-2 top-2 text-yellow-400/25 animate-pulse">
          <Crown size={32} />
        </div>

        <div className="flex items-center gap-4">
          {/* Cybernetic Gradient Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary via-[#7C4DFF] to-[#00E676] p-[2px] shadow-[0_0_15px_rgba(124,77,255,0.4)]">
            <div className="w-full h-full bg-[#161616] rounded-2xl flex items-center justify-center text-white font-display font-black text-xl">
              PX
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold font-display text-white tracking-wide">{profile.username}</span>
              <button
                onClick={cycleMembership}
                className="text-[9px] bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-bold px-2 py-0.5 rounded-full cursor-pointer hover:bg-brand-primary/20 transition-all"
                title="Tap to change badge grade"
              >
                Change Badge
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-mono mt-0.5">Premium Account</p>

            {/* Premium Badge Tag */}
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-yellow-500 to-amber-600 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Crown size={10} className="fill-white" />
                {profile.membership}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Shield size={9} />
                Verified
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* UTILITY RAIL / ACTION TILES */}
      <div className="space-y-3 mb-6">
        {/* Linked Accounts Section */}
        {isLoggedIn ? (
          <div
            className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Unlock size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Connected Platform ({loginPlatform.toUpperCase()})</span>
                <span className="text-[10px] text-emerald-400 font-sans font-semibold">Synced: {loginUser} (Unlimited Enabled)</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[9px] bg-red-500/15 border border-red-500/30 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-500/25 transition-colors cursor-pointer font-bold uppercase"
            >
              Unlink
            </button>
          </div>
        ) : (
          <div
            onClick={() => { setShowLoginModal(true); audio.playClick(); }}
            className="p-4 bg-white/5 border border-white/5 hover:border-brand-primary/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Lock size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Link Betting Account</span>
                <span className="text-[10px] text-gray-500 font-sans leading-tight mt-0.5 block">Connect Stake, Melbet or 1xBet for unlimited prediction runs</span>
              </div>
            </div>
            <span className="text-[9px] bg-amber-500/15 border border-amber-500/25 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Required
            </span>
          </div>
        )}

        {/* AI Insights Section */}
        <div
          onClick={() => { setActiveSubView('ai_insights'); audio.playClick(); }}
          className="p-4 bg-white/5 border border-white/5 hover:border-[#7C4DFF]/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C4DFF]/10 flex items-center justify-center text-[#7C4DFF]">
              <Brain size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">AI Insights</span>
              <span className="text-[10px] text-gray-500 font-sans">Dynamic cognitive forecasting insights</span>
            </div>
          </div>
          <ExternalLink size={14} className="text-gray-500" />
        </div>

        {/* Support Support Section */}
        <a
          href="https://wa.me/9779705277321"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { audio.playClick(); }}
          className="p-4 bg-white/5 border border-white/5 hover:border-brand-primary/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <MessageSquare size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Contact Support</span>
              <span className="text-[10px] text-gray-400 font-sans leading-tight block mt-0.5">
                Complain, ask for help, or message the provider on WhatsApp <strong className="text-[#00E676]">9716230013</strong>
              </span>
            </div>
          </div>
          <ExternalLink size={14} className="text-gray-500 flex-shrink-0" />
        </a>

        {/* Theme Settings Tile */}
        <div
          onClick={() => { setActiveSubView('theme'); audio.playClick(); }}
          className="p-4 bg-white/5 border border-white/5 hover:border-[#7C4DFF]/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C4DFF]/10 flex items-center justify-center text-[#7C4DFF]">
              <Sliders size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Theme Options</span>
              <span className="text-[10px] text-gray-500 font-sans">Toggle visual theme presets</span>
            </div>
          </div>
          <ExternalLink size={14} className="text-gray-500" />
        </div>

        {/* Privacy Policy and Disclaimers */}
        <div
          onClick={() => { setActiveSubView('privacy'); audio.playClick(); }}
          className="p-4 bg-white/5 border border-white/5 hover:border-red-400/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <Shield size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Privacy Policy</span>
              <span className="text-[10px] text-gray-500 font-sans">Read our data and privacy guidelines</span>
            </div>
          </div>
          <ExternalLink size={14} className="text-gray-500" />
        </div>
      </div>

      {/* APP INFO CARD */}
      <GlassCard className="p-4 bg-black/40 border border-white/5" hoverGlow={false}>
        <div className="space-y-2 text-xs font-sans text-gray-500">
          <div className="flex justify-between">
            <span>App Version:</span>
            <span className="text-gray-300">1.07.02</span>
          </div>
          <div className="flex justify-between">
            <span>Platform:</span>
            <span className="text-gray-300">Web App</span>
          </div>
          <div className="flex justify-between font-bold text-white border-t border-white/5 pt-2 mt-2">
            <span>Developer:</span>
            <span className="text-[#7C4DFF]">Youraj and predictXTeam</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-2">
            <span>Status:</span>
            <span className="text-emerald-400 font-semibold font-sans">Active & Connected</span>
          </div>
        </div>
      </GlassCard>

      {/* SUBVIEW INTERACTIVE SHEET OVERLAYS */}
      <AnimatePresence>
        {activeSubView && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSubView(null)}
              className="absolute inset-0 bg-black/95"
            />

            {/* Bottom Sheet container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#161616] rounded-t-[30px] border-t border-white/10 p-5 pb-12 max-h-[85vh] overflow-y-auto no-scrollbar z-50 text-white"
            >
              {/* Drag bar */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6" />

              {/* Header Title */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-display flex items-center gap-2 capitalize">
                  {activeSubView === 'ai_insights' && <Brain className="text-[#7C4DFF]" />}
                  {activeSubView === 'theme' && <Sliders className="text-[#7C4DFF]" />}
                  {activeSubView === 'privacy' && <Shield className="text-rose-500" />}
                  <span>{activeSubView === 'ai_insights' ? 'AI Insights' : activeSubView}</span>
                </h3>
                <button
                  onClick={() => setActiveSubView(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                >
                  <Crown size={14} className="rotate-45" />
                </button>
              </div>

              {/* AI INSIGHTS MODULE */}
              {activeSubView === 'ai_insights' && (
                <div className="space-y-4 text-xs font-sans text-gray-400 leading-relaxed">
                  <div className="p-4 bg-[#7C4DFF]/15 border border-[#7C4DFF]/25 rounded-2xl">
                    <span className="text-[10px] font-bold text-[#7C4DFF] tracking-wider uppercase block mb-1">
                      PredictX Intelligence Signal
                    </span>
                    <h4 className="text-base font-bold text-white font-display mb-2">91.8% Network Confidence</h4>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "Our multi-cluster core reports normal seed dispersion. High consistency indices detected across all standard neural networks."
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <h5 className="font-bold text-white flex items-center gap-1.5">
                      <Activity size={14} className="text-brand-primary animate-pulse" />
                      <span>Active Cluster Diagnostics</span>
                    </h5>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>1xBet Neural Node:</span>
                        <span className="text-emerald-400 font-mono font-bold">OPTIMAL</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>Melbet Core Tensor:</span>
                        <span className="text-brand-primary font-mono font-bold">94.2% FIT</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Stake Provably Fair Node:</span>
                        <span className="text-emerald-400 font-mono font-bold">SYNCHRONIZED</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* THEME SELECTOR */}
              {activeSubView === 'theme' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Personalize your interface styling. PredictX is optimized for premium, eye-safe high-contrast dark visualizers.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3.5 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-white block">Cosmic Slate (Default Elite)</span>
                        <span className="text-[10px] text-gray-500">Matte dark, vivid cyan & spring greens</span>
                      </div>
                      <Check size={16} className="text-brand-primary" />
                    </div>
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between cursor-not-allowed opacity-50">
                      <div>
                        <span className="text-xs font-bold text-zinc-400 block">Emerald Matrix (Coming Soon)</span>
                        <span className="text-[10px] text-gray-600">Pure terminal greens & hacker overlays</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between cursor-not-allowed opacity-50">
                      <div>
                        <span className="text-xs font-bold text-zinc-400 block">Fusion Cyberpunk (Coming Soon)</span>
                        <span className="text-[10px] text-gray-600">Deep purple neon & gold grids</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY POLICY & SAFE PLAY */}
              {activeSubView === 'privacy' && (
                <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-white">Local Cache Integrity</h4>
                    <p>
                      We persist your prediction history, favorites list, and simulated metrics locally in your browser storage. We do not collect or upload this data to any servers, keeping it completely private on your device.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal Portal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
