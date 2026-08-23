# Protocol Dice Engine — Matched Blanks Math & Effect Ladder r001

**Status:** DESIGN CANDIDATE — simulation required
**Working name:** Matched Blanks

## Purpose

Matched Blanks uses only repeated blank faces (1, 2, or 3) as a quick secondary effect layer after the normal Protocol Dice result is resolved. Ordinary critical-hit rules remain separate.

The mechanic is intended to convert naturally occurring low-frequency dice patterns into concrete mechanical effects on actions and scenes without requiring poker-hand scanning or a separate minigame.

## Core bonus-language rule

**Protocol Dice Engine does not use flat numeric bonuses for these effects.**

If an effect improves a roll, damage, defense, or other quantified outcome, it should normally do so by adding an appropriate die (for example d4, d6, etc.), by changing action economy, by imposing/clearing a condition, or by creating a bounded positional/information effect.

A result such as "+2 damage" is therefore not valid Protocol Dice design language for Matched Blanks. The equivalent minor mechanical expression should be something like **add d4 damage/effect** when appropriate.

## Recognition rule

After resolving the roll normally, glance only at dice showing 1, 2, or 3.

Recognize repeated matching blanks:
- 11 / 22 / 33
- 111 / 222 / 333
- 1111 / 2222 / 3333
- 11111 / 22222 / 33333
- six matching blanks if a six-die Mastery pool permits it

Mixed blank combinations do not count. Scoring-face matches do not count.

## Representative five-die probabilities

For a realistic Level-1 five-die pool such as d6 + d8 + d8 + d6 + d6:

- any matching blank pair or better: ~45.8%
- any matching blank triple or better: ~7.9%
- any four matching blanks or better: ~0.65%
- any five matching blanks: ~0.022%

For any specific face (for example 1s):
- pair or better: ~16.45%
- triple or better: ~2.63%
- four or better: ~0.217%
- five: ~0.0072%

A five-of-a-kind blank in that representative pool is therefore roughly a one-in-13,800 event for a specific face.

## Representative six-die Mastery probabilities

For a representative six-die veteran pool such as d8 + d8 + d8 + d6 + d8 + d8:

- any matching blank pair or better: ~49.1%
- any matching blank triple or better: ~10.0%
- any four matching blanks or better: ~1.08%
- any five matching blanks or better: ~0.063%
- all six matching blanks: ~0.002%

Mastery therefore increases notable Matched Blank events modestly without making extreme results common.

## Design consequence

Pairs are too common to carry major effects. Triples can carry meaningful action-level effects. Four matching blanks are rare enough for strong scene-level effects. Five matching blanks are extraordinary and may justify dramatic mechanical consequences. Six matching blanks, where possible, are effectively legendary.

## Face identities — working test

The face determines the *kind* of effect. The number matched determines *magnitude*.

### 1s — IMPACT
Physical force, damage, breakthrough, destruction, or magnitude.

### 2s — TEMPO
Speed, efficiency, AP economy, timing, repositioning, or maintaining initiative.

### 3s — CONTROL
Precision, condition, positioning, information quality, containment, or reducing collateral consequences.

These names are mechanical placeholders and may change.

## Effect ladder — working test

### Pair — Minor Edge
Frequent enough that the effect must be useful but small.

- **11 Impact:** on a damaging action, add **d4** to the immediate damage/effect and score that die normally. On a non-damaging action, add a d4 effect die only where the action has an established quantitative effect die; otherwise use a small bounded nonnumeric increase in force/magnitude.
- **22 Tempo:** one immediately related simple Interact or very short reposition may occur for 0 AP; cannot create an additional Attack.
- **33 Control:** improve precision of the successful action: reduce one minor collateral consequence, improve position, or impose/clear one minor situational state when fiction supports it. Does not change a failed roll into a success.

### Triple — Strong Edge
Roughly 6–10% for any triple across typical five/six-die pools.

- **111 Impact:** add **one additional primary effect/weapon die** and score it normally; on non-damage actions, achieve a clearly stronger bounded result within the action's existing scope.
- **222 Tempo:** recover or preserve 1 AP associated with the current sequence, subject to a once-per-turn limit and never raising usable AP above the normal turn maximum except where an explicit rule says otherwise.
- **333 Control:** choose one strong control rider appropriate to the action: deny a target's Reaction, establish superior position/cover, secure an additional actionable detail from evidence already available, or remove one significant collateral complication. Exact options should be domain templates, not freeform GM fiat.

### Four Matching Blanks — Major Break
Approximately 0.4–1.1% depending on pool.

- **1111 Impact:** maximize one added effect/weapon die **or add another primary effect die**, whichever the final damage model proves cleaner in simulation. No flat modifier.
- **2222 Tempo:** immediately take one non-Attack 1-AP action related to the current objective, even if the normal turn sequence would otherwise end; once per round maximum.
- **3333 Control:** impose or clear one major scene-relevant condition/positioning state, or establish one decisive evidence/technical/social control advantage supported by the fiction. Must not resolve the entire mission.

### Five Matching Blanks — Extraordinary
Extremely rare in ordinary five-die play.

- **11111 Impact:** extraordinary magnitude. A damaging action may maximize its normal damage/effect dice and add one additional primary die; non-damage actions may achieve the strongest plausible result still inside the declared action's scope. No flat numeric modifier.
- **22222 Tempo:** gain an immediate additional 1-AP action, including an Attack if otherwise legal, or preserve a Reaction already spent this round. This is an explicit exception because of the rarity.
- **33333 Control:** establish near-total control of the immediate action/scene element: disarm and secure, completely pin a route, extract the decisive bounded clue, complete an otherwise multi-step technical manipulation, or equivalent. It cannot override impossible fiction, erase campaign consequences, or dictate another character's moral choice.

### Six Matching Blanks — Legendary Mastery Event
Only possible in six-die pools and extraordinarily rare.

Treat as a campaign-level mechanical event within the immediate scene. Combine the five-match effect with one additional bounded benefit from the same face family, subject to GM/adventure constraints. It still cannot solve the entire adventure or rewrite established facts.

## Success/failure relationship

Matched Blanks do not normally alter the roll's numeric score and do not automatically turn failure into success.

Recommended test rule:
- On a success, apply the listed effect normally.
- On a failure, a pair is ignored; a triple or better may produce a limited partial/side effect if the action could plausibly create one without converting the failure into success.

This keeps the mechanic secondary to the normal Protocol Dice resolution.

## Critical hits

Ordinary critical-hit rules remain intact. A critical hit and Matched Blanks may occur on the same roll. If combined effects become excessive, simulation should establish a stacking cap rather than deleting either system.

## Transparency rule

Players never search the entire pool for combinations. The procedure is:

1. resolve the roll;
2. glance at the blanks;
3. if matching 1s, 2s, or 3s are immediately obvious and useful, apply the corresponding effect;
4. otherwise ignore them and continue.

## Simulation requirements

Test:
- five-die Level-1 attack and armored-defense pools;
- six-die Mastery pools;
- combined crit + Matched Blank events;
- action-economy abuse from 2s;
- damage spikes from 1s using dice-only bonus language;
- control-option clarity from 3s;
- whether pairs occur too frequently to remember comfortably;
- whether failure-side triple effects create confusion;
- whether four/five-match effects feel proportionate to their rarity.

No public product should adopt these effects until simulation passes.
