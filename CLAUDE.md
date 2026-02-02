# Bird Card Blackjack

Mobile-friendly Blackjack web app featuring Tracey's hand-illustrated bird playing cards.

**Live site:** [traceyami.github.io/bird-blackjack](https://traceyami.github.io/bird-blackjack)
**Repo:** [github.com/traceyami/bird-blackjack](https://github.com/traceyami/bird-blackjack)

**Note:** This is a laptop-only project. Development happens on the MacBook Air.

## Quick Commands

Tracey has shell shortcuts set up:

```bash
sync                      # pull latest before working
save "what you changed"   # commit and push
```

Local testing:
```bash
python3 -m http.server 8000    # then visit localhost:8000 or LAN IP:8000 on mobile
```

## Tech Stack

- Vanilla HTML/CSS/JS (no build tools)
- Adobe Fonts: Copperplate via `use.typekit.net/bmv5fsi.css`
- Session storage for bankroll persistence
- GitHub Pages for hosting

**Safari Gotcha:** CSS class-based `display: none` can be unreliable. Use inline `element.style.display` in JavaScript for cross-browser consistency.

## File Structure

```
bird-blackjack/
├── index.html           # Bird in the Hand (main game, inline JS/CSS)
├── styles.css           # Base layout and brand colors
├── assets/cards/        # 55 bird card PNGs (52 + back + 2 jokers)
├── blackjack-original/  # Backup of original MVP
└── README.md
```

**Card naming:** `{suit}_{rank}.png` (e.g., `hearts_A.png`, `spades_K.png`) + `back.png` + `joker_color.png` + `joker_black.png`

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

## Bird in the Hand (Collection Mode)

**Status:** Live as main game in `index.html`

A bingo-style collection mechanic layered on top of blackjack:

### Core Mechanics
- **Bird Cards:** J, Q, K of each suit (12 total, 9 randomly placed on 3x3 board)
- **Capture:** Don't bust → capture any board birds in your hand (even if dealer wins!)
- **Bust:** Lose the birds in your hand (they stay uncaptured)
- **Win Condition:** Complete a line of 3 (row, column, or diagonal)

### Joker Wild Cards
- 2 jokers in deck (`joker_color.png`, `joker_black.png`), only dealt to player
- Joker appears in hand → animates to "pending" area
- Win the hand → choose any empty cell for your wild bird
- Jokers removed from deck once captured (max 2 per run)

### Escalating Pressure
- Minimum bet increases every 2 hands: $25 → $50 → $100 → $200 → $400
- Run ends when bankroll < minimum bet

### Key Files
- `index.html` — Main game (HTML + inline JS/CSS)
- `prototype-bird.html` — Working prototype for testing changes
- Uses same card assets and base styles

### Code Patterns
- Clear `playerHand`/`dealerHand` arrays at end of `endHand()` to remove lingering UI states
- Joker cells tracked in `gameState.jokerCells` as `{ cellIndex: jokerType }` map — shows ★ in mini-grid, correct joker image in full board
- Two jokers are distinct: track per type with `gameState.jokersCaptured = { color: false, black: false }`
- Don't glow/highlight birds that cause a bust — they weren't an "opportunity"
- Don't show mobile grid on bust either — same logic, bird wasn't a real opportunity
- Show inline result ~1.5s before capture/joker modal so player can grok the hand outcome first

### UI Components
- **Mini-grid:** Desktop: top-left corner. Mobile: centered (replaces birb logo) only when bird in hand or joker pending
- **Result system:** Tiered — joker modal (blocking) → capture modal (blocking) → inline result (non-blocking)
- **Game over modal:** Win/lose screen with final board state
- **Hand values:** Soft hands show both values (e.g., "7/17" for A-6)

## TODO

See [TODO.md](TODO.md) for current tasks and ideas.

## Current State

Bird in the Hand is live:
- Bingo collection mechanic working
- Joker wild cards with player choice
- Escalating bet pressure
- Card dealing and flip animations
- Mobile-responsive layout
- Original blackjack MVP backed up in `blackjack-original/`

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
