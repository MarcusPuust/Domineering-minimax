# Domineering Minimax

This school project is a Domineering game on a 4 by 4 board. Player 0 is
currently controlled by the human, and Player 1 will become the computer
opponent in a later task.

## Current features

- A 4 by 4 clickable board.
- Player 0 vertical 1 by 2 pieces.
- Player 1 horizontal 1 by 2 pieces.
- Legal move validation for both players.
- Win detection when the next player has no legal move.
- A New Game button.
- No AI, minimax, or alpha-beta pruning yet.

## Files

- `AGENTS.md` — project instructions and development requirements.
- `index.html` — page structure, game status, board, and New Game button.
- `style.css` — page, board, piece, and button styling.
- `script.js` — board creation, move validation, win detection, and reset logic.

## Setup and play

The project uses only HTML, CSS, and JavaScript with no external libraries.
Open `index.html` directly in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Click two cells to place a piece according
to the current player's direction. Select **New Game** to reset the board.

## GitHub repository

https://github.com/MarcusPuust/Domineering-minimax

## Development diary

### Prompt 1: Create the initial project

- **Result:** Created the title page and short description.
- **Files:** `AGENTS.md`, `index.html`, `style.css`, `script.js`, and `README.md`.
- **Problem:** The project folder was not yet a Git repository.
- **Fix:** Initialized Git and published the first commit to GitHub.

### Prompt 2: Add the 4 by 4 board

- **Result:** Added a CSS Grid board containing 16 clickable cells.
- **Files:** `index.html`, `style.css`, `script.js`, and `README.md`.
- **Testing:** Verified four computed grid columns and four computed grid rows.

### Prompt 3: Add Player 0 rules

- **Result:** Added vertical two-cell selection for Player 0, blue `V` pieces,
  and invalid-selection feedback.
- **Files:** `index.html`, `style.css`, `script.js`, and `README.md`.
- **Testing:** Tested one invalid horizontal selection and one valid vertical
  selection.

### Prompt 4: Add Player 1 rules

- **Result:** Added horizontal two-cell selection for Player 1, orange `H`
  pieces, alternating turns, and invalid-selection feedback.
- **Files:** `script.js`, `style.css`, and `README.md`.
- **Problem:** The selected-cell state was not cleared after a valid move.
- **Fix:** Cleared the selection array after each valid move and retested both
  players.

### Prompt 5: Add win detection

- **Result:** Added legal-move checks after each valid move, winner messaging,
  disabled board cells after a win, and the New Game reset button.
- **Files:** `index.html`, `style.css`, `script.js`, and `README.md`.
- **Testing:** Played a complete game to a winner and verified that New Game
  restored the initial turn, empty board, and enabled cells.

### Current task: Update project instructions

- **Result:** Updated `AGENTS.md` with the school-project rules, development
  process, AI roadmap, and GitHub requirements. Updated this README with setup,
  play instructions, the repository link, and the development diary.
- **Testing:** Verified the documentation content and checked the Git working
  tree before committing.
