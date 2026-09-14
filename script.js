// This file creates the empty 4 by 4 board.
// Move rules, win detection, and AI will be added in later steps.

document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.querySelector(".page-title");
  const gameStatus = document.querySelector("#game-status");
  const gameMessage = document.querySelector("#game-message");
  const gameBoard = document.querySelector("#game-board");
  const selectedCells = [];
  let playerZeroMoveCompleted = false;

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
        if (playerZeroMoveCompleted || cell.classList.contains("vertical-piece")) {
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
          const sameColumn =
            firstCell.dataset.column === secondCell.dataset.column;
          const consecutiveRows =
            Math.abs(
              Number(firstCell.dataset.row) - Number(secondCell.dataset.row),
            ) === 1;

          if (sameColumn && consecutiveRows) {
            selectedCells.forEach((selectedCell) => {
              selectedCell.classList.remove("selected");
              selectedCell.classList.add("vertical-piece");
              selectedCell.textContent = "V";
              selectedCell.disabled = true;
            });

            playerZeroMoveCompleted = true;
            gameStatus.textContent = "Player 1’s turn.";
          } else {
            selectedCells.forEach((selectedCell) =>
              selectedCell.classList.remove("selected"),
            );
            selectedCells.length = 0;
            gameMessage.textContent =
              "Choose two empty cells in one column next to each other.";
          }
        }
      });

      gameBoard.appendChild(cell);
    }
  }

  console.log("Domineering Minimax page loaded successfully.");
});
