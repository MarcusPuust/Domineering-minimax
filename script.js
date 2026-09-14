// This file creates the empty 4 by 4 board.
// Move rules, win detection, and AI will be added in later steps.

document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.querySelector(".page-title");
  const gameBoard = document.querySelector("#game-board");

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
      gameBoard.appendChild(cell);
    }
  }

  console.log("Domineering Minimax page loaded successfully.");
});
