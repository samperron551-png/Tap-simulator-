import { Pet, Upgrade, Tool, Egg, WhatsNew, RebirthOption, SuperRebirthOption, RebirthUpgrade, SuperRebirthUpgrade, Island, Code } from './types';

export const UPGRADES: Upgrade[] = [
  // Click Upgrades
  {
    id: 'click_power',
    name: 'Click Power',
    description: 'Increases clicks per click',
    basePrice: 15,
    priceMultiplier: 1.15,
    effect: 1,
    type: 'click',
    icon: '👆'
  },
  {
    id: 'click_mult',
    name: 'Click Multiplier',
    description: 'Increases total click power by 5%',
    basePrice: 500,
    priceMultiplier: 1.5,
    effect: 0.05,
    type: 'click',
    icon: '⚡'
  },
  // Auto Upgrades
  {
    id: 'auto_power',
    name: 'Auto Clicker',
    description: 'Increases clicks per second',
    basePrice: 50,
    priceMultiplier: 1.2,
    effect: 1,
    type: 'auto',
    icon: '🤖'
  },
  {
    id: 'auto_speed',
    name: 'Auto Speed',
    description: 'Increases auto clicker speed by 10%',
    basePrice: 2500,
    priceMultiplier: 1.8,
    effect: 0.1,
    type: 'auto',
    icon: '⏩'
  },
  // Gem Upgrades
  {
    id: 'gem_chance',
    name: 'Gem Luck',
    description: 'Increases chance to find gems while clicking',
    basePrice: 1000,
    priceMultiplier: 2.0,
    effect: 0.01,
    type: 'gem',
    icon: '💎',
    maxLevel: 50
  },
  // Luck Upgrades
  {
    id: 'egg_luck',
    name: 'Egg Luck',
    description: 'Increases chance for rare pets from eggs',
    basePrice: 5000,
    priceMultiplier: 2.5,
    effect: 0.05,
    type: 'luck',
    icon: '🍀',
    maxLevel: 20
  }
];

