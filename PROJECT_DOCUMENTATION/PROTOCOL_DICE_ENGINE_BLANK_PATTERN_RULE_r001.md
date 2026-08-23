# Protocol Dice Engine — Blank Pattern Rule r001

**Status:** DESIGN CANDIDATE — simulation required

## Scope decision

The broader **Dice Tricks** concept is tabled from Protocol Dice Engine development for now. It should not be treated as part of Protocol 7 or the current core-engine revision. The separate Dice Tricks project may later be developed primarily as a d20-facing concept.

Protocol Dice Engine retains only a deliberately small optional pattern hook based on the faces that already count as blanks under Protocol Dice scoring.

## Core observation

After resolving a roll normally, a player or GM may make one quick visual check of the dice showing **1, 2, or 3**.

Only matching blank faces matter.

Recognized patterns:
- a pair of 1s;
- a pair of 2s;
- a pair of 3s;
- three 1s;
- three 2s;
- three 3s.

No straights, full houses, four-of-a-kind, mixed 1-2-3 combinations, matched scoring faces, poker hands, or other pattern hunting are part of this rule.

If none of the six recognized patterns is immediately visible, ignore the mechanic and continue play.

## Transparency principle

This mechanic must be optional in attention even when present in a game. A table should be able to resolve the ordinary Protocol Dice result first and completely ignore blank patterns whenever the current situation, adventure, GM, or implementation has no use for them.

The mechanic must never require players to pause and analyze the whole pool for combinations.

## Effect design

The specific meaning of each pair/triple is intentionally unresolved in r001. Effects should be:
- fast to recognize;
- easy to remember or reference;
- secondary to the normal success result;
- capable of being ignored when irrelevant;
- different enough that 1s, 2s, and 3s have distinct identities;
- stronger for triples than pairs.

Effects must be simulation-tested at normal and Mastery pool sizes before promotion.

## Naming

Do **not** call this mechanic Dice Tricks. A final name will be chosen after its function and tone are established.
