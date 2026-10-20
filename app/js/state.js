(function (root) {
  "use strict";

  const STORAGE_KEY = "pde-open-frame-v010";
  const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  function emptyCharacter() {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: "",
      archetypeId: null,
      level: 1,
      abilities: Object.fromEntries(ABILITIES.map((a) => [a, 6])),
      skillRanks: {},
      loadedFeatures: [],
      preparedSpells: [],
      edgeId: null,
      edgeUsed: false,
      masterySkillIds: [],
      maxHp: 22,
      hp: 22,
      ap: 3,
      apBanked: 0,
      reactionAvailable: true,
      notes: "",
      createdAt: new Date().toISOString(),
    };
  }

  function capacityForLevel(core, level) {
    return core.levels[String(level)]?.capacity ?? 16;
  }

  function usedCapacity(char, catalogs) {
    const featCost = char.loadedFeatures.reduce((n, id) => {
      const f = catalogs.features.features.find((x) => x.id === id);
      return n + (f?.capacity || 0);
    }, 0);
    const spellCost = char.preparedSpells.reduce((n, id) => {
      const s = catalogs.spells.spells.find((x) => x.id === id);
      return n + (s?.capacity || 0);
    }, 0);
    return featCost + spellCost;
  }

  function spentRanks(char) {
    return Object.values(char.skillRanks).reduce((a, b) => a + (b || 0), 0);
  }

  function rankBudget(core, level) {
    return core.skills.starting_ranks + Math.max(0, level - 1) * core.skills.ranks_per_level_after_1;
  }

  function applyArchetype(char, arch, catalogs) {
    const Eng = root.PDE.Engine;
    char.archetypeId = arch.id;
    char.abilities = Eng.assignAbilityMultiset(arch.ability_priority, catalogs.archetypes.ability_dice);
    char.skillRanks = { ...arch.skills };
    char.loadedFeatures = [...(arch.feature_ids || [])];
    char.preparedSpells = [...(arch.spell_ids || [])];
    return char;
  }

  function save(char) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(char));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function exportJson(char) {
    return JSON.stringify(char, null, 2);
  }

  root.PDE = root.PDE || {};
  root.PDE.State = {
    STORAGE_KEY,
    ABILITIES,
    emptyCharacter,
    capacityForLevel,
    usedCapacity,
    spentRanks,
    rankBudget,
    applyArchetype,
    save,
    load,
    clear,
    exportJson,
  };
})(typeof self !== "undefined" ? self : globalThis);
