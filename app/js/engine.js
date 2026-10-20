/** Protocol Dice Engine — core resolution (Open Frame v0.010) */
(function (root) {
  "use strict";

  const BLANKS = new Set([1, 2, 3]);
  const DIE_STEPS = [
    { die: 4, ranks: 0 },
    { die: 6, ranks: 1 },
    { die: 8, ranks: 3 },
    { die: 10, ranks: 6 },
    { die: 12, ranks: 10 },
  ];

  function ranksToDie(ranks) {
    let die = 4;
    for (const step of DIE_STEPS) {
      if (ranks >= step.ranks) die = step.die;
    }
    return die;
  }

  function ranksToNext(ranks) {
    const current = ranksToDie(ranks);
    const idx = DIE_STEPS.findIndex((s) => s.die === current);
    if (idx < 0 || idx >= DIE_STEPS.length - 1) return null;
    return DIE_STEPS[idx + 1].ranks - ranks;
  }

  function costToNextDie(currentDie) {
    const idx = DIE_STEPS.findIndex((s) => s.die === currentDie);
    if (idx < 0 || idx >= DIE_STEPS.length - 1) return null;
    return DIE_STEPS[idx + 1].ranks - DIE_STEPS[idx].ranks;
  }

  function rollDie(sides) {
    return 1 + Math.floor(Math.random() * sides);
  }

  function scoreFace(face) {
    return BLANKS.has(face) ? 0 : face;
  }

  function marginBand(margin, bands) {
    if (margin <= 0) return null;
    for (const b of bands) {
      const max = b.max == null ? Infinity : b.max;
      if (margin >= b.min && margin <= max) return b.label;
    }
    return null;
  }

  /**
   * Build and optionally resolve a Protocol Dice pool.
   * sources: [{ label, sides, kind }]
   * disadvantage: removes smallest ability die before scoring
   */
  function evaluatePool(sources, { disadvantage = false, faces = null } = {}) {
    let work = sources.map((s, i) => ({
      ...s,
      face: faces ? faces[i] : rollDie(s.sides),
      removed: false,
    }));

    if (disadvantage) {
      const ability = work
        .map((d, i) => ({ d, i }))
        .filter((x) => x.d.kind === "ability" && !x.d.removed);
      if (ability.length) {
        ability.sort((a, b) => a.d.sides - b.d.sides || a.d.face - b.d.face);
        work[ability[0].i].removed = true;
      }
    }

    const scored = work.filter((d) => !d.removed);
    const total = scored.reduce((sum, d) => sum + scoreFace(d.face), 0);
    return { dice: work, total };
  }

  function assignAbilityMultiset(priority, multiset = [8, 8, 6, 6, 4, 4]) {
    const out = {};
    priority.forEach((ab, i) => {
      out[ab] = multiset[i];
    });
    return out;
  }

  function vitalityFromFaces(faces) {
    const scoring = faces.filter((f) => !BLANKS.has(f));
    if (!scoring.length) return 28;
    return 18 + Math.max(...scoring);
  }

  root.PDE = root.PDE || {};
  root.PDE.Engine = {
    BLANKS,
    DIE_STEPS,
    ranksToDie,
    ranksToNext,
    costToNextDie,
    rollDie,
    scoreFace,
    marginBand,
    evaluatePool,
    assignAbilityMultiset,
    vitalityFromFaces,
  };
})(typeof self !== "undefined" ? self : globalThis);