export const PET_DATA: Omit<Pet, 'id'>[] = [
  // Forest Pets (0-8)
  { name: 'Dog', multiplier: 1.2, rarity: 'Common', color: '#8B4513', icon: '🐶' },
  { name: 'Cat', multiplier: 1.2, rarity: 'Common', color: '#FFA500', icon: '🐱' },
  { name: 'Rabbit', multiplier: 1.5, rarity: 'Uncommon', color: '#D3D3D3', icon: '🐰' },
  { name: 'Fox', multiplier: 2.0, rarity: 'Rare', color: '#FF4500', icon: '🦊' },
  { name: 'Bear', multiplier: 3.0, rarity: 'Epic', color: '#A52A2A', icon: '🐻' },
  { name: 'Dragon', multiplier: 10.0, rarity: 'Legendary', color: '#FF0000', icon: '🐲' },
  { name: 'Unicorn', multiplier: 25.0, rarity: 'Legendary', color: '#FF69B4', icon: '🦄' },
  { name: 'Phoenix', multiplier: 100.0, rarity: 'Mythical', color: '#FFD700', icon: '🔥' },
  { name: 'Alien', multiplier: 250.0, rarity: 'Mythical', color: '#00FF00', icon: '👽' },

  // Desert Pets (9-14)
  { name: 'Camel', multiplier: 5.0, rarity: 'Common', color: '#C2B280', icon: '🐪' },
  { name: 'Scorpion', multiplier: 8.0, rarity: 'Uncommon', color: '#800000', icon: '🦂' },
  { name: 'Snake', multiplier: 15.0, rarity: 'Rare', color: '#228B22', icon: '🐍' },
  { name: 'Cactus', multiplier: 30.0, rarity: 'Epic', color: '#006400', icon: '🌵' },
  { name: 'Sphinx', multiplier: 150.0, rarity: 'Legendary', color: '#DAA520', icon: '🦁' },
  { name: 'Anubis', multiplier: 500.0, rarity: 'Mythical', color: '#000000', icon: '⚖️' },

  // Winter Pets (15-20)
  { name: 'Penguin', multiplier: 25.0, rarity: 'Common', color: '#FFFFFF', icon: '🐧' },
  { name: 'Seal', multiplier: 40.0, rarity: 'Uncommon', color: '#C0C0C0', icon: '🦭' },
  { name: 'Polar Bear', multiplier: 75.0, rarity: 'Rare', color: '#F0F8FF', icon: '🐻‍❄️' },
  { name: 'Yeti', multiplier: 200.0, rarity: 'Epic', color: '#B0C4DE', icon: '👹' },
  { name: 'Ice Dragon', multiplier: 1000.0, rarity: 'Legendary', color: '#00BFFF', icon: '❄️' },
  { name: 'Frost Spirit', multiplier: 5000.0, rarity: 'Mythical', color: '#F0FFFF', icon: '👻' },

  // Lava Pets (21-26)
  { name: 'Lava Golem', multiplier: 100.0, rarity: 'Common', color: '#FF4500', icon: '🗿' },
  { name: 'Fire Imp', multiplier: 250.0, rarity: 'Uncommon', color: '#FF0000', icon: '😈' },
  { name: 'Magma Cube', multiplier: 750.0, rarity: 'Rare', color: '#8B0000', icon: '📦' },
  { name: 'Cerberus', multiplier: 2500.0, rarity: 'Epic', color: '#2F4F4F', icon: '🐕' },
  { name: 'Volcano God', multiplier: 15000.0, rarity: 'Legendary', color: '#FF8C00', icon: '🌋' },
  { name: 'Hellhound', multiplier: 50000.0, rarity: 'Mythical', color: '#000000', icon: '🔥' },

  // Secret Pets (27+)
  { name: 'The Void', multiplier: 1000000.0, rarity: 'Secret', color: '#4B0082', icon: '🌑' },
  { name: 'Galaxy Cat', multiplier: 5000000.0, rarity: 'Secret', color: '#8A2BE2', icon: '🌌' },
  { name: 'Time Master', multiplier: 25000000.0, rarity: 'Secret', color: '#FFD700', icon: '⏳' },

  // Cyber Pets (30-35)
  { name: 'Cyber Dog', multiplier: 500.0, rarity: 'Common', color: '#00FF00', icon: '🤖' },
  { name: 'Neon Cat', multiplier: 1000.0, rarity: 'Uncommon', color: '#FF00FF', icon: '🐱' },
  { name: 'Robo Bird', multiplier: 2500.0, rarity: 'Rare', color: '#00FFFF', icon: '🐦' },
  { name: 'Data Core', multiplier: 7500.0, rarity: 'Epic', color: '#FFFFFF', icon: '💾' },
  { name: 'Cyber Dragon', multiplier: 50000.0, rarity: 'Legendary', color: '#7FFF00', icon: '🐉' },
  { name: 'AI Overlord', multiplier: 250000.0, rarity: 'Mythical', color: '#FF1493', icon: '🧠' },

  // Ocean Pets (36-41)
  { name: 'Fish', multiplier: 2500.0, rarity: 'Common', color: '#1E90FF', icon: '🐟' },
  { name: 'Crab', multiplier: 5000.0, rarity: 'Uncommon', color: '#FF4500', icon: '🦀' },
  { name: 'Shark', multiplier: 15000.0, rarity: 'Rare', color: '#708090', icon: '🦈' },
  { name: 'Whale', multiplier: 50000.0, rarity: 'Epic', color: '#4682B4', icon: '🐋' },
  { name: 'Kraken', multiplier: 500000.0, rarity: 'Legendary', color: '#8B0000', icon: '🦑' },
  { name: 'Poseidon', multiplier: 2500000.0, rarity: 'Mythical', color: '#00CED1', icon: '🔱' },

  // Space Pets (42-47)
  { name: 'Astronaut Dog', multiplier: 10000.0, rarity: 'Common', color: '#FFFFFF', icon: '👨‍🚀' },
  { name: 'Moon Cat', multiplier: 25000.0, rarity: 'Uncommon', color: '#D3D3D3', icon: '🌙' },
  { name: 'Star Fox', multiplier: 75000.0, rarity: 'Rare', color: '#FFD700', icon: '🦊' },
  { name: 'Comet Bear', multiplier: 250000.0, rarity: 'Epic', color: '#4169E1', icon: '☄️' },
  { name: 'Solar Dragon', multiplier: 2500000.0, rarity: 'Legendary', color: '#FF4500', icon: '☀️' },
  { name: 'Galactic God', multiplier: 15000000.0, rarity: 'Mythical', color: '#4B0082', icon: '🌌' },

  // Heaven Pets (48-53)
  { name: 'Angel Dog', multiplier: 25000000.0, rarity: 'Common', color: '#FFFFFF', icon: '😇' },
  { name: 'Cloud Cat', multiplier: 50000000.0, rarity: 'Uncommon', color: '#F0F8FF', icon: '☁️' },
  { name: 'Sky Fox', multiplier: 150000000.0, rarity: 'Rare', color: '#87CEEB', icon: '🦊' },
  { name: 'Winged Bear', multiplier: 500000000.0, rarity: 'Epic', color: '#B0C4DE', icon: '🐻' },
  { name: 'Holy Dragon', multiplier: 5000000000.0, rarity: 'Legendary', color: '#FFD700', icon: '🐉' },
  { name: 'God of Sky', multiplier: 25000000000.0, rarity: 'Mythical', color: '#FF4500', icon: '⚡' },

  // Hell Pets (54-59)
  { name: 'Demon Dog', multiplier: 50000000.0, rarity: 'Common', color: '#8B0000', icon: '😈' },
  { name: 'Shadow Cat', multiplier: 100000000.0, rarity: 'Uncommon', color: '#2F4F4F', icon: '🐱' },
  { name: 'Dark Fox', multiplier: 300000000.0, rarity: 'Rare', color: '#000000', icon: '🦊' },
  { name: 'Cursed Bear', multiplier: 1000000000.0, rarity: 'Epic', color: '#4B0082', icon: '🐻' },
  { name: 'Abyssal Dragon', multiplier: 10000000000.0, rarity: 'Legendary', color: '#800080', icon: '🐉' },
  { name: 'Lord of Hell', multiplier: 50000000000.0, rarity: 'Mythical', color: '#FF0000', icon: '🔥' },
  
  // Island 10 Pets (60-66)
  { name: 'Emerald Dog', multiplier: 1000000000.0, rarity: 'Common', color: '#2ecc71', icon: '🐶' },
  { name: 'Emerald Cat', multiplier: 2000000000.0, rarity: 'Uncommon', color: '#2ecc71', icon: '🐱' },
  { name: 'Emerald Fox', multiplier: 5000000000.0, rarity: 'Rare', color: '#2ecc71', icon: '🦊' },
  { name: 'Emerald Golem', multiplier: 10000000000.0, rarity: 'Epic', color: '#2ecc71', icon: '🗿' },
  { name: 'Emerald Dragon', multiplier: 50000000000.0, rarity: 'Legendary', color: '#2ecc71', icon: '🐉' },
  { name: 'Emerald God', multiplier: 100000000000.0, rarity: 'Mythical', color: '#2ecc71', icon: '✨' },
  { name: 'Emerald Secret', multiplier: 500000000000.0, rarity: 'Secret', color: '#2ecc71', icon: '💎' },

  // Island 11 Pets (67-73)
  { name: 'Amber Dog', multiplier: 5000000000.0, rarity: 'Common', color: '#f1c40f', icon: '🐶' },
  { name: 'Amber Cat', multiplier: 10000000000.0, rarity: 'Uncommon', color: '#f1c40f', icon: '🐱' },
  { name: 'Amber Fox', multiplier: 25000000000.0, rarity: 'Rare', color: '#f1c40f', icon: '🦊' },
  { name: 'Amber Golem', multiplier: 50000000000.0, rarity: 'Epic', color: '#f1c40f', icon: '🗿' },
  { name: 'Amber Dragon', multiplier: 250000000000.0, rarity: 'Legendary', color: '#f1c40f', icon: '🐉' },
  { name: 'Amber God', multiplier: 500000000000.0, rarity: 'Mythical', color: '#f1c40f', icon: '✨' },
  { name: 'Amber Secret', multiplier: 2500000000000.0, rarity: 'Secret', color: '#f1c40f', icon: '💎' },

  // Island 12 Pets (74-80)
  { name: 'Sapphire Dog', multiplier: 25000000000.0, rarity: 'Common', color: '#3498db', icon: '🐶' },
  { name: 'Sapphire Cat', multiplier: 50000000000.0, rarity: 'Uncommon', color: '#3498db', icon: '🐱' },
  { name: 'Sapphire Fox', multiplier: 125000000000.0, rarity: 'Rare', color: '#3498db', icon: '🦊' },
  { name: 'Sapphire Golem', multiplier: 250000000000.0, rarity: 'Epic', color: '#3498db', icon: '🗿' },
  { name: 'Sapphire Dragon', multiplier: 1250000000000.0, rarity: 'Legendary', color: '#3498db', icon: '🐉' },
  { name: 'Sapphire God', multiplier: 2500000000000.0, rarity: 'Mythical', color: '#3498db', icon: '✨' },
  { name: 'Sapphire Secret', multiplier: 12500000000000.0, rarity: 'Secret', color: '#3498db', icon: '💎' },
];

