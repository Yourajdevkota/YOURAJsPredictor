import { useState } from 'react';
import { motion } from 'motion/react';
import {
  History,
  Trash2,
  Copy,
  Star,
  Search,
  Check,
  TrendingUp,
  Filter,
  ExternalLink
} from 'lucide-react';
import { Prediction, PlatformId } from '../types';
import { copyToClipboard, saveHistory } from '../utils/prediction';
import GlassCard from './GlassCard';

interface HistoryScreenProps {
  predictions: Prediction[];
  setPredictions: (preds: Prediction[]) => void;
}

export default function HistoryScreen({ predictions, setPredictions }: HistoryScreenProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    const updated = predictions.map(p => {
      if (p.id === id) {
        return { ...p, isFavorite: !p.isFavorite };
      }
      return p;
    });
    setPredictions(updated);
    saveHistory(updated);
  };

  const handleCopy = (multiplier: number, id: string) => {
    const text = `🎯 PredictX AI predicted a ${multiplier.toFixed(2)}x multiplier! (For entertainment only)`;
    copyToClipboard(text).then((success) => {
      if (success) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to permanently clear your local prediction history? This action cannot be undone.")) {
      setPredictions([]);
      saveHistory([]);
    }
  };

  // Filter and search
  const filteredPreds = predictions.filter((p) => {
    const matchesFilter = filter === 'all' || p.platformId === filter;
    const matchesSearch = p.multiplier.toFixed(2).includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-32 px-4 max-w-md mx-auto relative pt-4 text-white">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <span className="text-[10px] bg-[#00E676]/15 border border-[#00E676]/25 text-[#00E676] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          LOCAL DATABASE ARCHIVE
        </span>
        <h1 className="text-2xl font-black font-display text-white mt-2 flex items-center justify-center gap-2">
          <History className="text-brand-primary" />
          <span>Prediction History</span>
        </h1>
        <p className="text-xs text-gray-400">Verifiable session multipliers stored on-device</p>
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Platforms' },
          { id: PlatformId.OneXBet, label: '1xBet' },
          { id: PlatformId.Melbet, label: 'Melbet' },
          { id: PlatformId.Stake, label: 'Stake' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-300 border
              ${filter === btn.id
                ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]/40 shadow-[0_0_10px_rgba(124,77,255,0.4)]'
                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
              }
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* SEARCH INPUT */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by multiplier (e.g., 12.4)..."
          className="w-full bg-[#161616] border border-white/5 hover:border-white/10 focus:border-brand-primary rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none placeholder-zinc-600 transition-all font-mono"
        />
      </div>

      {/* HISTORIC STREAM LIST */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1 mb-2">
          <span className="text-[10px] text-gray-500 font-mono uppercase">
            Showing {filteredPreds.length} entries
          </span>
          {predictions.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={11} />
              Clear Archive
            </button>
          )}
        </div>

        {filteredPreds.length === 0 ? (
          <div className="py-16 text-center text-gray-500 glass-card rounded-2xl p-6 border border-white/5">
            <History size={36} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-sans font-medium">No archived seeds found</p>
            <p className="text-xs text-gray-600 mt-1">Generate a prediction or adjust your query filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPreds.map((p, index) => {
              const date = new Date(p.timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                  className="p-4 bg-gradient-to-r from-[#161616] to-[#121212] border border-white/5 rounded-2xl flex items-center justify-between relative group hover:border-[#7C4DFF]/25 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Tiny platform badge indicator */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xs"
                      style={{
                        background: p.platformId === PlatformId.OneXBet ? 'linear-gradient(135deg, #00BFFF, #121212)' :
                                    p.platformId === PlatformId.Melbet ? 'linear-gradient(135deg, #7C4DFF, #121212)' :
                                    'linear-gradient(135deg, #00E676, #121212)'
                      }}
                    >
                      {p.platformId.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                          {p.platformId === PlatformId.OneXBet ? '1xBet' : p.platformId === PlatformId.Melbet ? 'Melbet' : 'Stake'}
                        </span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span className="text-[9px] text-gray-500 font-mono">{formattedDate} at {formattedTime}</span>
                      </div>
                      <div className="text-lg font-black font-display text-white mt-0.5 tracking-tight flex items-baseline">
                        {p.multiplier.toFixed(2)}
                        <span className="text-gray-500 text-xs font-semibold ml-0.5">x</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
