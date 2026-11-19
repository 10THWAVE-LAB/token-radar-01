# Token Launch Radar

![token-radar-01](https://make.fun/badge/token-radar-01.svg)
![rank](https://make.fun/badge/token-radar-01/10THWAVE-LAB/token-radar-01/rank.svg)
![reward](https://make.fun/badge/token-radar-01/10THWAVE-LAB/token-radar-01/reward.svg)

A token launch radar for the [token-radar-01 bounty](https://make.fun/bounty/token-radar-01): it ranks every protocol in a sealed DefiLlama snapshot that records no token, by an implied value built only from that protocol's own TVL, its seven-day growth and how long it has run with no token — and hands each one a seven-step farm plan with costs and times.

## The model (radar-2)

- **Base** = TVL × 0.30
- **Growth multiplier** = 1 + clamped 7-day change × 0.60, floored at 0.55 (change clamped to −50…+150%)
- **Maturity multiplier** = 0.50 + 0.50 × (1 − e^(−age/365)) — a protocol that has run longer with no token recorded sits closer to its full base
- **Implied value** = base × growth multiplier × maturity multiplier

No protocol name is ever special-cased. The board ranks all 40 watchlist protocols (pre-token, ≥ $50M TVL, not a wrapped/staked/bridged product of a token that already trades) plus the 200 largest pre-token protocols below the floor. Protocols whose token already trades appear in their own "already trading" table with the market's own market cap — never ranked above a pre-token protocol.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input /home/hatch/workspace/makefun/kits/token-radar-01-kit/input/snapshot.json
```

Node 22, standard library only. It writes `out/board.json`, `out/data.js`, `out/dashboard/`, `out/screenshots/` and `out/dossier.json`. Run it twice: both runs write the same bytes.

Referral code: `fnrz5qxg`
