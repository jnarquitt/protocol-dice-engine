# Protocol Dice — Project Intent

**Date:** 2026-10-13

## Core decision
Protocol Dice is the setting-agnostic dice mechanic and rules framework.  
Protocol 7 is the first complete setting package that is built on it and serves as the flagship “full system” example.

The Protocol 7 interactive apps (particularly the character sheet / session tools in the v0.185–v0.188 range in the `protocol-7` repo) are the mechanical and experiential reference. Previous attempts to create a separate Protocol Dice app drifted too far from that playtested feel. The goal is to stop that drift.

## What this means in practice
- Core resolution, dice pools, Edges, Talents, Advancement, and the overall “feel” of rolling and character expression stay aligned with the playtested Protocol 7 tools.
- Setting-specific content (lore, adventures, NPCs, particular magic expressions, etc.) lives in Protocol 7 (or future setting repos) and is layered on top.
- This repository is the home for the agnostic core: rules text, interactive character/play tools, and supporting documentation.
- We prefer to keep durable work, decisions, and handoff notes inside the relevant GitHub repositories rather than only in chat.

## Immediate direction
1. Treat the existing Protocol 7 interactive apps as the source of mechanical truth.
2. Extract / document the pure core mechanics so they can be presented without Protocol 7 lore.
3. Rebuild or realign the Protocol Dice interactive tools so they feel like the same system Protocol 7 players already know, just without the setting baggage.
4. When the core is solid, Protocol 7 becomes the “full system” package that includes the setting on top of the core rules.

Repository state remains authoritative over any prior chat context.