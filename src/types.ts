export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Secret';

export interface Pet {
  id: string;
  name: string;
  multiplier: number;
  rarity: Rarity;
  color: string;
  icon: string;
  isGolden?: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceMultiplier: number;
  effect: number;
  type: 'click' | 'auto' | 'gem' | 'luck' | 'special';
  maxLevel?: number;
  icon?: string;
}

export interface Tool {
  id: string;
  name: string;
  multiplier: number;
  price: number;
  icon: string;
}

export interface Egg {
  id: string;
  name: string;
  price: number;
  currency: 'clicks' | 'gems';
  pets: { petIndex: number; chance: number }[];
  color: string;
}

export interface GameState {
  clicks: number;
  gems: number;
  totalClicks: number;
  rebirths: number;
  upgrades: Record<string, number>;
  rebirthUpgrades: Record<string, number>;
  currentToolId: string;
  ownedTools: string[];
  pets: Pet[];
  equippedPets: string[];
  maxEquippedPets: number;
  currentIslandId: string;
  unlockedIslands: string[];
  usedCodes: string[];
  autoDelete: Record<Rarity, boolean>;
  tripleHatch: boolean;
  autoHatch: boolean;
  autoHatchEggId: string | null;
  superRebirths: number;
  superRebirthTokens: number;
  superRebirthUpgrades: Record<string, number>;
  settings: {
    music: boolean;
    sfx: boolean;
  };
  lastSave: number;
}

export interface Island {
  id: string;
  name: string;
  cost: number;
  color: string;
  eggIds: string[];
}

export interface Code {
  code: string;
  reward: { type: 'clicks' | 'gems'; amount: number };
}

export interface RebirthOption {
  id: string;
  amount: number;
  cost: number;
  gems: number;
}

export interface SuperRebirthOption {
  id: string;
  amount: number;
  rebirthsNeeded: number;
  tokens: number;
}

export interface RebirthUpgrade {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceMultiplier: number;
  effect: number;
  icon: string;
}

export interface SuperRebirthUpgrade {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceMultiplier: number;
  effect: number;
  icon: string;
}

export interface WhatsNew {
  title: string;
  items: { icon: string; text: string }[];
}
