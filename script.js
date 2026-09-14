// This file creates the board and handles the two players' basic move rules.
// Win detection and AI will be added in later steps.

document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.querySelector(".page-title");
  const gameStatus = document.querySelector("#game-status");
  const gameMessage = document.querySelector("#game-message");
  const gameBoard = document.querySelector("#game-board");
  const newGameButton = document.querySelector("#new-game-button");
  const selectedCells = [];
  let currentPlayer = 0;
  let gameOver = false;

  const setStatusForPlayer = () => {
    const pieceDirection = currentPlayer === 0 ? "vertical" : "horizontal";
    gameStatus.textContent = `Player ${currentPlayer}’s turn: place a ${pieceDirection} piece.`;
  };

  const hasLegalMove = (player) => {
    const cells = Array.from(gameBoard.querySelectorAll(".board-cell"));
    const emptyCells = cells.filter(
      (cell) =>
        !cell.classList.contains("vertical-piece") &&
        !cell.classList.contains("horizontal-piece"),
    );

    return emptyCells.some((firstCell) =>
      emptyCells.some((secondCell) => {
        if (firstCell === secondCell) {
          return false;
        }

        const sameLine =
          player === 0
            ? firstCell.dataset.column === secondCell.dataset.column
            : firstCell.dataset.row === secondCell.dataset.row;
        const consecutivePositions =
          player === 0
            ? Math.abs(
                Number(firstCell.dataset.row) -
                  Number(secondCell.dataset.row),
              ) === 1
            : Math.abs(
                Number(firstCell.dataset.column) -
                  Number(secondCell.dataset.column),
              ) === 1;

        return sameLine && consecutivePositions;
      }),
    );
  };

  const endGameIfNeeded = () => {
    if (!hasLegalMove(currentPlayer)) {
      const winner = currentPlayer === 0 ? 1 : 0;
      gameOver = true;
      gameStatus.textContent = `Player ${winner} wins!`;
      gameMessage.textContent = `Player ${currentPlayer} has no legal moves.`;
      gameBoard.querySelectorAll(".board-cell").forEach((cell) => {
        cell.disabled = true;
      });
    }
  };

  if (pageTitle) {
    pageTitle.textContent = "Domineering Minimax";
  }

  if (gameBoard) {
    // Create one clickable button for each of the 16 board cells.
    for (let cellNumber = 0; cellNumber < 16; cellNumber += 1) {
      const cell = document.createElement("button");

      cell.type = "button";
      cell.className = "board-cell";
      cell.setAttribute("aria-label", `Board cell ${cellNumber + 1}`);
      cell.dataset.row = String(Math.floor(cellNumber / 4));
      cell.dataset.column = String(cellNumber % 4);

      cell.addEventListener("click", () => {
        if (gameOver) {
          return;
        }

        if (
          cell.classList.contains("vertical-piece") ||
          cell.classList.contains("horizontal-piece")
        ) {
          return;
        }

        gameMessage.textContent = "";

        if (selectedCells.includes(cell)) {
          cell.classList.remove("selected");
          selectedCells.splice(selectedCells.indexOf(cell), 1);
          return;
        }

        cell.classList.add("selected");
        selectedCells.push(cell);

        if (selectedCells.length === 2) {
          const firstCell = selectedCells[0];
          const secondCell = selectedCells[1];
          const sameLine =
            currentPlayer === 0
              ? firstCell.dataset.column === secondCell.dataset.column
              : firstCell.dataset.row === secondCell.dataset.row;
          const consecutivePositions =
            currentPlayer === 0
              ? Math.abs(
                  Number(firstCell.dataset.row) -
                    Number(secondCell.dataset.row),
                ) === 1
              : Math.abs(
                  Number(firstCell.dataset.column) -
                    Number(secondCell.dataset.column),
                ) === 1;

          if (sameLine && consecutivePositions) {
            const pieceClass =
              currentPlayer === 0 ? "vertical-piece" : "horizontal-piece";
            const pieceLetter = currentPlayer === 0 ? "V" : "H";

            selectedCells.forEach((selectedCell) => {
              selectedCell.classList.remove("selected");
              selectedCell.classList.add(pieceClass);
              selectedCell.textContent = pieceLetter;
              selectedCell.disabled = true;
            });

            selectedCells.length = 0;
            currentPlayer = currentPlayer === 0 ? 1 : 0;
            setStatusForPlayer();
            endGameIfNeeded();
          } else {
            selectedCells.forEach((selectedCell) =>
              selectedCell.classList.remove("selected"),
            );
            selectedCells.length = 0;
            gameMessage.textContent =
              currentPlayer === 0
                ? "Player 0 needs two cells in one column next to each other."
                : "Player 1 needs two cells in one row next to each other.";
          }
        }
      });

      gameBoard.appendChild(cell);
    }
  }

  newGameButton.addEventListener("click", () => {
    gameBoard.querySelectorAll(".board-cell").forEach((cell) => {
      cell.className = "board-cell";
      cell.textContent = "";
      cell.disabled = false;
    });

    selectedCells.length = 0;
    currentPlayer = 0;
    gameOver = false;
    gameMessage.textContent = "";
    setStatusForPlayer();
  });

  console.log("Domineering Minimax page loaded successfully.");
});
