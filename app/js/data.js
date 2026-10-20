(function (root) {
  "use strict";

  // Paths are relative to the app page URL (.../app/ or .../app/index.html).
  // One ".." stays inside the repo on GitHub project Pages
  // (https://jnarquitt.github.io/protocol-dice-engine/...).
  const FILES = {
    rulesCore: "../data/rules-core.json",
    skills: "../data/skills.json",
    features: "../data/features.json",
    spells: "../data/spells.json",
    archetypes: "../data/archetypes.json",
  };

  async function loadAll() {
    const entries = await Promise.all(
      Object.entries(FILES).map(async ([key, path]) => {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
        return [key, await res.json()];
      })
    );
    return Object.fromEntries(entries);
  }

  root.PDE = root.PDE || {};
  root.PDE.Data = { loadAll, FILES };
})(typeof self !== "undefined" ? self : globalThis);
