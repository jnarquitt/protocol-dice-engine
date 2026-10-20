(function () {
  "use strict";

  const { Engine, Data, State } = PDE;
  const appEl = document.getElementById("app");

  let catalogs = null;
  let char = null;
  let screen = "boot"; // boot | create | app
  let tab = "play";
  let createStep = "path"; // path | pick | name | vitality | done
  let help = null;
  let toastTimer = null;

  // Play controls
  let play = {
    skillId: null,
    spellId: null,
    featureDieId: null,
    difficulty: 12,
    opposed: false,
    advantage: false,
    disadvantage: false,
    mastery: false,
    physical: false,
    lastResult: null,
  };

  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 2400);
  }

  function openHelp(title, body, href) {
    help = { title, body, href };
    render();
  }

  function closeHelp() {
    help = null;
    render();
  }

  function skillById(id) {
    return catalogs.skills.skills.find((s) => s.id === id);
  }

  function featureById(id) {
    return catalogs.features.features.find((f) => f.id === id);
  }

  function spellById(id) {
    return catalogs.spells.spells.find((s) => s.id === id);
  }

  function trainedSkills() {
    return catalogs.skills.skills
      .filter((s) => (char.skillRanks[s.id] || 0) > 0 || s.id === play.skillId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function buildPoolSources() {
    const skill = skillById(play.skillId);
    if (!skill) return [];
    const ranks = char.skillRanks[skill.id] || 0;
    const sources = [
      { label: skill.name, sides: Engine.ranksToDie(ranks), kind: "skill" },
      ...skill.abilities.map((ab) => ({
        label: ab,
        sides: char.abilities[ab],
        kind: "ability",
      })),
    ];
    if (play.advantage) sources.push({ label: "Adv", sides: 6, kind: "advantage" });
    if (play.mastery && char.masterySkillIds.includes(skill.id)) {
      sources.push({ label: "Mastery", sides: Engine.ranksToDie(ranks), kind: "mastery" });
    }
    if (play.featureDieId) {
      const f = featureById(play.featureDieId);
      if (f?.pool_die) {
        const sides = Number(f.pool_die.slice(1));
        sources.push({ label: f.name, sides, kind: "feature" });
      }
    }
    return sources;
  }

  function resolveRoll(faces) {
    const sources = buildPoolSources();
    if (!sources.length) return;
    let result = Engine.evaluatePool(sources, {
      disadvantage: play.disadvantage,
      faces: faces || null,
    });
    // Ties vs target: reroll digitally until margin (physical mode prompts again)
    if (!play.physical && !play.opposed) {
      let guard = 0;
      while (result.total === play.difficulty && guard < 20) {
        result = Engine.evaluatePool(sources, { disadvantage: play.disadvantage });
        guard += 1;
      }
    }
    const margin = result.total - play.difficulty;
    const band =
      margin > 0
        ? Engine.marginBand(margin, catalogs.rulesCore.margin_bands)
        : margin < 0
          ? "Miss"
          : "Tie — reroll";
    play.lastResult = {
      ...result,
      difficulty: play.difficulty,
      margin,
      band,
      skillId: play.skillId,
      spellId: play.spellId,
    };
    State.save(char);
    render();
  }

  function startCreate(custom) {
    char = State.emptyCharacter();
    createStep = custom ? "name" : "pick";
    if (custom) {
      char.abilities = Engine.assignAbilityMultiset(
        ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
        [8, 8, 6, 6, 4, 4]
      );
      char.skillRanks = {};
      char.loadedFeatures = [];
      char.preparedSpells = [];
    }
    screen = "create";
    render();
  }

  function pickArchetype(id) {
    const arch = catalogs.archetypes.archetypes.find((a) => a.id === id);
    State.applyArchetype(char, arch, catalogs);
    createStep = "name";
    render();
  }

  function finishVitality(faces) {
    const hp = Engine.vitalityFromFaces(faces);
    char.maxHp = hp;
    char.hp = hp;
    State.save(char);
    screen = "app";
    tab = "play";
    const trained = trainedSkills();
    play.skillId = trained[0]?.id || catalogs.skills.skills[0].id;
    render();
    toast("Character ready. When unsure — use Play.");
  }

  function capacityLine() {
    const used = State.usedCapacity(char, catalogs);
    const max = State.capacityForLevel(catalogs.rulesCore, char.level);
    return { used, max };
  }

  function ranksLine() {
    const used = State.spentRanks(char);
    const max = State.rankBudget(catalogs.rulesCore, char.level);
    return { used, max };
  }

  // ——— Render helpers ———

  function helpBtn(title, body, href) {
    return `<button class="help" type="button" data-help-title="${esc(title)}" data-help-body="${esc(body)}" data-help-href="${esc(href || "../rules/")}">?</button>`;
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderHelpModal() {
    if (!help) return "";
    return `<div class="modal-backdrop" data-close-help>
      <div class="modal" role="dialog" aria-modal="true">
        <div class="row" style="justify-content:space-between">
          <h2>${esc(help.title)}</h2>
          <button class="icon-btn" type="button" data-close-help>✕</button>
        </div>
        <p class="lead">${esc(help.body)}</p>
        <a class="btn secondary block" href="${esc(help.href)}" target="_blank" rel="noopener">Open rules</a>
        <button class="btn block" style="margin-top:.5rem" type="button" data-close-help>Got it</button>
      </div>
    </div>`;
  }

  function renderBoot() {
    const existing = State.load();
    return `<div class="main stack">
      <div>
        <div class="meta" style="color:var(--gold);font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:.72rem">Jade Lion Studios · Protocol Dice Engine</div>
        <h1>At the table.<br>In your hand.</h1>
        <p class="lead">Build a character, cast spells as skill rolls, and resolve every action from Play — with physical dice or the built-in roller.</p>
      </div>
      <div class="card stack">
        <button class="btn block" data-action="new-preset">Start with an archetype</button>
        <button class="btn secondary block" data-action="new-custom">Custom build</button>
        ${
          existing
            ? `<button class="btn ghost block" data-action="continue">Continue ${esc(existing.name || "saved character")}</button>`
            : ""
        }
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <h3>Open Frame</h3>
          ${helpBtn(
            "Open Frame",
            "This Engine is not locked to one setting. Modern occult and archaic fantasy share the same skills. Firearms and blades both exist; your table decides what's common. Archetypes are start-only presets — leveling opens everything.",
            "../rules/#open-frame"
          )}
        </div>
        <p class="small">Spells use the Spellcasting skill. Features and prepared spells share Capacity. No Vancian slots.</p>
      </div>
      <a class="btn secondary block" href="../rules/">Rules guide</a>
    </div>`;
  }

  function renderCreate() {
    if (createStep === "pick") {
      return `<div class="main stack">
        <div class="row" style="justify-content:space-between">
          <h1>Choose a start</h1>
          ${helpBtn(
            "Archetypes",
            "Presets for rapid creation only. Nothing is locked. At the next level bump you can lean anywhere in the catalog.",
            "../rules/#archetypes"
          )}
        </div>
        <p>Tap a preset. You can rewrite every choice afterward.</p>
        ${catalogs.archetypes.archetypes
          .map(
            (a) => `<button class="card pick" style="width:100%;text-align:left" data-arch="${a.id}">
            <div class="meta">${a.world_tags.join(" · ")}</div>
            <h2 style="margin:.35rem 0">${esc(a.name)}</h2>
            <p class="small" style="margin:0">${esc(a.blurb)}</p>
          </button>`
          )
          .join("")}
        <button class="btn ghost block" data-action="back-boot">Back</button>
      </div>`;
    }

    if (createStep === "name") {
      return `<div class="main stack">
        <h1>Name your character</h1>
        <p>This is the only step that needs the keyboard.</p>
        <div class="field">
          <label for="char-name">Name</label>
          <input id="char-name" maxlength="40" placeholder="e.g. Marlowe Vale" value="${esc(char.name)}" />
        </div>
        <button class="btn block" data-action="to-vitality">Continue</button>
        <button class="btn ghost block" data-action="back-boot">Cancel</button>
      </div>`;
    }

    if (createStep === "vitality") {
      return `<div class="main stack">
        <div class="row" style="justify-content:space-between">
          <h1>Vitality Ritual</h1>
          ${helpBtn(
            "Vitality",
            "Roll each Ability die once. Starting HP is 18 + highest face of 4+. If all six are blank (1–3), starting HP is 28.",
            "../rules/#vitality"
          )}
        </div>
        <p>Tap Roll ritual — or enter faces if you rolled physical dice.</p>
        <button class="btn block" data-action="roll-vitality">Roll ritual</button>
        <div class="card">
          <h3>Physical dice</h3>
          <div class="ability-grid" id="vital-faces">
            ${State.ABILITIES.map(
              (ab) => `<div class="ability-card"><strong>${ab}</strong>
              <div class="die">d${char.abilities[ab]}</div>
              <select data-vital="${ab}">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                  .filter((n) => n <= char.abilities[ab])
                  .map((n) => `<option value="${n}">${n}</option>`)
                  .join("")}
              </select></div>`
            ).join("")}
          </div>
          <button class="btn secondary block" style="margin-top:.8rem" data-action="apply-vital-faces">Use these faces</button>
        </div>
      </div>`;
    }

    return "";
  }

  function renderAppShell(body) {
    const caps = capacityLine();
    const ranks = ranksLine();
    return `
      <header class="topbar">
        <div class="brand">${esc(char.name || "Unnamed")}<small>L${char.level} · Cap ${caps.used}/${caps.max} · Ranks ${ranks.used}/${ranks.max}</small></div>
        <button class="icon-btn" type="button" data-action="menu" title="Menu">☰</button>
      </header>
      <nav class="tabs">
        ${["play", "skills", "loadout", "build", "rules"]
          .map(
            (t) =>
              `<button type="button" class="${tab === t ? "active" : ""}" data-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`
          )
          .join("")}
      </nav>
      <div class="main">${body}</div>
      ${tab === "play" ? "" : `<div class="footer-dock"><button class="btn" data-tab="play">Go to Play</button></div>`}
    `;
  }

  function renderPlay() {
    const sources = buildPoolSources();
    const spell = play.spellId ? spellById(play.spellId) : null;
    const featureDice = char.loadedFeatures
      .map(featureById)
      .filter((f) => f?.pool_die);
    const prepared = char.preparedSpells.map(spellById).filter(Boolean);

    return `
      <div class="stack">
        <div class="statbar">
          <div class="stat">
            <div class="label">HP</div>
            <div class="value">${char.hp}<span class="small muted">/${char.maxHp}</span></div>
            <div class="stepper">
              <button type="button" data-hp="-1">−</button>
              <button type="button" data-hp="1">+</button>
            </div>
          </div>
          <div class="stat">
            <div class="label">AP</div>
            <div class="ap-pips">
              ${[0, 1, 2]
                .map(
                  (i) =>
                    `<button type="button" class="${i < char.ap ? "on" : ""}" data-ap-set="${i < char.ap ? i : i + 1}" title="Set AP"></button>`
                )
                .join("")}
            </div>
            <div class="small muted" style="margin-top:.35rem">${char.ap}/3</div>
          </div>
          <div class="stat">
            <div class="label">Reaction</div>
            <div class="value" style="font-size:1rem;margin-top:.45rem">${char.reactionAvailable ? "Ready" : "Used"}</div>
            <button class="chip ${char.reactionAvailable ? "active" : ""}" style="margin-top:.35rem" data-action="toggle-reaction" type="button">Toggle</button>
          </div>
        </div>

        <div class="card stack">
          <div class="row" style="justify-content:space-between">
            <h2 style="margin:0">Play</h2>
            ${helpBtn(
              "Play",
              "When you do not know what to do, come here. Build pools and roll only on Play. Spells are Spellcasting (or Ritual) skill rolls.",
              "../rules/#play"
            )}
          </div>

          <div class="field">
            <label>Skill</label>
            <select id="play-skill">
              ${trainedSkills()
                .concat(
                  catalogs.skills.skills.filter(
                    (s) => !(char.skillRanks[s.id] > 0)
                  )
                )
                .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i)
                .map((s) => {
                  const d = Engine.ranksToDie(char.skillRanks[s.id] || 0);
                  return `<option value="${s.id}" ${s.id === play.skillId ? "selected" : ""}>${esc(s.name)} · d${d}</option>`;
                })
                .join("")}
            </select>
          </div>

          <div class="field">
            <label>Prepared spell (optional)</label>
            <select id="play-spell">
              <option value="">— none —</option>
              ${prepared
                .map(
                  (s) =>
                    `<option value="${s.id}" ${play.spellId === s.id ? "selected" : ""}>${esc(s.name)} · ${typeof s.difficulty === "number" ? "TN " + s.difficulty : "Opposed"} · ${s.ap} AP</option>`
                )
                .join("")}
            </select>
          </div>
          ${
            spell
              ? `<p class="small">${esc(spell.summary)}</p>`
              : `<p class="small muted">Casting a spell auto-selects Spellcasting or Ritual and spends its AP when you roll.</p>`
          }

          <div class="field">
            <label>Feature die</label>
            <select id="play-feature">
              <option value="">— none —</option>
              ${featureDice
                .map(
                  (f) =>
                    `<option value="${f.id}" ${play.featureDieId === f.id ? "selected" : ""}>${esc(f.name)} · ${f.pool_die}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <div class="small muted" style="margin-bottom:.35rem">Difficulty</div>
            <div class="row">
              ${[8, 12, 16, 20, 24]
                .map(
                  (n) =>
                    `<button type="button" class="chip ${play.difficulty === n && !play.opposed ? "active" : ""}" data-diff="${n}">${n}</button>`
                )
                .join("")}
            </div>
          </div>

          <div class="row">
            <button type="button" class="chip ${play.advantage ? "active" : ""}" data-toggle="advantage">Advantage</button>
            <button type="button" class="chip warn ${play.disadvantage ? "active" : ""}" data-toggle="disadvantage">Disadvantage</button>
            <button type="button" class="chip ${play.physical ? "active" : ""}" data-toggle="physical">Physical dice</button>
          </div>

          <div>
            <div class="small muted">Pool</div>
            <div class="pool">
              ${sources
                .map(
                  (s) =>
                    `<span class="die ${s.kind === "ability" ? "ability" : ""}">d${s.sides}<span class="small" style="margin-left:.25rem;opacity:.8">${esc(s.label)}</span></span>`
                )
                .join("") || `<span class="muted small">Select a skill</span>`}
            </div>
          </div>

          ${
            play.physical
              ? `<div class="card" style="background:#181411">
                  <p class="small">Roll your physical dice, then tap faces below.</p>
                  <div class="row" id="physical-faces">
                    ${sources
                      .map(
                        (s, i) => `<select data-face-idx="${i}" class="chip" style="border-radius:10px">
                          ${Array.from({ length: s.sides }, (_, n) => n + 1)
                            .map((n) => `<option value="${n}">d${s.sides}: ${n}</option>`)
                            .join("")}
                        </select>`
                      )
                      .join("")}
                  </div>
                  <button class="btn block" style="margin-top:.7rem" data-action="resolve-physical">Score pool</button>
                </div>`
              : `<button class="btn block ok" data-action="roll">Roll</button>`
          }

          ${
            play.lastResult
              ? `<div class="result-box">
                  <div class="small muted">Result</div>
                  <div class="total">${play.lastResult.total} <span class="small muted">vs ${play.lastResult.difficulty}</span></div>
                  <div style="font-weight:800;color:var(--gold)">${esc(play.lastResult.band)}${play.lastResult.margin > 0 ? ` · margin ${play.lastResult.margin}` : ""}</div>
                  <div class="pool" style="margin-top:.5rem">
                    ${play.lastResult.dice
                      .map((d) => {
                        const blank = Engine.BLANKS.has(d.face);
                        return `<span class="die ${blank ? "blank" : ""} ${d.removed ? "blank" : ""}">${d.removed ? "—" : d.face}<span class="small" style="margin-left:.25rem">d${d.sides}</span></span>`;
                      })
                      .join("")}
                  </div>
                </div>`
              : ""
          }
        </div>
      </div>`;
  }

  function renderSkills() {
    const { used, max } = ranksLine();
    const pct = Math.min(100, Math.round((used / max) * 100));
    return `<div class="stack">
      <div class="row" style="justify-content:space-between">
        <h2>Skills</h2>
        ${helpBtn(
          "Skills & spells",
          "Skill die from ranks: 0→d4, 1–2→d6, 3–5→d8, 6–9→d10, 10+→d12. Spellcasting is a skill; spells are effects you roll with it.",
          "../rules/#skills"
        )}
      </div>
      <div>Ranks <strong>${used}</strong> / ${max}</div>
      <div class="progress"><span style="width:${pct}%"></span></div>
      <div class="card">
        ${catalogs.skills.skills
          .map((s) => {
            const r = char.skillRanks[s.id] || 0;
            const die = Engine.ranksToDie(r);
            const cost = Engine.costToNextDie(die);
            return `<div class="list-row">
              <div>
                <strong>${esc(s.name)}</strong>
                <div class="small muted">${s.abilities.join(" · ")} · ${esc(s.uses)}</div>
              </div>
              <div class="row">
                <span class="die">d${die}</span>
                <button class="icon-btn" data-rank="${s.id}" data-dir="-1" ${r <= 0 ? "disabled" : ""}>−</button>
                <strong style="min-width:1.2rem;text-align:center">${r}</strong>
                <button class="icon-btn" data-rank="${s.id}" data-dir="1" ${used >= max || cost == null ? "disabled" : ""}>+</button>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    </div>`;
  }

  function renderLoadout() {
    const { used, max } = capacityLine();
    const pct = Math.min(100, Math.round((used / max) * 100));
    return `<div class="stack">
      <div class="row" style="justify-content:space-between">
        <h2>Loadout</h2>
        ${helpBtn(
          "Capacity",
          "Features and prepared spells share Capacity. Load what you bring into the scene. Field-swap costs 1 AP in play.",
          "../rules/#features"
        )}
      </div>
      <div>Capacity <strong>${used}</strong> / ${max}</div>
      <div class="progress"><span style="width:${pct}%"></span></div>

      <h3>Features</h3>
      <div class="card">
        ${catalogs.features.features
          .map((f) => {
            const on = char.loadedFeatures.includes(f.id);
            return `<button class="card pick ${on ? "selected" : ""}" style="width:100%;text-align:left;margin-bottom:.55rem" data-toggle-feature="${f.id}">
              <div class="row" style="justify-content:space-between">
                <span class="meta">${f.family} · Cap ${f.capacity}</span>
                <span class="tag">${on ? "Loaded" : "Tap to load"}</span>
              </div>
              <strong>${esc(f.name)}</strong>
              <p class="small" style="margin:.35rem 0 0">${esc(f.summary)}</p>
            </button>`;
          })
          .join("")}
      </div>

      <h3>Prepared spells</h3>
      <p class="small">Requires Spellcasting (or Ritual) to cast. Preparation uses Capacity — not spell slots.</p>
      <div class="card">
        ${catalogs.spells.spells
          .map((s) => {
            const on = char.preparedSpells.includes(s.id);
            return `<button class="card pick ${on ? "selected" : ""}" style="width:100%;text-align:left;margin-bottom:.55rem" data-toggle-spell="${s.id}">
              <div class="row" style="justify-content:space-between">
                <span class="meta">${s.school} · Cap ${s.capacity} · ${s.ap} AP</span>
                <span class="tag">${on ? "Prepared" : "Tap to prepare"}</span>
              </div>
              <strong>${esc(s.name)}</strong>
              <p class="small" style="margin:.35rem 0 0">${esc(s.summary)}</p>
            </button>`;
          })
          .join("")}
      </div>
    </div>`;
  }

  function renderBuild() {
    const dice = [8, 8, 6, 6, 4, 4];
    const counts = {};
    State.ABILITIES.forEach((ab) => {
      counts[char.abilities[ab]] = (counts[char.abilities[ab]] || 0) + 1;
    });
    const legal = dice.every((d) => {
      const need = dice.filter((x) => x === d).length;
      return (counts[d] || 0) === need / dice.filter((x) => x === d).length || true;
    });
    // simpler legal check
    const have = State.ABILITIES.map((a) => char.abilities[a]).sort((a, b) => b - a);
    const want = [...dice].sort((a, b) => b - a);
    const multisetOk = have.every((v, i) => v === want[i]);

    return `<div class="stack">
      <div class="row" style="justify-content:space-between">
        <h2>Build</h2>
        ${helpBtn(
          "Abilities",
          "Assign d8, d8, d6, d6, d4, d4 among STR DEX CON INT WIS CHA. Tap a die to cycle assigned values while keeping the multiset.",
          "../rules/#abilities"
        )}
      </div>
      <p class="small">${multisetOk ? "Ability multiset legal." : "Adjust dice to restore d8/d8/d6/d6/d4/d4."}</p>
      <div class="ability-grid">
        ${State.ABILITIES.map(
          (ab) => `<button class="ability-card pick" type="button" data-cycle-ab="${ab}">
            <strong>${ab}</strong>
            <div class="die">d${char.abilities[ab]}</div>
            <div class="small muted">tap to cycle</div>
          </button>`
        ).join("")}
      </div>
      <div class="card stack">
        <h3>Session</h3>
        <button class="btn secondary block" data-action="export">Copy character JSON</button>
        <button class="btn ghost block" data-action="reset">Delete character</button>
      </div>
    </div>`;
  }

  function renderRulesTab() {
    return `<div class="stack">
      <h2>Rules</h2>
      <p>Short references. Full guide opens as a separate page — paste-friendly for Discord helpers.</p>
      <a class="card pick" href="../rules/" style="text-decoration:none;color:inherit">
        <div class="meta">Guide</div>
        <h3 style="color:var(--ink)">Open Frame Rules</h3>
        <p class="small" style="margin:0">Dice, spells-as-skills, Capacity, combat, advancement.</p>
      </a>
      <div class="card">
        <h3>Quick table</h3>
        <p class="small">TN 8 / 12 / 16 / 20 / 24 · Faces 1–3 blank · Ties reroll · Damage = margin · 3 AP · Active defense</p>
      </div>
    </div>`;
  }

  function renderMenuModal() {
    return `<div class="modal-backdrop" data-close-menu>
      <div class="modal">
        <h2>Menu</h2>
        <button class="btn secondary block" data-action="new-preset">New archetype character</button>
        <button class="btn secondary block" style="margin-top:.5rem" data-action="new-custom">New custom character</button>
        <a class="btn ghost block" style="margin-top:.5rem;text-align:center;text-decoration:none" href="../">Landing page</a>
        <button class="btn block" style="margin-top:.5rem" data-close-menu>Close</button>
      </div>
    </div>`;
  }

  let menuOpen = false;

  function render() {
    if (screen === "boot") {
      appEl.innerHTML = renderBoot() + renderHelpModal();
    } else if (screen === "create") {
      appEl.innerHTML = renderCreate() + renderHelpModal();
    } else {
      let body = "";
      if (tab === "play") body = renderPlay();
      else if (tab === "skills") body = renderSkills();
      else if (tab === "loadout") body = renderLoadout();
      else if (tab === "build") body = renderBuild();
      else body = renderRulesTab();
      appEl.innerHTML =
        renderAppShell(body) +
        renderHelpModal() +
        (menuOpen ? renderMenuModal() : "");
    }
    bind();
  }

  function bind() {
    appEl.querySelectorAll("[data-help-title]").forEach((btn) => {
      btn.onclick = () =>
        openHelp(btn.dataset.helpTitle, btn.dataset.helpBody, btn.dataset.helpHref);
    });
    appEl.querySelectorAll("[data-close-help]").forEach((el) => {
      el.onclick = (e) => {
        if (e.target === el || el.classList.contains("icon-btn") || el.classList.contains("btn"))
          closeHelp();
      };
    });
    appEl.querySelectorAll("[data-close-menu]").forEach((el) => {
      el.onclick = (e) => {
        if (e.target === el || el.classList.contains("btn")) {
          menuOpen = false;
          render();
        }
      };
    });

    const act = (name, fn) => {
      appEl.querySelectorAll(`[data-action="${name}"]`).forEach((el) => {
        el.onclick = fn;
      });
    };

    act("new-preset", () => startCreate(false));
    act("new-custom", () => startCreate(true));
    act("continue", () => {
      char = State.load();
      screen = "app";
      tab = "play";
      play.skillId =
        Object.keys(char.skillRanks).find((id) => char.skillRanks[id] > 0) ||
        "sk-perception";
      render();
    });
    act("back-boot", () => {
      screen = "boot";
      render();
    });
    act("to-vitality", () => {
      const input = document.getElementById("char-name");
      char.name = (input?.value || "").trim();
      if (!char.name) {
        toast("Add a name first.");
        return;
      }
      createStep = "vitality";
      render();
    });
    act("roll-vitality", () => {
      const faces = State.ABILITIES.map((ab) => Engine.rollDie(char.abilities[ab]));
      finishVitality(faces);
    });
    act("apply-vital-faces", () => {
      const faces = State.ABILITIES.map((ab) =>
        Number(appEl.querySelector(`[data-vital="${ab}"]`).value)
      );
      finishVitality(faces);
    });
    act("menu", () => {
      menuOpen = true;
      render();
    });
    act("toggle-reaction", () => {
      char.reactionAvailable = !char.reactionAvailable;
      State.save(char);
      render();
    });
    act("roll", () => {
      if (play.spellId) {
        const sp = spellById(play.spellId);
        if (sp) {
          play.skillId = sp.skill;
          if (typeof sp.difficulty === "number") play.difficulty = sp.difficulty;
          char.ap = Math.max(0, char.ap - (sp.ap || 1));
        }
      }
      resolveRoll();
    });
    act("resolve-physical", () => {
      const faces = [...appEl.querySelectorAll("[data-face-idx]")].map((el) =>
        Number(el.value)
      );
      if (play.spellId) {
        const sp = spellById(play.spellId);
        if (sp) {
          play.skillId = sp.skill;
          if (typeof sp.difficulty === "number") play.difficulty = sp.difficulty;
          char.ap = Math.max(0, char.ap - (sp.ap || 1));
        }
      }
      resolveRoll(faces);
    });
    act("export", async () => {
      const text = State.exportJson(char);
      try {
        await navigator.clipboard.writeText(text);
        toast("Character JSON copied.");
      } catch {
        prompt("Copy JSON:", text);
      }
    });
    act("reset", () => {
      if (confirm("Delete this character from this phone?")) {
        State.clear();
        char = null;
        screen = "boot";
        render();
      }
    });

    appEl.querySelectorAll("[data-arch]").forEach((el) => {
      el.onclick = () => pickArchetype(el.dataset.arch);
    });
    appEl.querySelectorAll("[data-tab]").forEach((el) => {
      el.onclick = () => {
        tab = el.dataset.tab;
        menuOpen = false;
        render();
      };
    });
    appEl.querySelectorAll("[data-hp]").forEach((el) => {
      el.onclick = () => {
        char.hp = Math.max(0, Math.min(char.maxHp, char.hp + Number(el.dataset.hp)));
        State.save(char);
        render();
      };
    });
    appEl.querySelectorAll("[data-ap-set]").forEach((el, idx, list) => {
      el.onclick = () => {
        // toggle pip: count how many should be on
        const onCount = [...list].filter((b) => b.classList.contains("on")).length;
        const i = idx;
        char.ap = onCount === i + 1 ? i : i + 1;
        State.save(char);
        render();
      };
    });
    appEl.querySelectorAll("[data-diff]").forEach((el) => {
      el.onclick = () => {
        play.difficulty = Number(el.dataset.diff);
        play.opposed = false;
        render();
      };
    });
    appEl.querySelectorAll("[data-toggle]").forEach((el) => {
      el.onclick = () => {
        const k = el.dataset.toggle;
        play[k] = !play[k];
        if (k === "advantage" && play.advantage) play.disadvantage = false;
        if (k === "disadvantage" && play.disadvantage) play.advantage = false;
        render();
      };
    });
    const skillSel = appEl.querySelector("#play-skill");
    if (skillSel)
      skillSel.onchange = () => {
        play.skillId = skillSel.value;
        render();
      };
    const spellSel = appEl.querySelector("#play-spell");
    if (spellSel)
      spellSel.onchange = () => {
        play.spellId = spellSel.value || null;
        const sp = play.spellId ? spellById(play.spellId) : null;
        if (sp) {
          play.skillId = sp.skill;
          if (typeof sp.difficulty === "number") play.difficulty = sp.difficulty;
        }
        render();
      };
    const featSel = appEl.querySelector("#play-feature");
    if (featSel)
      featSel.onchange = () => {
        play.featureDieId = featSel.value || null;
        render();
      };

    appEl.querySelectorAll("[data-rank]").forEach((el) => {
      el.onclick = () => {
        const id = el.dataset.rank;
        const dir = Number(el.dataset.dir);
        const cur = char.skillRanks[id] || 0;
        if (dir < 0) {
          char.skillRanks[id] = Math.max(0, cur - 1);
          if (char.skillRanks[id] === 0) delete char.skillRanks[id];
        } else {
          const { used, max } = ranksLine();
          if (used >= max) return;
          char.skillRanks[id] = cur + 1;
        }
        State.save(char);
        render();
      };
    });

    appEl.querySelectorAll("[data-toggle-feature]").forEach((el) => {
      el.onclick = () => {
        const id = el.dataset.toggleFeature;
        const on = char.loadedFeatures.includes(id);
        if (on) {
          char.loadedFeatures = char.loadedFeatures.filter((x) => x !== id);
        } else {
          char.loadedFeatures = [...char.loadedFeatures, id];
          if (State.usedCapacity(char, catalogs) > State.capacityForLevel(catalogs.rulesCore, char.level)) {
            char.loadedFeatures = char.loadedFeatures.filter((x) => x !== id);
            toast("Not enough Capacity.");
            return;
          }
        }
        State.save(char);
        render();
      };
    });

    appEl.querySelectorAll("[data-toggle-spell]").forEach((el) => {
      el.onclick = () => {
        const id = el.dataset.toggleSpell;
        const on = char.preparedSpells.includes(id);
        if (on) {
          char.preparedSpells = char.preparedSpells.filter((x) => x !== id);
        } else {
          char.preparedSpells = [...char.preparedSpells, id];
          if (State.usedCapacity(char, catalogs) > State.capacityForLevel(catalogs.rulesCore, char.level)) {
            char.preparedSpells = char.preparedSpells.filter((x) => x !== id);
            toast("Not enough Capacity.");
            return;
          }
        }
        State.save(char);
        render();
      };
    });

    appEl.querySelectorAll("[data-cycle-ab]").forEach((el) => {
      el.onclick = () => {
        const ab = el.dataset.cycleAb;
        const order = [8, 6, 4, 10, 12].filter((n) => n <= 8 || n); // keep multiset via rotate among assigned
        // Rotate values among abilities: swap with next ability
        const idx = State.ABILITIES.indexOf(ab);
        const next = State.ABILITIES[(idx + 1) % State.ABILITIES.length];
        const tmp = char.abilities[ab];
        char.abilities[ab] = char.abilities[next];
        char.abilities[next] = tmp;
        State.save(char);
        render();
      };
    });
  }

  async function boot() {
    try {
      catalogs = await Data.loadAll();
      screen = "boot";
      render();
    } catch (err) {
      appEl.innerHTML = `<div class="main"><div class="card"><h2>Could not load data</h2><p>${esc(err.message)}</p></div></div>`;
    }
  }

  boot();
})();
