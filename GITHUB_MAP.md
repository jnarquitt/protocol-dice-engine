# Jade Lion Studios — GitHub map

When intent is unclear, **prefer repository state over chat memory**. This file indexes sibling public projects so agents and collaborators can find prior work, including useful missteps.

Owner: [github.com/jnarquitt](https://github.com/jnarquitt)

## Studio door (this repo)

| Path | Role |
|------|------|
| `index.html` | **Jade Lion Studios** landing page — Discord paste target; links all creative projects |
| `app/` | Protocol Dice Engine Open Frame playtest app (phone-first) |
| `rules/` | Short Open Frame rules guide |
| `data/` | JSON authorities (skills, features, spells, archetypes, rules-core) |
| `DECISIONS.md` | Product decisions for this playtest |

## Protocol family

| Repo | Live / notes |
|------|----------------|
| [protocol-7](https://github.com/jnarquitt/protocol-7) | [Pages](https://jnarquitt.github.io/protocol-7/) — flagship SF setting; **mechanical playtest ancestor** (v0.188 Vector App, APP_REBUILD JSON, Continuance Files) |
| [protocol-dice-engine](https://github.com/jnarquitt/protocol-dice-engine) | [Pages](https://jnarquitt.github.io/protocol-dice-engine/) — **current** Jade Lion Studios door + Open Frame app; v0.005 under `/archive/v0.005/` |
| [protocol-dice](https://github.com/jnarquitt/protocol-dice) | Clean-start CORE_MECHANICS + lean sheet; informed Open Frame rebuild |
| [commander-x16-protocol-adventure](https://github.com/jnarquitt/commander-x16-protocol-adventure) | [Pages](https://jnarquitt.github.io/commander-x16-protocol-adventure/) — X16 game adaptation of Ash Ledger / Protocol Dice |

## Other creative / tools

| Repo | Notes |
|------|--------|
| [jnarquitt.github.io](https://github.com/jnarquitt/jnarquitt.github.io) | Professional/personal hub |
| [I-am-reader](https://github.com/jnarquitt/I-am-reader) | Novel reader for *I AM* |
| [vecna-murder-house-guide](https://github.com/jnarquitt/vecna-murder-house-guide) | DM field guide ([via hub](https://jnarquitt.github.io/vecna/)) |
| [space-traders](https://github.com/jnarquitt/space-traders) | Telnet Trade Wars–style MUD |
| [helcalc](https://github.com/jnarquitt/helcalc) | Unused Netlify Next starter — low signal |

## How to use this map

1. **Mechanics questions** → `protocol-7` `PROJECT_DOCUMENTATION/` + `APP_REBUILD/`, then this repo’s `data/rules-core.json`.
2. **Agnostic extraction attempts** → `protocol-dice` then older `protocol-dice-engine` (learn from drift).
3. **Mobile UX law** → P7 `P7_v0.188_MOBILE_INTERACTION_LOCK_r001.md` and Play tab standard.
4. **Brand / share link** → this repo’s `index.html` (Jade Lion Studios).

## Back-burner hygiene

- Keep this map updated when repos are renamed, archived, or promoted.
- Prefer promoting a winning playtest *into* a clear Pages URL over leaving three divergent Engine homes.
- Do not silently resurrect discarded mechanics from old apps (P7 no-resurrection rule).
