import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, PlatformId, Prediction, PlatformStats } from './types';
import { loadHistory, loadStats, PLATFORMS } from './utils/prediction';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import PredictorScreen from './components/PredictorScreen';
import ProfileScreen from './components/ProfileScreen';
import HistoryScreen from './components/HistoryScreen';
import ComingSoonScreen from './components/ComingSoonScreen';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPlatformId, setSelectedPlatformId] = useState<PlatformId>(PlatformId.OneXBet);
  
  // Data State managed globally for real-time reactive synchronicity
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    predictionsToday: 18,
    averageMultiplier: 8.5,
    highestGenerated: 48.5,
    lowestGenerated: 1.15,
    totalGenerated: 146
  });

  // Load local data on init
  useEffect(() => {
    const loadedHistory = loadHistory();
    setPredictions(loadedHistory);
    
    const loadedStats = loadStats(loadedHistory);
    setStats(loadedStats);
  }, []);

  // Set platform and navigate to predict screen
  const handleSelectPlatform = (platformId: PlatformId) => {
    setSelectedPlatformId(platformId);
    setActiveTab('predictions');
  };

  const handleNavigateToComingSoon = () => {
    // We can show coming soon list or route setting
    // Let's open the Settings or we can show ComingSoon Screen under "Predictions" category or dynamic subtabs
    // Actually, let's route to a special custom display in coming soon screen!
    setActiveTab('predictions'); // We'll render coming soon as part of active tab selector or render a tab in bottom nav?
    // Wait, the bottom nav tabs requested are: Home, Predictions, History, Profile, Settings.
    // The "More Platforms" is coming soon. Let's make "Predictions" tab show:
    // If we click More Platforms card, we can show ComingSoonScreen as an overlay or subview inside the Predictions tab, or select a sub tab!
    // Yes! Let's handle it beautifully in the layout.
    setActiveTab('predictions');
    setSelectedPlatformId(PlatformId.BCGame); // Any coming soon platform triggers ComingSoonScreen!
  };

  const selectedPlatform = PLATFORMS.find(p => p.id === selectedPlatformId);
  const isComingSoonPlatform = selectedPlatformId !== PlatformId.OneXBet && 
                             selectedPlatformId !== PlatformId.Melbet && 
                             selectedPlatformId !== PlatformId.Stake;

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans flex flex-col antialiased no-scrollbar selection:bg-[#7C4DFF] selection:text-white pb-24">
      {/* Background Ambience Shimmers */}
      <div className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#7C4DFF]/15 via-transparent to-transparent filter blur-[80px]" />
      </div>

      {/* Main Bar Header */}
      <Header />

      {/* Primary Dynamic Content Frame */}
      <main className="flex-1 w-full max-w-md mx-auto relative px-1 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === 'predictions' ? selectedPlatformId : '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {/* Tab Router Switch */}
            {activeTab === 'home' && (
              <HomeScreen
                onSelectPlatform={handleSelectPlatform}
                onNavigateToComingSoon={handleNavigateToComingSoon}
                stats={stats}
              />
            )}

            {activeTab === 'predictions' && (
              <>
                {/* Top dynamic sub navigation header inside predictions tab */}
                <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar">
                  {[...PLATFORMS, { id: PlatformId.BCGame, name: 'Locked Platforms', isComingSoon: true }].map((plat) => {
                    const isSelected = (plat.isComingSoon && isComingSoonPlatform) || (!plat.isComingSoon && selectedPlatformId === plat.id);
                    return (
                      <button
                        key={plat.id}
                        onClick={() => setSelectedPlatformId(plat.id)}
                        className={`
                          px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border
                          ${isSelected 
                            ? 'bg-white/10 text-white border-white/20' 
                            : 'bg-white/2 border-white/2 text-gray-500 hover:text-gray-300'
                          }
                        `}
                      >
                        {plat.isComingSoon ? 'Coming Soon' : plat.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                {isComingSoonPlatform ? (
                  <ComingSoonScreen />
                ) : (
                  selectedPlatform && (
                    <PredictorScreen
                      platform={selectedPlatform}
                      predictions={predictions}
                      setPredictions={setPredictions}
                      stats={stats}
                      setStats={setStats}
                    />
                  )
                )}
              </>
            )}

            {activeTab === 'history' && (
              <HistoryScreen
                predictions={predictions}
                setPredictions={setPredictions}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                stats={stats}
                setStats={setStats}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Animated Bottom Navigation Menu with layout sliding indicator */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
