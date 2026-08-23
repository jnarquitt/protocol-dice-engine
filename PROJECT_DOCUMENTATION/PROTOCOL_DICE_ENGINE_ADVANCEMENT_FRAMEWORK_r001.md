# Protocol Dice Engine — Advancement Framework r001

**Status:** DESIGN AUTHORITY — advancement framework for revision testing
**Design principle:** Protocol Dice Engine defines mechanical progression hooks. Individual games interpret those hooks in their own fiction.

## Ecosystem law

**Protocol Dice Engine is the system. A game built on it is an implementation of that system.**

The Engine should say what advancement changes mechanically, not what that change represents in a setting. A fantasy game, espionage game, occult game, science-fiction game, or homebrew setting should be able to interpret the same advancement structure differently without rewriting the core dice engine.

## Recovered prior advancement material

The existing Protocol Dice Engine v0.005 release establishes that characters begin with three Talents and gain one additional Talent every third Advancement Award. The prior design work also established the working award model of **+2 Skill Ranks per Advancement Award**, with horizontal campaign rewards such as contacts, permissions, safehouses, authority, favors, and relationships available alongside numerical growth.

These are the starting design authorities for the revision. They are not permission to import Protocol 7-specific terms such as BAR or VAM into the generic Engine.

## Generic progression axes

The Engine should support four distinct advancement axes.

### 1. Skill Growth
Improves reliability and specialization using the existing Skill Rank / Skill die structure.

**Working baseline:** each Advancement Award grants **+2 Skill Ranks** to allocate under normal caps and breakpoints.

### 2. Core Growth
Represents occasional improvement to the character's underlying Ability dice or equivalent intrinsic statistics.

Core Growth should be less frequent than Skill Growth. It is deliberately separated from setting-specific features.

### 3. Capacity Growth
Increases the amount of a setting-defined limited resource that a character can sustain, prepare, equip, memorize, install, command, or otherwise keep available simultaneously.

The Engine defines **Capacity** as an optional generic progression hook. It does not define what Capacity means in fiction.

Examples of implementation include technological integration, magical preparation, cyberware load, command resources, attunement, operational assets, or another game-specific limit.

Capacity should grow slowly enough that loadout/preparation decisions remain meaningful.

### 4. Feature Access
Unlocks new or higher-tier setting-defined capabilities.

The Engine uses **Feature** as the generic concept. A particular implementation may call Features Talents, VAMs, spells, techniques, mutations, powers, assets, permissions, or something else.

Higher-tier Features should usually add new decisions or capabilities rather than merely replacing earlier Features with larger numbers. Low-tier Features should remain useful because they may be cheaper, broader, or easier to combine.

## Advancement Awards versus Levels

An **Advancement Award** is the Engine's small unit of character growth. A game implementation may group multiple Awards into a named Level, Rank, Tier, Season, Chapter, or other milestone.

This separation is intentional. It lets a game choose a slow campaign with frequent small Awards or a compressed campaign in which one Level represents multiple Awards.

The Engine itself does not require d20-style levels.

## Horizontal advancement

Campaign rewards may increase character reach without changing dice math. Examples include contacts, favors, permissions, safehouses, reputation, authority, relationships, equipment access, organizations, and setting-specific privileges.

Horizontal rewards are encouraged because they broaden player agency without forcing numerical escalation.

## Fixed-economy principle

Advancement should normally make each action more effective or broaden what the character can attempt rather than automatically increasing the number of actions taken per round.

Implementations should be cautious about scaling core action economy, reaction economy, or equivalent turn-count resources. Such increases multiply the value of every other advancement and can destabilize the engine quickly.

## Homebrew implementation template

A game built on Protocol Dice Engine should explicitly define:

- what one Advancement Award grants;
- whether the game uses named Levels or simply Awards;
- how many Awards normally make up a Level/milestone;
- whether Core Growth exists and how often it occurs;
- whether Capacity exists, what it represents, its starting value, and its progression;
- what Features are called in the setting;
- how Feature access/tiering progresses;
- which horizontal rewards are expected;
- which action-economy values remain fixed.

## Revision test questions

Before this framework becomes release canon, simulations must test:

- whether +2 Skill Ranks per Award produces visible but controlled growth;
- whether Skill breakpoints create dead-feeling Awards;
- how frequently Core Growth can occur without overwhelming Skill identity;
- whether Capacity growth preserves meaningful loadout choices;
- whether Feature tiers create excitement without making old Features obsolete;
- whether grouping two Awards into one milestone can support a compressed six-level campaign;
- whether specialists and generalists remain viable;
- whether fixed action economy remains satisfying at high advancement.

## Protocol 7 relationship

Protocol 7 must implement this framework through its own fiction rather than define new generic Engine mechanics inside the setting line. Its BAR/VAM progression should therefore be documented as a Protocol 7 implementation of Capacity and Feature Access, then stress-tested against the Engine framework.
