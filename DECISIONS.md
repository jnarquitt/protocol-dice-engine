# Protocol Dice Engine — Decision Log

Josh is CEO. This file records C-suite product decisions made for the playtest build.
Repository state beats chat memory. Playtest feedback can overturn any of these.

## D-000 — Brand (2026-10-19)

Public face is **Jade Lion Studios**. The root landing page is the studio hub (links to creative projects). Protocol Dice Engine is a studio product linked from that hub — not the only thing on the homepage.

## D-001 — Product shape (2026-10-19)

Ship a **phone-first static HTML app** for GitHub Pages. No build step. Iterate between sessions by editing HTML/JS/JSON and pushing.

Deliverables in-hand at the table:
- Character creation (archetype preset **or** custom)
- Play surface (single place to assemble pools and resolve)
- Rules help (inline `?` + linked rules pages)
- Digital roller **and** physical-dice mode

## D-002 — Open Frame setting model (2026-10-19)

Not “default modern fantasy.” The Engine is built for **any generic fantasy world**, including modern occult tables and archaic ones.

- Melee and firearm skills **coexist** in the catalog.
- World/table decides what gear and skills are common.
- Characters are **not class-locked** out of weapons or paths.
- Starting **Archetypes** are rapid-creation presets only. Leveling opens everything; the next bump erases starting path as destiny.

## D-003 — Features replace VAMs (2026-10-19)

Player-facing special resource layer is called **Features**.
Load budget is **Capacity** (same numbers as Protocol 7 BAR at Levels 1–6).

Features are setting-agnostic mechanical packages. Flavor text is written to read as occult / martial / social / technical so the same chassis can later wear cyberpunk or high-fantasy skins without rewriting math.

Protocol 7 VAMs remain the playtested mechanical ancestor, not player-facing language in this app.

## D-004 — Mechanical authority (2026-10-19)

Dice math, difficulty ladder, vitality ritual, AP/Reaction, active defense, Edges, Mastery cadence, and skill die breakpoints track **Protocol 7 v0.188 playtest core**.

Matched Blanks / Dice Tricks stay **off** for this playtest slice.

## D-005 — UX law (2026-10-19)

Inherited from Protocol 7 mobile locks, adapted:

- After naming the character, play is **touch-first** (no keyboard required).
- **PLAY** is the only place pools are rolled.
- When confused, go to PLAY.
- Help (`?`) opens short plain-language guidance with a link into the rules guide.

## D-006 — Repo home for this playtest (2026-10-19)

This New Project workspace is the active playtest build of Protocol Dice Engine.
Older `protocol-dice-engine` (v0.005) and `protocol-dice` remain historical / sibling references until this build proves out and we promote or sync.

## D-007 — Spells are skills (2026-10-19)

**Spellcasting is a Skill.** Spells are effects a character with the Spellcasting skill can attempt.

- Casting uses the same Protocol Dice pool math as any other skill roll (Skill die + three Ability dice, named sources only).
- No 1980s Vancian spell slots, no detached mana meters that ignore the dice engine.
- Playtest cost model: **AP to cast** + roll Spellcasting vs the spell’s Difficulty (or opposed Will/appropriate defense). Optional **prepared workings** load into **Capacity** like Features so the special-resource chassis stays unified.
- Harder spells raise Difficulty and/or Capacity load — they do not invent a second advancement track.

## Escalations reserved for CEO

- Official public setting IP / proper names that collide with licensed properties
- Monetization, print editions, Dice Goblin physical accessories
- Declaring a version “promoted” past playtest
