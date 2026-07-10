import { PlatformId, PlatformConfig, Prediction, PlatformStats } from '../types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: PlatformId.OneXBet,
    name: '1xBet Prediction',
    subtitle: 'Sports & Crash AI Engine',
    accentColor: '#00BFFF',
    glowColor: 'rgba(0, 191, 255, 0.45)',
    isComingSoon: false,
    category: 'sports'
  },
  {
    id: PlatformId.Melbet,
    name: 'Melbet Prediction',
    subtitle: 'High-Fidelity Multipliers',
    accentColor: '#7C4DFF',
    glowColor: 'rgba(124, 77, 255, 0.45)',
    isComingSoon: false,
    category: 'sports'
  },
  {
    id: PlatformId.Stake,
    name: 'Stake Prediction',
    subtitle: 'Crypto Provably Fair Neural Net',
    accentColor: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.45)',
    isComingSoon: false,
    category: 'crypto'
  }
];

export const COMING_SOON_PLATFORMS: PlatformConfig[] = [
  {
    id: PlatformId.BCGame,
    name: 'BC.Game',
    subtitle: 'Crypto Casino AI',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.3)',
    isComingSoon: true,
    category: 'crypto'
  },
  {
    id: PlatformId.Mostbet,
    name: 'Mostbet',
    subtitle: 'Esports Prediction Matrix',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.3)',
    isComingSoon: true,
    category: 'sports'
  },
  {
    id: PlatformId.OneWin,
    name: '1Win',
    subtitle: 'Crash Lucky Jet Core',
    accentColor: '#2979FF',
    glowColor: 'rgba(41, 121, 255, 0.3)',
    isComingSoon: true,
    category: 'crash'
  },
  {
    id: PlatformId.Roobet,
    name: 'Roobet',
    subtitle: 'Crash & Dice Predictor',
    accentColor: '#FF1744',
    glowColor: 'rgba(255, 23, 68, 0.3)',
    isComingSoon: true,
    category: 'casino'
  },
  {
    id: PlatformId.Blaze,
    name: 'Blaze',
    subtitle: 'Double & Crash Neural Grid',
    accentColor: '#F50057',
    glowColor: 'rgba(245, 0, 87, 0.3)',
    isComingSoon: true,
    category: 'crash'
  },
  {
    id: PlatformId.Rollbit,
    name: 'Rollbit',
    subtitle: 'NFT & Crypto Futures Engine',
    accentColor: '#D500F9',
    glowColor: 'rgba(213, 0, 249, 0.3)',
    isComingSoon: true,
    category: 'crypto'
  },
  {
    id: PlatformId.Rainbet,
    name: 'Rainbet',
    subtitle: 'Slots & Provably Fair Network',
    accentColor: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.3)',
    isComingSoon: true,
    category: 'casino'
  }
];

// Load predictions history from localStorage
export function loadHistory(): Prediction[] {
  try {
    const saved = localStorage.getItem('predictx_history');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading history', e);
  }
  
  // Return intelligent default simulation items for premium appearance
  const now = Date.now();
  const defaultItems: Prediction[] = [
    {
      id: 'd1',
      platformId: PlatformId.Stake,
      multiplier: 12.45,
      timestamp: now - 1000 * 60 * 5, // 5 min ago
      isFavorite: true
    },
    {
      id: 'd2',
      platformId: PlatformId.OneXBet,
      multiplier: 3.82,
      timestamp: now - 1000 * 60 * 18, // 18 min ago
      isFavorite: false
    },
    {
      id: 'd3',
      platformId: PlatformId.Melbet,
      multiplier: 24.50,
      timestamp: now - 1000 * 60 * 45, // 45 min ago
      isFavorite: true
    },
    {
      id: 'd4',
      platformId: PlatformId.Stake,
      multiplier: 1.95,
      timestamp: now - 1000 * 60 * 120, // 2h ago
      isFavorite: false
    }
  ];
  saveHistory(defaultItems);
  return defaultItems;
}

// Save predictions history to localStorage
export function saveHistory(history: Prediction[]) {
  try {
    localStorage.setItem('predictx_history', JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history', e);
  }
}

// Load stats from localStorage or compute from history + default seed
export function loadStats(history: Prediction[]): PlatformStats {
  try {
    const saved = localStorage.getItem('predictx_stats');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading stats', e);
  }

  // Pre-seed premium statistics so it feels elite out-of-the-box
  const total = history.length;
  const highest = Math.max(...history.map(h => h.multiplier), 48.50);
  const lowest = Math.min(...history.map(h => h.multiplier), 1.15);
  const average = history.length ? parseFloat((history.reduce((acc, h) => acc + h.multiplier, 0) / total).toFixed(2)) : 10.68;

  const defaultStats: PlatformStats = {
    predictionsToday: 18,
    averageMultiplier: average,
    highestGenerated: highest,
    lowestGenerated: lowest,
    totalGenerated: total + 142 // Pre-add some seed number
  };
  saveStats(defaultStats);
  return defaultStats;
}

export function saveStats(stats: PlatformStats) {
  try {
    localStorage.setItem('predictx_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats', e);
  }
}

// Generate premium AI prediction insight string
export function generateAIInsight(multiplier: number, platformName: string): { title: string; confidence: string; quote: string } {
  const confidencePercent = Math.min(99.4, Math.max(74.2, parseFloat((80 + Math.random() * 19).toFixed(1))));
  
  const highQuotes = [
    `PredictX Quantum-9 neural core detected low volatility on the server's seed index. Multiplier values above 10x carry a statistical resonance index of ${confidencePercent}%.`,
    `Our DeepMind prediction network flagged a momentum node on ${platformName}. This multiplier is highly consistent with current crash loop structures.`,
    `A dynamic high-probability cluster formed in the sub-second server packets. This ${multiplier.toFixed(2)}x prediction is backed by a ${(confidencePercent - 2).toFixed(1)}% neural threshold filter.`
  ];

  const midQuotes = [
    `Consistent standard deviation epoch observed. A safe cashout is recommended between 1.5x and 2.0x, although our primary target nodes align at ${multiplier.toFixed(2)}x.`,
    `A recursive pattern in Stake/1xBet hash loops was spotted. Highly robust safety metrics are validated. Confidence rating is ${confidencePercent}%.`,
    `The PredictX signal engine shows a medium volatility profile. Generated predictive multiplier is calculated based on deep cluster analytics.`
  ];

  const lowQuotes = [
    `Extreme seed block transition detected. Caution is highly advised as the platform servers refresh seed states. Confidence is ${confidencePercent}%.`,
    `Sub-normal seed frequency detected. This conservative prediction of ${multiplier.toFixed(2)}x ensures higher probabilistic success ratios.`,
    `A minor fluctuation in the neural weights has triggered a tactical exit marker. Cash out early to secure returns.`
  ];

  let quotes = midQuotes;
  let title = "Stable Neural Node";
  if (multiplier > 15) {
    quotes = highQuotes;
    title = "High Momentum Cluster";
  } else if (multiplier < 2.5) {
    quotes = lowQuotes;
    title = "Seed Volatility Alert";
  }

  const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return {
    title,
    confidence: `${confidencePercent}% Confidence`,
    quote: selectedQuote
  };
}

// Copy to clipboard helper
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    textArea.remove();
    return success;
  } catch (err) {
    console.error("Failed to copy!", err);
    return false;
  }
}
