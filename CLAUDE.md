# Bird Card Blackjack

Mobile-friendly Blackjack web app featuring Tracey's hand-illustrated bird playing cards.

**Live site:** [traceyami.github.io/bird-blackjack](https://traceyami.github.io/bird-blackjack)
**Repo:** [github.com/traceyami/bird-blackjack](https://github.com/traceyami/bird-blackjack)

## Quick Commands

Tracey has shell shortcuts set up on both machines:

```bash
sync                      # pull latest before working
save "what you changed"   # commit and push
```

## Tech Stack

- Vanilla HTML/CSS/JS (no build tools)
- Adobe Fonts: Copperplate via `use.typekit.net/bmv5fsi.css`
- Session storage for bankroll persistence
- GitHub Pages for hosting

## File Structure

```
bird-blackjack/
├── index.html      # Single page app
├── styles.css      # Layout, animations, brand colors
├── game.js         # Game logic and state
├── assets/cards/   # 55 bird card PNGs (52 + back + 2 jokers)
└── README.md
```

**Card naming:** `{suit}_{rank}.png` (e.g., `hearts_A.png`, `spades_K.png`) + `back.png`

## Brand Colors

From birb cards marketing materials:

| Color | Hex | Usage |
|-------|-----|-------|
| Green | `#025b2a` | Table felt background |
| Red | `#c8102e` | Hearts/diamonds, lose states |
| Gold | `#ffcd00` | Highlights, win states |
| Black | `#231f20` | Text, spades/clubs |
| White | `#f8f9fd` | Card faces |
| Brown | `#996c2e` | Secondary accent |
| Blue | `#004c97` | Sparingly for buttons |

## Working Style

**IMPORTANT: Never push to GitHub unless explicitly told to.** Always prototype changes locally first using prototype files. Only commit and push when Tracey says the changes are ready.

- Create prototype files (e.g., `prototype-layout.html`) for testing design changes
- Use `<style>` overrides in prototype files to test CSS changes without modifying `styles.css`
- Allow side-by-side comparison of variations before committing to changes
- When enough changes feel good together, Tracey will ask to update the main files and push

## Game Rules (MVP)

- Start with $500, fixed $25 bet
- Actions: Hit, Stand, Double Down (no split yet)
- Dealer hits on 16 or less, stands on 17+
- Blackjack pays 3:2

## TODO / Reminders

- [ ] **Fix 3 of diamonds card** — `assets/cards/diamonds_3.png` is missing its white background
- [ ] **Smooth card dealing animation** — First card slides jerkily when second card is dealt; needs smoother repositioning

## Current State

MVP complete and deployed:
- Full game loop working
- Card dealing and flip animations
- Session storage persists bankroll
- Mobile-responsive layout
- "Broke" state with restart option

## Future Ideas

- Split functionality
- Variable bet amounts
- Win/loss statistics
- Sound effects (off by default)
- More celebratory blackjack animation

## Related Files

Card assets and docs live in the second brain:
- `Personal/bird card game/assets/` — source card images
- `Personal/bird card game/brand assets/` — brand guidelines
- `Personal/bird card game/git-guide.md` — git command reference
