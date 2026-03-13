/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MousePointer2, 
  TrendingUp, 
  PawPrint, 
  RotateCcw, 
  ShoppingBag, 
  Info, 
  X,
  ChevronRight,
  Zap,
  Trophy,
  Gem,
  Wrench,
  Globe,
  Ticket,
  Settings
} from 'lucide-react';
import { GameState, Pet, Upgrade, Egg, Tool, RebirthOption, SuperRebirthOption, RebirthUpgrade, SuperRebirthUpgrade, Island } from './types';
import { UPGRADES, PET_DATA, WHATS_NEW, EGGS, TOOLS, REBIRTH_OPTIONS, SUPER_REBIRTH_OPTIONS, REBIRTH_UPGRADES, SUPER_REBIRTH_UPGRADES, ISLANDS, CODES } from './constants';
import { formatNumber } from './utils';

const SAVE_KEY = 'clicker_sim_save_v1';

const INITIAL_STATE: GameState = {
  clicks: 0,
  gems: 0,
  totalClicks: 0,
  rebirths: 0,
  upgrades: {},
  rebirthUpgrades: {},
  currentToolId: 'tool_0',
  ownedTools: ['tool_0'],
  pets: [],
  equippedPets: [],
  maxEquippedPets: 3,
  currentIslandId: 'world_forest',
  unlockedIslands: ['world_forest'],
  usedCodes: [],
  autoDelete: {
    'Common': false,
    'Uncommon': false,
    'Rare': false,
    'Epic': false,
    'Legendary': false,
    'Mythical': false,
    'Secret': false
  },
  tripleHatch: false,
  autoHatch: false,
  autoHatchEggId: null,
  superRebirths: 0,
  superRebirthTokens: 0,
  superRebirthUpgrades: {},
  settings: {
    music: true,
    sfx: true,
  },
  lastSave: Date.now(),
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<'shop' | 'upgrades' | 'pets' | 'rebirth' | 'worlds' | 'codes' | 'settings'>('shop');
  const [buyAmount, setBuyAmount] = useState<'1' | '10' | '100' | 'MAX'>('1');
  const [clickAnimations, setClickAnimations] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const [hatchingPet, setHatchingPet] = useState<Pet | null>(null);
  const [showHatchAnim, setShowHatchAnim] = useState(false);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [isMultiDeleteMode, setIsMultiDeleteMode] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(() => {
    const seen = localStorage.getItem('seen_whats_new_1.9');
    return !seen;
  });

  const [hatchingCutscene, setHatchingCutscene] = useState<Pet | null>(null);

  const currentIslands = ISLANDS;
  const currentEggs = EGGS;
  const currentPets = PET_DATA;

  // Refs for game loop
  const stateRef = useRef(state);
  stateRef.current = state;

  // Save game
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  // Calculations
  const getClickPower = useCallback(() => {
    let basePower = 1;
    let multiplier = 1;

    UPGRADES.filter(u => u.type === 'click').forEach(u => {
      const count = state.upgrades[u.id] || 0;
      if (u.id === 'click_power') {
        basePower += count * u.effect;
      } else if (u.id === 'click_mult') {
        multiplier += count * u.effect;
      }
    });
    
    // Tool multiplier
    const currentTool = TOOLS.find(t => t.id === state.currentToolId) || TOOLS[0];
    let power = basePower * currentTool.multiplier * multiplier;

    // Rebirth Upgrades (Click Power)
    const gemPowerLevel = state.rebirthUpgrades['rb_click'] || 0;
    const gemPowerMult = 1 + (gemPowerLevel * 1.0);
    power *= gemPowerMult;

    // Pet multiplier
    let petMult = 1;
    state.pets.filter(p => state.equippedPets.includes(p.id)).forEach(p => {
      const mult = p.isGolden ? p.multiplier * 2 : p.multiplier;
      petMult += (mult - 1);
    });

    // Rebirth multiplier
    const rebirthMult = 1 + state.rebirths * 0.5;

    // Super Rebirth multiplier
    const superRebirthMult = 1 + state.superRebirths * 10;

    // Super Rebirth Upgrades (Click Mult)
    const srClickMultLevel = state.superRebirthUpgrades['sr_click_mult'] || 0;
    const srClickMult = 1 + (srClickMultLevel * 5.0);

    return Math.floor(power * petMult * rebirthMult * superRebirthMult * srClickMult);
  }, [state.upgrades, state.rebirthUpgrades, state.superRebirthUpgrades, state.pets, state.equippedPets, state.rebirths, state.superRebirths, state.currentToolId]);

  const getAutoPower = useCallback(() => {
    let basePower = 0;
    let multiplier = 1;

    UPGRADES.filter(u => u.type === 'auto').forEach(u => {
      const count = state.upgrades[u.id] || 0;
      if (u.id === 'auto_power') {
        basePower += count * u.effect;
      } else if (u.id === 'auto_speed') {
        multiplier += count * u.effect;
      }
    });

    let power = basePower * multiplier;

    // Rebirth Upgrades
    const gemPowerLevel = state.rebirthUpgrades['rb_click'] || 0;
    const gemPowerMult = 1 + (gemPowerLevel * 1.0);
    power *= gemPowerMult;

    // Pet multiplier
    let petMult = 1;
    state.pets.filter(p => state.equippedPets.includes(p.id)).forEach(p => {
      const mult = p.isGolden ? p.multiplier * 2 : p.multiplier;
      petMult += (mult - 1);
    });

    // Rebirth multiplier
    const rebirthMult = 1 + state.rebirths * 0.5;

    // Super Rebirth multiplier
    const superRebirthMult = 1 + state.superRebirths * 10;

    // Super Rebirth Upgrades (Click Mult)
    const srClickMultLevel = state.superRebirthUpgrades['sr_click_mult'] || 0;
    const srClickMult = 1 + (srClickMultLevel * 5.0);

    return Math.floor(power * petMult * rebirthMult * superRebirthMult * srClickMult);
  }, [state.upgrades, state.rebirthUpgrades, state.superRebirthUpgrades, state.pets, state.equippedPets, state.rebirths, state.superRebirths]);

  // Auto-clicker loop
  useEffect(() => {
    const interval = setInterval(() => {
      const auto = getAutoPower();
      if (auto > 0) {
        setState(prev => ({
          ...prev,
          clicks: prev.clicks + auto,
          totalClicks: prev.totalClicks + auto,
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getAutoPower]);

  const handleMainClick = (e: React.MouseEvent) => {
    const power = getClickPower();
    
    // Gem Chance
    const gemChanceLevel = state.upgrades['gem_chance'] || 0;
    const srGemChanceLevel = state.superRebirthUpgrades['sr_gem_chance'] || 0;
    const baseGemChance = 0.01;
    const totalGemChance = (baseGemChance + (gemChanceLevel * 0.01)) * (1 + (srGemChanceLevel * 0.5));
    
    let gemsEarned = 0;
    if (Math.random() < totalGemChance) {
      gemsEarned = 1;
    }

    setState(prev => ({
      ...prev,
      clicks: prev.clicks + power,
      totalClicks: prev.totalClicks + power,
      gems: prev.gems + gemsEarned,
    }));

    // Animation
    const id = Date.now();
    setClickAnimations(prev => [...prev, { id, x: e.clientX, y: e.clientY, value: power }]);
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    const currentCount = state.upgrades[upgrade.id] || 0;
    
    let amountToBuy = 1;
    if (buyAmount === '10') amountToBuy = 10;
    else if (buyAmount === '100') amountToBuy = 100;
    else if (buyAmount === 'MAX') {
      let tempClicks = state.clicks;
      let tempCount = currentCount;
      amountToBuy = 0;
      while (true) {
        const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, tempCount));
        if (tempClicks >= price && (!upgrade.maxLevel || tempCount < upgrade.maxLevel)) {
          tempClicks -= price;
          tempCount++;
          amountToBuy++;
        } else {
          break;
        }
      }
    }

    if (amountToBuy === 0) return;

    // For 1, 10, 100, we need to check if they can afford the total
    let totalCost = 0;
    let tempCount = currentCount;
    let actualBought = 0;
    for (let i = 0; i < amountToBuy; i++) {
      if (upgrade.maxLevel && tempCount >= upgrade.maxLevel) break;
      const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, tempCount));
      if (state.clicks >= totalCost + price) {
        totalCost += price;
        tempCount++;
        actualBought++;
      } else {
        break;
      }
    }

    if (actualBought > 0) {
      setState(prev => {
        const newUpgrades = { ...prev.upgrades };
        newUpgrades[upgrade.id] = (newUpgrades[upgrade.id] || 0) + actualBought;
        return {
          ...prev,
          clicks: prev.clicks - totalCost,
          upgrades: newUpgrades
        };
      });
    }
  };

  const hatchEgg = useCallback((egg: Egg) => {
    const currentState = stateRef.current;
    const hatchCount = currentState.tripleHatch ? 3 : 1;
    const totalPrice = egg.price * hatchCount;
    const currency = egg.currency === 'clicks' ? currentState.clicks : currentState.gems;

    if (currency >= totalPrice) {
      const newPets: Pet[] = [];
      const hatchedForDisplay: Pet[] = [];

      const eggLuckLevel = currentState.upgrades['egg_luck'] || 0;
      const srLuckLevel = currentState.superRebirthUpgrades['sr_luck'] || 0;
      const luckMult = (1 + (eggLuckLevel * 0.05)) * (1 + (srLuckLevel * 0.25));

      for (let i = 0; i < hatchCount; i++) {
        const random = Math.random() / luckMult; // Higher luck makes lower random values, hitting rarer pets
        let cumulativeChance = 0;
        let selectedPetIndex = egg.pets[0].petIndex;

        for (const p of egg.pets) {
          cumulativeChance += p.chance;
          if (random < cumulativeChance) {
            selectedPetIndex = p.petIndex;
            break;
          }
        }

        const selected = currentPets[selectedPetIndex];
        const newPet: Pet = {
          ...selected,
          id: Math.random().toString(36).substr(2, 9),
        };

        if (!currentState.autoDelete[newPet.rarity]) {
          newPets.push(newPet);
          if (newPet.rarity === 'Mythical' || newPet.rarity === 'Secret') {
            setHatchingCutscene(newPet);
          }
        }
        hatchedForDisplay.push(newPet);
      }

      if (hatchedForDisplay.length > 0) {
        setHatchingPet(hatchedForDisplay[hatchedForDisplay.length - 1]);
        setShowHatchAnim(true);
      }

      setState(prev => ({
        ...prev,
        [egg.currency]: (prev[egg.currency] as number) - totalPrice,
        pets: [...prev.pets, ...newPets],
      }));
    }
  }, [currentPets]);

  // Auto Hatch
  useEffect(() => {
    if (!state.autoHatch || !state.autoHatchEggId) return;
    
    const interval = setInterval(() => {
      const egg = currentEggs.find(e => e.id === state.autoHatchEggId);
      if (egg) {
        hatchEgg(egg);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.autoHatch, state.autoHatchEggId, currentEggs, hatchEgg]);

  const getMaxEquippedPets = () => {
    const base = 3;
    const extra = state.rebirthUpgrades['rb_pet_slot'] || 0;
    return base + extra;
  };

  const equipBest = () => {
    const sortedPets = [...state.pets].sort((a, b) => b.multiplier - a.multiplier);
    const max = getMaxEquippedPets();
    const bestIds = sortedPets.slice(0, max).map(p => p.id);
    setState(prev => ({ ...prev, equippedPets: bestIds }));
  };

  const buyTool = (tool: Tool) => {
    if (state.clicks >= tool.price && !state.ownedTools.includes(tool.id)) {
      setState(prev => ({
        ...prev,
        clicks: prev.clicks - tool.price,
        ownedTools: [...prev.ownedTools, tool.id],
        currentToolId: tool.id
      }));
    } else if (state.ownedTools.includes(tool.id)) {
      setState(prev => ({ ...prev, currentToolId: tool.id }));
    }
  };

  const togglePet = (petId: string) => {
    if (isMultiDeleteMode) {
      setSelectedPets(prev => 
        prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
      );
      return;
    }
    setState(prev => {
      const isEquipped = prev.equippedPets.includes(petId);
      const max = getMaxEquippedPets();
      if (isEquipped) {
        return { ...prev, equippedPets: prev.equippedPets.filter(id => id !== petId) };
      } else {
        if (prev.equippedPets.length < max) {
          return { ...prev, equippedPets: [...prev.equippedPets, petId] };
        }
        return prev;
      }
    });
  };

  const deleteSelectedPets = () => {
    if (selectedPets.length === 0) return;
    setState(prev => ({
      ...prev,
      pets: prev.pets.filter(p => !selectedPets.includes(p.id)),
      equippedPets: prev.equippedPets.filter(id => !selectedPets.includes(id))
    }));
    setSelectedPets([]);
    setIsMultiDeleteMode(false);
  };

  const rebirth = (option: RebirthOption) => {
    if (state.clicks >= option.cost) {
      const gemMultLevel = state.rebirthUpgrades['rb_gem_mult'] || 0;
      const gemMult = 1 + (gemMultLevel * 0.2);
      const gemsEarned = Math.floor(option.gems * gemMult);
      
      setState(prev => ({
        ...INITIAL_STATE,
        rebirths: prev.rebirths + option.amount,
        gems: prev.gems + gemsEarned,
        pets: prev.pets,
        equippedPets: prev.equippedPets,
        ownedTools: prev.ownedTools,
        currentToolId: prev.currentToolId,
        rebirthUpgrades: prev.rebirthUpgrades, // Keep permanent upgrades
        currentIslandId: prev.currentIslandId,
        unlockedIslands: prev.unlockedIslands,
      }));
    }
  };

  const superRebirth = (option: SuperRebirthOption) => {
    if (state.rebirths >= option.rebirthsNeeded) {
      setState(prev => ({
        ...INITIAL_STATE,
        superRebirths: prev.superRebirths + option.amount,
        superRebirthTokens: prev.superRebirthTokens + option.tokens,
        superRebirthUpgrades: prev.superRebirthUpgrades, // Keep SR upgrades
        ownedTools: prev.ownedTools,
        currentToolId: prev.currentToolId,
        settings: prev.settings,
      }));
    }
  };

  const travelToIsland = (islandId: string) => {
    if (state.unlockedIslands.includes(islandId)) {
      setState(prev => ({ ...prev, currentIslandId: islandId }));
    }
  };

  const buySuperRebirthUpgrade = (upgrade: SuperRebirthUpgrade) => {
    const currentCount = state.superRebirthUpgrades[upgrade.id] || 0;
    const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentCount));

    if (state.superRebirthTokens >= price) {
      setState(prev => {
        const newUpgrades = { ...prev.superRebirthUpgrades };
        newUpgrades[upgrade.id] = (newUpgrades[upgrade.id] || 0) + 1;
        return {
          ...prev,
          superRebirthTokens: prev.superRebirthTokens - price,
          superRebirthUpgrades: newUpgrades
        };
      });
    }
  };

  const buyRebirthUpgrade = (upgrade: RebirthUpgrade) => {
    const currentCount = state.rebirthUpgrades[upgrade.id] || 0;
    const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentCount));

    if (state.gems >= price) {
      setState(prev => {
        const newUpgrades = { ...prev.rebirthUpgrades };
        newUpgrades[upgrade.id] = (newUpgrades[upgrade.id] || 0) + 1;
        return {
          ...prev,
          gems: prev.gems - price,
          rebirthUpgrades: newUpgrades
        };
      });
    }
  };

  const closeWhatsNew = () => {
    localStorage.setItem('seen_whats_new_1.9', 'true');
    setShowWhatsNew(false);
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      setState(INITIAL_STATE);
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  const toggleSetting = (setting: 'music' | 'sfx') => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));
  };

  const unlockIsland = (islandId: string) => {
    const island = currentIslands.find(w => w.id === islandId);
    if (!island) return;
    if (state.clicks >= island.cost && !state.unlockedIslands.includes(islandId)) {
      setState(prev => ({
        ...prev,
        clicks: prev.clicks - island.cost,
        unlockedIslands: [...prev.unlockedIslands, islandId],
        currentIslandId: islandId
      }));
    }
  };

  const redeemCode = (codeStr: string) => {
    const code = CODES.find(c => c.code.toUpperCase() === codeStr.toUpperCase());
    if (code && !state.usedCodes.includes(code.code)) {
      setState(prev => ({
        ...prev,
        clicks: code.reward.type === 'clicks' ? prev.clicks + code.reward.amount : prev.clicks,
        gems: code.reward.type === 'gems' ? prev.gems + code.reward.amount : prev.gems,
        usedCodes: [...prev.usedCodes, code.code]
      }));
      return true;
    }
    return false;
  };

  const makeGolden = (petName: string) => {
    const matchingPets = state.pets.filter(p => p.name === petName && !p.isGolden);
    if (matchingPets.length >= 5) {
      const petsToRemove = matchingPets.slice(0, 5).map(p => p.id);
      const newPet: Pet = {
        ...matchingPets[0],
        id: `pet_${Date.now()}`,
        isGolden: true,
      };
      
      setState(prev => ({
        ...prev,
        pets: [...prev.pets.filter(p => !petsToRemove.includes(p.id)), newPet],
        equippedPets: prev.equippedPets.filter(id => !petsToRemove.includes(id))
      }));
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-[#1A1D23] overflow-hidden flex flex-col">
      {/* Header / Stats */}
      <div className="bg-white border-b border-black/5 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
          <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Zap size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Clicker Sim</h1>
            <p className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Update 1.3</p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-black/5 px-4 py-1.5 rounded-full border border-black/5 flex items-center gap-2">
              <Globe size={14} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest">
                {currentIslands.find(w => w.id === state.currentIslandId)?.name || 'Forest'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowWhatsNew(true)}
            className="ml-auto sm:ml-2 p-2 hover:bg-black/5 rounded-lg text-blue-500 transition-colors"
          >
            <Info size={18} />
          </button>
        </div>
        
        <div className="flex gap-2 md:gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <div className="bg-[#F8F9FA] px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-black/5 flex items-center gap-2 shrink-0">
            <MousePointer2 size={16} className="text-blue-500 md:w-[18px]" />
            <span className="font-bold text-sm md:text-lg">{formatNumber(state.clicks)}</span>
          </div>
          <div className="bg-[#F8F9FA] px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-black/5 flex items-center gap-2 shrink-0">
            <Gem size={16} className="text-cyan-500 md:w-[18px]" />
            <span className="font-bold text-sm md:text-lg">{formatNumber(state.gems)}</span>
          </div>
          <div className="bg-[#F8F9FA] px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-black/5 flex items-center gap-2 shrink-0">
            <RotateCcw size={16} className="text-purple-500 md:w-[18px]" />
            <span className="font-bold text-sm md:text-lg">{formatNumber(state.rebirths)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Click Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative bg-gradient-to-b from-blue-50 to-white min-h-[350px]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMainClick}
            className="w-48 h-48 md:w-64 md:h-64 bg-blue-500 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white cursor-pointer border-8 border-white/20 relative group"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
            <span className="text-6xl md:text-8xl relative z-10">
              {TOOLS.find(t => t.id === state.currentToolId)?.icon || '✋'}
            </span>
          </motion.button>
          
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] md:text-sm mb-1 md:mb-2">Click Power</p>
            <p className="text-2xl md:text-4xl font-black text-blue-600">+{formatNumber(getClickPower())}</p>
            <p className="mt-1 md:mt-2 text-black/30 font-medium text-xs md:text-base">Auto: {formatNumber(getAutoPower())}/s</p>
          </div>

          {/* Click Animations */}
          <AnimatePresence>
            {clickAnimations.map(anim => (
              <motion.div
                key={anim.id}
                initial={{ opacity: 1, y: anim.y - 20, x: anim.x }}
                animate={{ opacity: 0, y: anim.y - 150 }}
                exit={{ opacity: 0 }}
                className="fixed pointer-events-none text-2xl font-black text-blue-500 z-50 drop-shadow-md"
              >
                +{anim.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side: UI Panels */}
        <div className="w-full md:w-[450px] bg-white border-l border-black/5 flex flex-col shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-black/5 p-2 gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'shop', icon: ShoppingBag, label: 'Shop' },
              { id: 'upgrades', icon: Zap, label: 'Upgrades' },
              { id: 'pets', icon: PawPrint, label: 'Pets' },
              { id: 'rebirth', icon: RotateCcw, label: 'Rebirth' },
              { id: 'worlds', icon: Globe, label: 'Islands' },
              { id: 'codes', icon: Ticket, label: 'Codes' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[70px] py-2 md:py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-black/40 hover:bg-black/5'
                }`}
              >
                <tab.icon size={18} className="md:w-5 md:h-5" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(activeTab === 'shop' || activeTab === 'upgrades') && (
              <div className="flex gap-2 mb-4">
                {(['1', '10', '100', 'MAX'] as const).map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                      buyAmount === amount
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                        : 'bg-white border-black/5 text-black/40 hover:border-black/10'
                    }`}
                  >
                    {amount === 'MAX' ? 'MAX' : `x${amount}`}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-black/30 uppercase tracking-widest">Hatch Settings</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setState(prev => ({ ...prev, tripleHatch: !prev.tripleHatch }))}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                        state.tripleHatch ? 'border-blue-500 bg-blue-50' : 'border-black/5 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <Zap size={18} />
                        </div>
                        <span className="text-xs font-black">Triple Hatch (3x Price)</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${state.tripleHatch ? 'bg-blue-500' : 'bg-black/10'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.tripleHatch ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Auto Delete</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Common', 'Uncommon', 'Rare', 'Epic'] as const).map(rarity => (
                      <button
                        key={rarity}
                        onClick={() => setState(prev => ({
                          ...prev,
                          autoDelete: { ...prev.autoDelete, [rarity]: !prev.autoDelete[rarity] }
                        }))}
                        className={`p-2 rounded-xl border-2 flex items-center justify-between transition-all ${
                          state.autoDelete[rarity] ? 'border-red-500 bg-red-50' : 'border-black/5 bg-white'
                        }`}
                      >
                        <span className="text-[10px] font-black">{rarity}</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${state.autoDelete[rarity] ? 'bg-red-500' : 'bg-black/10'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${state.autoDelete[rarity] ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-black/30 uppercase tracking-widest">Eggs</h3>
                    <button
                      onClick={() => setState(prev => ({ ...prev, autoHatch: !prev.autoHatch }))}
                      className={`text-[10px] font-black px-3 py-1 rounded-full shadow-md transition-all ${state.autoHatch ? 'bg-red-500 text-white' : 'bg-black/5 text-black/40'}`}
                    >
                      AUTO-HATCH: {state.autoHatch ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentEggs.filter(egg => {
                      const currentIsland = currentIslands.find(w => w.id === state.currentIslandId);
                      return currentIsland?.eggIds.includes(egg.id);
                    }).map(egg => (
                      <button
                        key={egg.id}
                        onClick={() => {
                          setState(prev => ({ ...prev, autoHatchEggId: egg.id }));
                          hatchEgg(egg);
                        }}
                        disabled={(egg.currency === 'clicks' ? state.clicks : state.gems) < egg.price}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          (egg.currency === 'clicks' ? state.clicks : state.gems) >= egg.price
                            ? 'border-black/10 bg-white hover:shadow-lg'
                            : 'border-black/5 bg-black/[0.02] opacity-60'
                        } ${state.autoHatchEggId === egg.id && state.autoHatch ? 'ring-2 ring-red-500' : ''}`}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
                          style={{ backgroundColor: egg.color + '20', color: egg.color }}
                        >
                          🥚
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-sm">{egg.name}</h4>
                          <div className="flex items-center gap-1">
                            {egg.currency === 'clicks' ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            ) : (
                              <Gem size={10} className="text-cyan-500" />
                            )}
                            <span className="text-xs font-black text-black/40">{formatNumber(egg.price)}</span>
                          </div>
                          <div className="text-[9px] font-bold text-black/30 mt-1">
                            {egg.pets.map(p => `${currentPets[p.petIndex].name} (${currentPets[p.petIndex].rarity}) (${(p.chance * 100).toFixed(0)}%)`).join(', ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Tools</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {TOOLS.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => buyTool(tool)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          state.currentToolId === tool.id
                            ? 'border-blue-500 bg-blue-50'
                            : state.ownedTools.includes(tool.id)
                            ? 'border-black/5 bg-white hover:border-blue-200'
                            : state.clicks >= tool.price
                            ? 'border-black/5 bg-white hover:border-blue-500/30'
                            : 'border-black/5 bg-black/[0.02] opacity-60'
                        }`}
                      >
                        <div className="text-3xl">{tool.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-black text-sm">{tool.name}</h4>
                          <p className="text-[10px] font-bold text-black/40">x{tool.multiplier} Click Power</p>
                          {!state.ownedTools.includes(tool.id) && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-full" />
                              <span className="text-xs font-black text-blue-600">{formatNumber(tool.price)}</span>
                            </div>
                          )}
                        </div>
                        {state.currentToolId === tool.id ? (
                          <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded-full">EQUIPPED</span>
                        ) : state.ownedTools.includes(tool.id) ? (
                          <span className="text-[10px] font-black bg-black/5 text-black/40 px-2 py-1 rounded-full">OWNED</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'upgrades' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Click Upgrades</h3>
                  <div className="space-y-3">
                    {UPGRADES.filter(u => u.type === 'click').map(u => {
                      const count: number = state.upgrades[u.id] || 0;
                      const price = Math.floor(u.basePrice * Math.pow(u.priceMultiplier, count));
                      return (
                        <UpgradeCard 
                          key={u.id} 
                          upgrade={u} 
                          count={count} 
                          price={price} 
                          canAfford={state.clicks >= price}
                          onClick={() => buyUpgrade(u)}
                        />
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Auto Upgrades</h3>
                  <div className="space-y-3">
                    {UPGRADES.filter(u => u.type === 'auto').map(u => {
                      const count: number = state.upgrades[u.id] || 0;
                      const price = Math.floor(u.basePrice * Math.pow(u.priceMultiplier, count));
                      return (
                        <UpgradeCard 
                          key={u.id} 
                          upgrade={u} 
                          count={count} 
                          price={price} 
                          canAfford={state.clicks >= price}
                          onClick={() => buyUpgrade(u)}
                        />
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Special Upgrades</h3>
                  <div className="space-y-3">
                    {UPGRADES.filter(u => u.type === 'gem' || u.type === 'luck' || u.type === 'special').map(u => {
                      const count: number = state.upgrades[u.id] || 0;
                      const price = Math.floor(u.basePrice * Math.pow(u.priceMultiplier, count));
                      return (
                        <UpgradeCard 
                          key={u.id} 
                          upgrade={u} 
                          count={count} 
                          price={price} 
                          canAfford={state.clicks >= price}
                          onClick={() => buyUpgrade(u)}
                        />
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'pets' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={equipBest}
                      disabled={isMultiDeleteMode}
                      className={`text-[10px] font-black px-3 py-1 rounded-full shadow-md transition-all ${isMultiDeleteMode ? 'bg-gray-400 opacity-50' : 'bg-blue-500 text-white'}`}
                    >
                      EQUIP BEST
                    </button>
                    <span className="text-xs font-bold text-blue-500">{state.equippedPets.length}/{getMaxEquippedPets()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMultiDeleteMode ? (
                      <>
                        <button 
                          onClick={deleteSelectedPets}
                          className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-full shadow-md"
                        >
                          DELETE ({selectedPets.length})
                        </button>
                        <button 
                          onClick={() => {
                            setIsMultiDeleteMode(false);
                            setSelectedPets([]);
                          }}
                          className="text-[10px] font-black bg-gray-500 text-white px-3 py-1 rounded-full shadow-md"
                        >
                          CANCEL
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsMultiDeleteMode(true)}
                        className="text-[10px] font-black bg-orange-500 text-white px-3 py-1 rounded-full shadow-md"
                      >
                        MULTI-DELETE
                      </button>
                    )}
                  </div>
                </div>

                {state.pets.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from(new Set(state.pets.map(p => p.name))).map((petName: string) => {
                      const count = state.pets.filter(p => p.name === petName && !p.isGolden).length;
                      
                      return (
                        <div key={petName} className="space-y-2">
                          {count >= 5 && !isMultiDeleteMode && (
                            <button 
                              onClick={() => makeGolden(petName)}
                              className="w-full py-1.5 bg-yellow-400 text-white text-[10px] font-black rounded-xl shadow-sm hover:bg-yellow-500 transition-colors flex items-center justify-center gap-1"
                            >
                              ✨ MAKE GOLDEN (5)
                            </button>
                          )}
                          {state.pets.filter(p => p.name === petName).map(pet => (
                            <button
                              key={pet.id}
                              onClick={() => togglePet(pet.id)}
                              className={`w-full p-4 rounded-2xl border-2 transition-all relative overflow-hidden text-left ${
                                isMultiDeleteMode
                                  ? selectedPets.includes(pet.id)
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-black/5 bg-white'
                                  : state.equippedPets.includes(pet.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-black/5 bg-white hover:border-black/10'
                              } ${pet.isGolden ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                            >
                              <div className="text-4xl mb-2">{pet.icon}</div>
                              <div className="font-black text-sm">{pet.isGolden ? '🌟 ' : ''}{pet.name}</div>
                              <div className="text-xs font-bold text-black/40">x{formatNumber(pet.isGolden ? pet.multiplier * 2 : pet.multiplier)} Mult</div>
                              <div 
                                className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-2 inline-block ${pet.rarity === 'Secret' ? 'animate-pulse' : ''}`}
                                style={{ 
                                  backgroundColor: pet.color + '20', 
                                  color: pet.color,
                                  boxShadow: pet.rarity === 'Secret' ? `0 0 8px ${pet.color}40` : 'none'
                                }}
                              >
                                {pet.rarity}
                              </div>
                              {state.equippedPets.includes(pet.id) && !isMultiDeleteMode && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                                  <Zap size={10} fill="currentColor" />
                                </div>
                              )}
                              {isMultiDeleteMode && selectedPets.includes(pet.id) && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                                  <X size={10} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
                    <PawPrint size={48} className="mx-auto text-black/10 mb-4" />
                    <p className="text-black/30 font-bold">No pets yet. Hatch some in the shop!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rebirth' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Choose Rebirth</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {REBIRTH_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => rebirth(option)}
                        disabled={state.clicks < option.cost}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          state.clicks >= option.cost
                            ? 'border-purple-500 bg-purple-50 hover:shadow-lg'
                            : 'border-black/5 bg-black/[0.02] opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <RotateCcw size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-sm">{formatNumber(option.amount)} Rebirth{option.amount > 1 ? 's' : ''}</h4>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-xs font-black text-black/40">{formatNumber(option.cost)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Gem size={14} className="text-cyan-500" />
                            <span className="text-sm font-black text-cyan-600">+{option.gems}</span>
                          </div>
                          <p className="text-[10px] font-bold text-black/30">REWARD</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Super Rebirth</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {SUPER_REBIRTH_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => superRebirth(option)}
                        disabled={state.rebirths < option.rebirthsNeeded}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          state.rebirths >= option.rebirthsNeeded
                            ? 'border-amber-500 bg-amber-50 hover:shadow-lg'
                            : 'border-black/5 bg-black/[0.02] opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Trophy size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-sm">{formatNumber(option.amount)} Super Rebirth{option.amount > 1 ? 's' : ''}</h4>
                            <div className="flex items-center gap-1">
                              <RotateCcw size={12} className="text-purple-500" />
                              <span className="text-xs font-black text-black/40">{formatNumber(option.rebirthsNeeded)} Rebirths</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Zap size={14} className="text-amber-500" />
                            <span className="text-sm font-black text-amber-600">+{option.tokens} Tokens</span>
                          </div>
                          <p className="text-[10px] font-bold text-black/30">SOON</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-black/30 uppercase tracking-widest">Rebirth Shop</h3>
                    <div className="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded-lg border border-cyan-100">
                      <Gem size={12} className="text-cyan-500" />
                      <span className="text-xs font-black text-cyan-600">{formatNumber(state.gems)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {REBIRTH_UPGRADES.map(upgrade => {
                      const count = state.rebirthUpgrades[upgrade.id] || 0;
                      const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, count));
                      const canAfford = state.gems >= price;

                      return (
                        <button
                          key={upgrade.id}
                          onClick={() => buyRebirthUpgrade(upgrade)}
                          disabled={!canAfford}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${
                            canAfford 
                              ? 'border-cyan-500/20 bg-white hover:border-cyan-500/50 hover:shadow-lg' 
                              : 'border-black/5 bg-black/[0.02] opacity-60'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl shrink-0">
                            {upgrade.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-sm">{upgrade.name}</h4>
                              <span className="text-[10px] font-black bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Lv. {count}</span>
                            </div>
                            <p className="text-[10px] font-bold text-black/40 mb-2">{upgrade.description}</p>
                            <div className="flex items-center gap-1">
                              <Gem size={12} className="text-cyan-500" />
                              <span className={`text-xs font-black ${canAfford ? 'text-cyan-600' : 'text-black/40'}`}>
                                {formatNumber(price)}
                              </span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-lg transition-colors ${canAfford ? 'bg-cyan-50 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-black/5 text-black/20'}`}>
                            <ChevronRight size={16} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black text-black/30 uppercase tracking-widest">Super Rebirth Shop</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      <Zap size={12} className="text-amber-500" />
                      <span className="text-xs font-black text-amber-600">{formatNumber(state.superRebirthTokens)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {SUPER_REBIRTH_UPGRADES.map(upgrade => {
                      const count = state.superRebirthUpgrades[upgrade.id] || 0;
                      const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, count));
                      const canAfford = state.superRebirthTokens >= price;

                      return (
                        <button
                          key={upgrade.id}
                          onClick={() => buySuperRebirthUpgrade(upgrade)}
                          disabled={!canAfford}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${
                            canAfford 
                              ? 'border-amber-500/20 bg-white hover:border-amber-500/50 hover:shadow-lg' 
                              : 'border-black/5 bg-black/[0.02] opacity-60'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                            {upgrade.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-sm">{upgrade.name}</h4>
                              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Lv. {count}</span>
                            </div>
                            <p className="text-[10px] font-bold text-black/40 mb-2">{upgrade.description}</p>
                            <div className="flex items-center gap-1">
                              <Zap size={12} className="text-amber-500" />
                              <span className={`text-xs font-black ${canAfford ? 'text-amber-600' : 'text-black/40'}`}>
                                {formatNumber(price)} Tokens
                              </span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-lg transition-colors ${canAfford ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white' : 'bg-black/5 text-black/20'}`}>
                            <ChevronRight size={16} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-purple-500" />
                    <h4 className="font-black">Current Stats</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-black/50 text-sm font-medium">Total Rebirths</span>
                      <span className="text-lg font-black text-purple-600">{formatNumber(state.rebirths)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black/50 text-sm font-medium">Rebirth Multiplier</span>
                      <span className="text-lg font-black text-purple-600">x{formatNumber(1 + state.rebirths * 0.5)}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="text-black/50 text-sm font-medium">Super Rebirths</span>
                        <span className="text-lg font-black text-amber-600">{formatNumber(state.superRebirths)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/50 text-sm font-medium">Super Multiplier</span>
                        <span className="text-lg font-black text-amber-600">x{formatNumber(1 + state.superRebirths * 10)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'worlds' && (
              <div className="bg-blue-400/20 rounded-3xl p-6 min-h-[400px] relative overflow-hidden">
                {/* Water ripples background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-ping" />
                  <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-white rounded-full animate-ping [animation-delay:1s]" />
                  <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full animate-ping [animation-delay:2s]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {currentIslands.map((world, index) => {
                    const isUnlocked = state.unlockedIslands.includes(world.id);
                    const isCurrent = state.currentIslandId === world.id;
                    const canAfford = state.clicks >= world.cost;

                    return (
                      <motion.div 
                        key={world.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative p-6 rounded-[3rem] border-4 transition-all hover:-translate-y-2 ${
                          isCurrent 
                            ? 'border-blue-500 bg-white shadow-[0_20px_50px_rgba(59,130,246,0.3)]' 
                            : isUnlocked 
                              ? 'border-white bg-white/90 hover:bg-white shadow-xl' 
                              : 'border-black/5 bg-black/[0.05] opacity-70 grayscale'
                        }`}
                      >
                        {/* Island "Sand" border effect */}
                        <div className={`absolute -inset-1 rounded-[3.2rem] opacity-20 blur-sm -z-10 bg-${world.color}-500`} />

                        <div className="text-center">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner bg-${world.color}-100 text-${world.color}-600 border-4 border-white`}>
                            {world.id.includes('forest') ? '🌳' : 
                             world.id.includes('desert') ? '🌵' : 
                             world.id.includes('winter') ? '❄️' : 
                             world.id.includes('lava') ? '🌋' : 
                             world.id.includes('cyber') ? '🤖' : 
                             world.id.includes('ocean') ? '🌊' : 
                             world.id.includes('space') ? '🚀' : 
                             world.id.includes('heaven') ? '😇' : 
                             world.id.includes('hell') ? '🔥' : '🏝️'}
                          </div>
                          
                          <h4 className="font-black text-xl mb-1">{world.name}</h4>
                          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-4">
                            {isUnlocked ? 'Unlocked' : `Cost: ${formatNumber(world.cost)}`}
                          </p>

                          <div className="flex justify-center">
                            {isCurrent ? (
                              <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
                                <Globe size={14} />
                                CURRENT
                              </div>
                            ) : isUnlocked ? (
                              <button 
                                onClick={() => travelToIsland(world.id)}
                                className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-black hover:scale-110 transition-transform shadow-lg flex items-center gap-2"
                              >
                                <ChevronRight size={14} />
                                TRAVEL
                              </button>
                            ) : (
                              <button 
                                onClick={() => unlockIsland(world.id)}
                                disabled={!canAfford}
                                className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg ${
                                  canAfford ? 'bg-emerald-500 text-white hover:scale-110' : 'bg-black/10 text-black/30'
                                }`}
                              >
                                UNLOCK
                              </button>
                            )}
                          </div>
                        </div>

                        {!isUnlocked && (
                          <div className="mt-4 px-4">
                            <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, (state.clicks / world.cost) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'codes' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-black/5 rounded-3xl p-8 text-center shadow-xl">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ticket size={40} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Redeem Codes</h3>
                  <p className="text-black/50 text-sm mb-8 leading-relaxed">
                    Enter a secret code to get free Clicks and Gems! Follow us for more codes.
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text"
                      placeholder="ENTER CODE..."
                      className="flex-1 bg-black/5 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 font-black text-center uppercase tracking-widest outline-none transition-all"
                      id="code-input"
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('code-input') as HTMLInputElement;
                        if (redeemCode(input.value)) {
                          input.value = '';
                          alert('Code redeemed successfully!');
                        } else {
                          alert('Invalid or already used code!');
                        }
                      }}
                      className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-blue-700 transition-colors"
                    >
                      GO
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-black/5">
                    <h4 className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-3">Active Codes</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {CODES.map(c => (
                        <span key={c.code} className={`text-[10px] font-black px-3 py-1 rounded-full ${state.usedCodes.includes(c.code) ? 'bg-black/5 text-black/20' : 'bg-blue-50 text-blue-600'}`}>
                          {c.code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Audio</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => toggleSetting('music')}
                      className="w-full p-4 bg-white border-2 border-black/5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.settings.music ? 'bg-blue-100 text-blue-600' : 'bg-black/5 text-black/30'}`}>
                          <Zap size={20} />
                        </div>
                        <span className="font-black text-sm">Music</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${state.settings.music ? 'bg-blue-500' : 'bg-black/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.settings.music ? 'left-7' : 'left-1'}`} />
                      </div>
                    </button>

                    <button 
                      onClick={() => toggleSetting('sfx')}
                      className="w-full p-4 bg-white border-2 border-black/5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.settings.sfx ? 'bg-blue-100 text-blue-600' : 'bg-black/5 text-black/30'}`}>
                          <Zap size={20} />
                        </div>
                        <span className="font-black text-sm">SFX</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${state.settings.sfx ? 'bg-blue-500' : 'bg-black/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.settings.sfx ? 'left-7' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black text-black/30 uppercase tracking-widest mb-3">Game Data</h3>
                  <button 
                    onClick={resetGame}
                    className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <RotateCcw size={20} />
                    <span className="font-black text-sm">Reset All Progress</span>
                  </button>
                </section>

                <div className="text-center py-4">
                  <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Clicker Simulator v2.1.0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hatching Animation Overlay */}
      <AnimatePresence>
        {showHatchAnim && hatchingPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white rounded-[40px] p-12 text-center max-w-sm w-full relative shadow-2xl"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white border-8 border-white shadow-xl">
                <Zap size={40} fill="currentColor" />
              </div>
              
              <div className="mt-8 mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl mb-4"
                >
                  {hatchingPet.icon}
                </motion.div>
                <h2 className="text-3xl font-black mb-1">{hatchingPet.name}</h2>
                <div 
                  className={`text-sm font-black uppercase tracking-widest ${hatchingPet.rarity === 'Secret' ? 'animate-pulse' : ''}`}
                  style={{ 
                    color: hatchingPet.color,
                    textShadow: hatchingPet.rarity === 'Secret' ? `0 0 10px ${hatchingPet.color}` : 'none'
                  }}
                >
                  {hatchingPet.rarity}
                </div>
              </div>

              <div className="bg-black/5 rounded-2xl p-4 mb-8">
                <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Multiplier</p>
                <p className="text-2xl font-black text-blue-600">x{formatNumber(hatchingPet.multiplier)}</p>
              </div>

              <button
                onClick={() => setShowHatchAnim(false)}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                AWESOME!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hatching Cutscene Modal */}
      <AnimatePresence>
        {hatchingCutscene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white rounded-[32px] p-8 text-center max-w-sm w-full relative shadow-2xl"
            >
              <h2 className="text-4xl font-black mb-4">NEW {hatchingCutscene.rarity.toUpperCase()}!</h2>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-9xl mb-6"
              >
                {hatchingCutscene.icon}
              </motion.div>
              <h3 className="text-2xl font-black mb-2">{hatchingCutscene.name}</h3>
              <button
                onClick={() => setHatchingCutscene(null)}
                className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all"
              >
                WOW!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* What's New Modal */}
      <AnimatePresence>
        {showWhatsNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 text-center max-w-md w-full relative shadow-2xl"
            >
              <button 
                onClick={closeWhatsNew}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full text-black/40 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-blue-500" />
              </div>

              <h2 className="text-2xl font-black mb-2">{WHATS_NEW.title}</h2>
              <p className="text-black/40 text-sm font-bold uppercase tracking-widest mb-6">What's New</p>

              <div className="space-y-4 mb-8 text-left">
                {WHATS_NEW.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-black/[0.02] p-3 rounded-2xl border border-black/5">
                    <div className="text-2xl shrink-0">{item.icon}</div>
                    <p className="text-sm font-bold text-black/70">{item.text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={closeWhatsNew}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                LET'S PLAY!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  count: number;
  price: number;
  canAfford: boolean;
  onClick: () => void;
  key?: string;
}

function UpgradeCard({ 
  upgrade, 
  count, 
  price, 
  canAfford, 
  onClick 
}: UpgradeCardProps) {
  const isMaxed = upgrade.maxLevel && count >= upgrade.maxLevel;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford || isMaxed}
      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${
        isMaxed
          ? 'border-yellow-500/30 bg-yellow-50/30'
          : canAfford 
          ? 'border-black/5 bg-white hover:border-blue-500/30 hover:shadow-lg' 
          : 'border-black/5 bg-black/[0.02] opacity-60'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl ${
        upgrade.type === 'click' ? 'bg-blue-100 text-blue-600' : 
        upgrade.type === 'auto' ? 'bg-green-100 text-green-600' :
        'bg-purple-100 text-purple-600'
      }`}>
        {upgrade.icon || (upgrade.type === 'click' ? '🖱️' : '⚡')}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-sm">{upgrade.name}</h4>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isMaxed ? 'bg-yellow-400 text-white' : 'bg-black/5'}`}>
            {isMaxed ? 'MAX' : `Lv. ${count}${upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}`}
          </span>
        </div>
        <p className="text-[10px] font-bold text-black/40 mb-2">{upgrade.description}</p>
        {!isMaxed && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className={`text-xs font-black ${canAfford ? 'text-blue-600' : 'text-black/40'}`}>
              {formatNumber(price)}
            </span>
          </div>
        )}
      </div>

      {!isMaxed && (
        <div className={`p-2 rounded-lg transition-colors ${canAfford ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : 'bg-black/5 text-black/20'}`}>
          <ChevronRight size={16} />
        </div>
      )}
    </button>
  );
}
