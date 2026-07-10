import { motion } from 'motion/react';
import { Home, Zap, Clock, User, Settings } from 'lucide-react';
import { ActiveTab } from '../types';
import { audio } from '../utils/audio';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'predictions' as ActiveTab, label: 'Predict', icon: Zap },
    { id: 'history' as ActiveTab, label: 'History', icon: Clock },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#090909]/80 backdrop-blur-xl border-t border-white/5 py-3 px-6 pb-6">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => { onChangeTab(tab.id); audio.playClick(); }}
              className="flex flex-col items-center justify-center relative py-1 px-3 z-10 cursor-pointer w-16"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Sliding Active Indicator Capsule */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#7C4DFF]/15 border border-[#7C4DFF]/25 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? '#00BFFF' : '#8E8E93',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="mb-1"
              >
                <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(0,191,255,0.5)]" : ""} />
              </motion.div>

              <span
                className={`text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-white font-bold' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Dot under active tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabDot"
                  className="absolute bottom-[-6px] w-1 h-1 bg-[#00BFFF] rounded-full shadow-[0_0_6px_#00BFFF]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
