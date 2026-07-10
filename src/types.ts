export enum PlatformId {
  OneXBet = '1xbet',
  Melbet = 'melbet',
  Stake = 'stake',
  BCGame = 'bcgame',
  Mostbet = 'mostbet',
  OneWin = 'onewin',
  Roobet = 'roobet',
  Blaze = 'blaze',
  Rollbit = 'rollbit',
  Rainbet = 'rainbet'
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  subtitle: string;
  logoUrl?: string; // We can use elegant gradients or icon badges
  accentColor: string; // Tailind class or hex color
  glowColor: string; // Glow class
  isComingSoon: boolean;
  category: 'sports' | 'casino' | 'crypto' | 'crash';
}

export interface Prediction {
  id: string;
  platformId: PlatformId;
  multiplier: number;
  timestamp: number; // ms
  isFavorite: boolean;
  notes?: string;
}

export interface PlatformStats {
  predictionsToday: number;
  averageMultiplier: number;
  highestGenerated: number;
  lowestGenerated: number;
  totalGenerated: number;
}

export type ActiveTab = 'home' | 'predictions' | 'history' | 'profile' | 'settings';

export interface UserProfile {
  username: string;
  email: string;
  membership: 'Free' | 'Premium Elite' | 'VIP Pro' | 'PredictX God';
  avatarSeed: string;
  language: 'en' | 'es' | 'ru' | 'fr' | 'ar';
  vibrationEnabled: boolean;
}