export const TOOLS: Tool[] = [
  { id: 'tool_0', name: 'Hand', multiplier: 1, price: 0, icon: '✋' },
  { id: 'tool_1', name: 'Wooden Sword', multiplier: 1.5, price: 100, icon: '🗡️' },
  { id: 'tool_2', name: 'Stone Hammer', multiplier: 3, price: 1000, icon: '🔨' },
  { id: 'tool_3', name: 'Iron Pickaxe', multiplier: 8, price: 10000, icon: '⛏️' },
  { id: 'tool_4', name: 'Golden Axe', multiplier: 25, price: 100000, icon: '🪓' },
  { id: 'tool_5', name: 'Diamond Blade', multiplier: 100, price: 1000000, icon: '💎' },
];

export const EGGS: Egg[] = [
  {
    id: 'egg_basic',
    name: 'Basic Egg',
    price: 250,
    currency: 'clicks',
    color: '#8B4513',
    pets: [
      { petIndex: 0, chance: 0.3 },
      { petIndex: 1, chance: 0.25 },
      { petIndex: 2, chance: 0.2 },
      { petIndex: 3, chance: 0.15 },
      { petIndex: 4, chance: 0.08 },
      { petIndex: 7, chance: 0.019 }, // Mythical
      { petIndex: 27, chance: 0.001 }, // Secret
    ],
  },
  {
    id: 'egg_rare',
    name: 'Rare Egg',
    price: 2500,
    currency: 'clicks',
    color: '#FF4500',
    pets: [
      { petIndex: 2, chance: 0.25 },
      { petIndex: 3, chance: 0.2 },
      { petIndex: 4, chance: 0.15 },
      { petIndex: 5, chance: 0.15 },
      { petIndex: 6, chance: 0.15 },
      { petIndex: 7, chance: 0.09 }, // Mythical
      { petIndex: 27, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_mythic',
    name: 'Mythic Egg',
    price: 25000,
    currency: 'clicks',
    color: '#FF0000',
    pets: [
      { petIndex: 4, chance: 0.25 },
      { petIndex: 5, chance: 0.2 },
      { petIndex: 6, chance: 0.2 },
      { petIndex: 7, chance: 0.15 },
      { petIndex: 8, chance: 0.1 },
      { petIndex: 7, chance: 0.09 }, // Mythical
      { petIndex: 27, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_gem',
    name: 'Gem Egg',
    price: 50,
    currency: 'gems',
    color: '#00FFFF',
    pets: [
      { petIndex: 6, chance: 0.25 },
      { petIndex: 7, chance: 0.2 },
      { petIndex: 8, chance: 0.2 },
      { petIndex: 9, chance: 0.15 },
      { petIndex: 10, chance: 0.1 },
      { petIndex: 7, chance: 0.09 }, // Mythical
      { petIndex: 28, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_desert',
    name: 'Desert Egg',
    price: 250000,
    currency: 'clicks',
    color: '#EDC9AF',
    pets: [
      { petIndex: 9, chance: 0.25 },
      { petIndex: 10, chance: 0.2 },
      { petIndex: 11, chance: 0.15 },
      { petIndex: 12, chance: 0.15 },
      { petIndex: 13, chance: 0.15 },
      { petIndex: 14, chance: 0.09 }, // Mythical
      { petIndex: 27, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_winter',
    name: 'Winter Egg',
    price: 5000000,
    currency: 'clicks',
    color: '#E0FFFF',
    pets: [
      { petIndex: 15, chance: 0.25 },
      { petIndex: 16, chance: 0.2 },
      { petIndex: 17, chance: 0.15 },
      { petIndex: 18, chance: 0.15 },
      { petIndex: 19, chance: 0.15 },
      { petIndex: 20, chance: 0.09 }, // Mythical
      { petIndex: 28, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_lava',
    name: 'Lava Egg',
    price: 100000000,
    currency: 'clicks',
    color: '#FF4500',
    pets: [
      { petIndex: 21, chance: 0.25 },
      { petIndex: 22, chance: 0.2 },
      { petIndex: 23, chance: 0.15 },
      { petIndex: 24, chance: 0.15 },
      { petIndex: 25, chance: 0.15 },
      { petIndex: 26, chance: 0.09 }, // Mythical
      { petIndex: 29, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_cyber',
    name: 'Cyber Egg',
    price: 5000000000,
    currency: 'clicks',
    color: '#00FF00',
    pets: [
      { petIndex: 30, chance: 0.25 },
      { petIndex: 31, chance: 0.2 },
      { petIndex: 32, chance: 0.15 },
      { petIndex: 33, chance: 0.15 },
      { petIndex: 34, chance: 0.15 },
      { petIndex: 35, chance: 0.09 }, // Mythical
      { petIndex: 27, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_ocean',
    name: 'Ocean Egg',
    price: 250000000000,
    currency: 'clicks',
    color: '#0000FF',
    pets: [
      { petIndex: 36, chance: 0.25 },
      { petIndex: 37, chance: 0.2 },
      { petIndex: 38, chance: 0.15 },
      { petIndex: 39, chance: 0.15 },
      { petIndex: 40, chance: 0.15 },
      { petIndex: 41, chance: 0.09 }, // Mythical
      { petIndex: 28, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_space',
    name: 'Space Egg',
    price: 10000000000000,
    currency: 'clicks',
    color: '#4B0082',
    pets: [
      { petIndex: 42, chance: 0.25 },
      { petIndex: 43, chance: 0.2 },
      { petIndex: 44, chance: 0.15 },
      { petIndex: 45, chance: 0.15 },
      { petIndex: 46, chance: 0.15 },
      { petIndex: 47, chance: 0.09 }, // Mythical
      { petIndex: 29, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_heaven',
    name: 'Heaven Egg',
    price: 1000000000000,
    currency: 'clicks',
    color: '#FFFFFF',
    pets: [
      { petIndex: 48, chance: 0.25 },
      { petIndex: 49, chance: 0.2 },
      { petIndex: 50, chance: 0.15 },
      { petIndex: 51, chance: 0.15 },
      { petIndex: 52, chance: 0.15 },
      { petIndex: 53, chance: 0.09 }, // Mythical
      { petIndex: 27, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_hell',
    name: 'Hell Egg',
    price: 100000000000000,
    currency: 'clicks',
    color: '#8B0000',
    pets: [
      { petIndex: 54, chance: 0.25 },
      { petIndex: 55, chance: 0.2 },
      { petIndex: 56, chance: 0.15 },
      { petIndex: 57, chance: 0.15 },
      { petIndex: 58, chance: 0.15 },
      { petIndex: 59, chance: 0.09 }, // Mythical
      { petIndex: 29, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_d2_basic',
    name: 'Island 10 Egg',
    price: 100000000000,
    currency: 'clicks',
    color: '#2ecc71',
    pets: [
      { petIndex: 60, chance: 0.25 },
      { petIndex: 61, chance: 0.2 },
      { petIndex: 62, chance: 0.15 },
      { petIndex: 63, chance: 0.15 },
      { petIndex: 64, chance: 0.15 },
      { petIndex: 65, chance: 0.09 }, // Mythical
      { petIndex: 66, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_d2_desert',
    name: 'Island 11 Egg',
    price: 500000000000,
    currency: 'clicks',
    color: '#f1c40f',
    pets: [
      { petIndex: 67, chance: 0.25 },
      { petIndex: 68, chance: 0.2 },
      { petIndex: 69, chance: 0.15 },
      { petIndex: 70, chance: 0.15 },
      { petIndex: 71, chance: 0.15 },
      { petIndex: 72, chance: 0.09 }, // Mythical
      { petIndex: 73, chance: 0.01 }, // Secret
    ],
  },
  {
    id: 'egg_d2_3',
    name: 'Island 12 Egg',
    price: 2500000000000,
    currency: 'clicks',
    color: '#3498db',
    pets: [
      { petIndex: 74, chance: 0.25 },
      { petIndex: 75, chance: 0.2 },
      { petIndex: 76, chance: 0.15 },
      { petIndex: 77, chance: 0.15 },
      { petIndex: 78, chance: 0.15 },
      { petIndex: 79, chance: 0.09 }, // Mythical
      { petIndex: 80, chance: 0.01 }, // Secret
    ],
  }
];

export const ISLANDS: Island[] = [
  {
    id: 'world_forest',
    name: 'Island 1',
    cost: 0,
    color: 'emerald',
    eggIds: ['egg_basic', 'egg_rare', 'egg_mythic', 'egg_gem']
  },
  {
    id: 'world_desert',
    name: 'Island 2',
    cost: 500000,
    color: 'amber',
    eggIds: ['egg_desert']
  },
  {
    id: 'world_winter',
    name: 'Island 3',
    cost: 25000000,
    color: 'cyan',
    eggIds: ['egg_winter']
  },
  {
    id: 'world_lava',
    name: 'Island 4',
    cost: 1000000000,
    color: 'red',
    eggIds: ['egg_lava']
  },
  {
    id: 'world_cyber',
    name: 'Island 5',
    cost: 50000000000,
    color: 'lime',
    eggIds: ['egg_cyber']
  },
  {
    id: 'world_ocean',
    name: 'Island 6',
    cost: 2500000000000,
    color: 'blue',
    eggIds: ['egg_ocean']
  },
  {
    id: 'world_space',
    name: 'Island 7',
    cost: 100000000000000,
    color: 'indigo',
    eggIds: ['egg_space']
  },
  {
    id: 'world_heaven',
    name: 'Island 8',
    cost: 5000000000000000,
    color: 'sky',
    eggIds: ['egg_heaven']
  },
  {
    id: 'world_hell',
    name: 'Island 9',
    cost: 100000000000000000,
    color: 'rose',
    eggIds: ['egg_hell']
  },
  {
    id: 'd2_world_1',
    name: 'Island 10',
    cost: 1000000000000000000,
    color: 'emerald',
    eggIds: ['egg_d2_basic']
  },
  {
    id: 'd2_world_2',
    name: 'Island 11',
    cost: 5000000000000000000,
    color: 'amber',
    eggIds: ['egg_d2_desert']
  },
  {
    id: 'd2_world_3',
    name: 'Island 12',
    cost: 25000000000000000000,
    color: 'blue',
    eggIds: ['egg_d2_3']
  }
];

export const CODES: Code[] = [
  { code: 'NEWWORLDS', reward: { type: 'clicks', amount: 1000000000 } },
  { code: 'BALANCE', reward: { type: 'gems', amount: 5000 } },
  { code: 'UPDATE210', reward: { type: 'clicks', amount: 50000000000 } }
];

export const REBIRTH_OPTIONS: RebirthOption[] = [
  { id: 'rebirth_1', amount: 1, cost: 5000, gems: 10 },
  { id: 'rebirth_5', amount: 5, cost: 25000, gems: 55 },
  { id: 'rebirth_10', amount: 10, cost: 50000, gems: 120 },
  { id: 'rebirth_50', amount: 50, cost: 250000, gems: 650 },
  { id: 'rebirth_100', amount: 100, cost: 500000, gems: 1500 },
  { id: 'rebirth_500', amount: 500, cost: 2500000, gems: 8000 },
  { id: 'rebirth_1000', amount: 1000, cost: 5000000, gems: 17500 },
  { id: 'rebirth_5000', amount: 5000, cost: 25000000, gems: 100000 },
];

export const SUPER_REBIRTH_OPTIONS: SuperRebirthOption[] = [
  { id: 'sr_1', amount: 1, rebirthsNeeded: 1000, tokens: 1 },
  { id: 'sr_5', amount: 5, rebirthsNeeded: 5000, tokens: 6 },
  { id: 'sr_10', amount: 10, rebirthsNeeded: 10000, tokens: 15 },
];

export const REBIRTH_UPGRADES: RebirthUpgrade[] = [
  {
    id: 'rb_click',
    name: 'Gem Power',
    description: '+100% Click Power per level',
    basePrice: 50,
    priceMultiplier: 2,
    effect: 1.0,
    icon: '⚡',
  },
  {
    id: 'rb_pet_slot',
    name: 'Pet Master',
    description: '+1 Max Equipped Pet',
    basePrice: 500,
    priceMultiplier: 5,
    effect: 1,
    icon: '🐾',
  },
  {
    id: 'rb_gem_mult',
    name: 'Gem Finder',
    description: '+20% Gems from Rebirths',
    basePrice: 250,
    priceMultiplier: 2.5,
    effect: 0.2,
    icon: '💎',
  },
];

export const SUPER_REBIRTH_UPGRADES: SuperRebirthUpgrade[] = [
  {
    id: 'sr_click_mult',
    name: 'Token Surge',
    description: '+500% Click Power per level',
    basePrice: 1,
    priceMultiplier: 3,
    effect: 5.0,
    icon: '🔥',
  },
  {
    id: 'sr_gem_chance',
    name: 'Gem Overflow',
    description: '+50% Gem Chance per level',
    basePrice: 2,
    priceMultiplier: 4,
    effect: 0.5,
    icon: '💠',
  },
  {
    id: 'sr_luck',
    name: 'Divine Luck',
    description: '+25% Egg Luck per level',
    basePrice: 5,
    priceMultiplier: 5,
    effect: 0.25,
    icon: '🌟',
  },
];

export const WHATS_NEW: WhatsNew = {
  title: "Update 2.3.0: ISLAND ADVENTURE!",
  items: [
    { icon: '🏝️', text: 'All worlds are now Islands!' },
    { icon: '🗺️', text: 'Dimensions removed for a smoother journey!' },
    { icon: '💰', text: 'New Island 10, 11, and 12 added with unique pets!' },
    { icon: '🥚', text: 'Fixed eggs for new islands using incorrect pets!' },
    { icon: '🎁', text: 'Use code ISLANDS for a massive boost!' },
  ]
};
