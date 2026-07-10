import { useState, useEffect } from 'react';
import { Shield, ChevronDown, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../utils/audio';

interface ServerOption {
  code: string;
  name: string;
  flag: string;
}

const SERVERS: ServerOption[] = [
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerOption>(() => {
    const saved = localStorage.getItem('predictx_server_code');
    return SERVERS.find(s => s.code === saved) || SERVERS[1]; // Default to India (IN)
  });

  const handleSelectServer = (server: ServerOption) => {
    audio.playClick();
    setSelectedServer(server);
    localStorage.setItem('predictx_server_code', server.code);
    localStorage.setItem('predictx_server_name', server.name);
    setIsOpen(false);
    
    // Broadcast storage event to update other components in real-time
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090909]/75 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Glow point indicator */}
        <div className="relative w-2.5 h-2.5">
          <span className="absolute inset-0 bg-[#00BFFF] rounded-full animate-ping opacity-75" />
          <span className="relative block w-2.5 h-2.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
        </div>
        <span className="font-display font-black tracking-widest text-white text-base select-none">
          PREDICT<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-highlight">X</span> AI
        </span>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Provably Fair Seal */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 text-[9px] font-mono font-medium text-emerald-400">
          <Shield size={10} />
          <span>PROVABLY SIMULATED</span>
        </div>

        {/* Server Selection Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audio.playClick();
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer text-xs font-bold"
          >
            <span className="text-base leading-none">{selectedServer.flag}</span>
            <span className="text-gray-300 tracking-wider font-mono uppercase">{selectedServer.code}</span>
            <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-zinc-950/95 border border-white/10 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 overflow-hidden"
                >
                  <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                    <div className="flex items-center gap-1 text-[8.5px] font-bold text-gray-500 uppercase tracking-widest">
                      <Globe size={10} />
                      <span>Select AI Server</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {SERVERS.map((server) => {
                      const isSelected = selectedServer.code === server.code;
                      return (
                        <button
                          key={server.code}
                          onClick={() => handleSelectServer(server)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150
                            ${isSelected 
                              ? 'bg-white/10 text-white font-bold' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{server.flag}</span>
                            <span>{server.name}</span>
                          </span>
                          {isSelected && (
                            <Check size={12} className="text-brand-highlight animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

