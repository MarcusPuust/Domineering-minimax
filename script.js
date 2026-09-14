// This file creates the board, handles moves, and runs depth-limited searches.

document.addEventListener("DOMContentLoaded", () => {
  const BOARD_SIZE = 4;
  const MAX_SEARCH_DEPTH = 5;
  const COMPUTER_WIN_SCORE = 100000;
  const pageTitle = document.querySelector(".page-title");
  const gameStatus = document.querySelector("#game-status");
  const gameMessage = document.querySelector("#game-message");
  const gameBoard = document.querySelector("#game-board");
  const newGameButton = document.querySelector("#new-game-button");
  const winnerOverlay = document.querySelector("#winner-overlay");
  const winnerTitle = document.querySelector("#winner-title");
  const playAgainButton = document.querySelector("#play-again-button");
  const searchMode = document.querySelector("#search-mode");
  const selectedCells = [];
  let currentPlayer = 0;
  let gameOver = false;
  let computerThinking = false;
  let computerMoveTimer;
  let confettiTimer;

  const setStatusForPlayer = () => {
    const pieceDirection = currentPlayer === 0 ? "vertical" : "horizontal";
    gameStatus.textContent = `Player ${currentPlayer}’s turn: place a ${pieceDirection} piece.`;
  };

  const getLegalMoves = (board, player) => {
    const moves = [];
    const rowStep = player === 0 ? 1 : 0;
    const columnStep = player === 0 ? 0 : 1;
    const lastRow = player === 0 ? BOARD_SIZE - 1 : BOARD_SIZE;
    const lastColumn = player === 0 ? BOARD_SIZE : BOARD_SIZE - 1;

    for (let row = 0; row < lastRow; row += 1) {
      for (let column = 0; column < lastColumn; column += 1) {
        const firstIndex = row * BOARD_SIZE + column;
        const secondIndex =
          (row + rowStep) * BOARD_SIZE + column + columnStep;

        if (board[firstIndex] === null && board[secondIndex] === null) {
          moves.push({ firstIndex, secondIndex });
        }
      }
    }

    return moves;
  };

  const getBoardState = () =>
    Array.from(gameBoard.querySelectorAll(".board-cell")).map((cell) => {
      if (cell.classList.contains("vertical-piece")) {
        return 0;
      }
      if (cell.classList.contains("horizontal-piece")) {
        return 1;
      }
      return null;
    });

  const applyMove = (board, move, player) => {
    const nextBoard = [...board];
    nextBoard[move.firstIndex] = player;
    nextBoard[move.secondIndex] = player;
    return nextBoard;
  };

  const evaluateBoard = (board) =>
    getLegalMoves(board, 1).length - getLegalMoves(board, 0).length;

  const minimax = (board, player, depth, searchStats) => {
    searchStats.checkedStates += 1;
    const legalMoves = getLegalMoves(board, player);

    if (legalMoves.length === 0) {
      return player === 1 ? -COMPUTER_WIN_SCORE : COMPUTER_WIN_SCORE;
    }

    if (depth === 0) {
      return evaluateBoard(board);
    }

    const scores = legalMoves.map((move) =>
      minimax(applyMove(board, move, player), player === 1 ? 0 : 1, depth - 1, searchStats),
    );

    return player === 1 ? Math.max(...scores) : Math.min(...scores);
  };

  const alphaBeta = (
    board,
    player,
    depth,
    searchStats,
    alpha,
    beta,
  ) => {
    searchStats.checkedStates += 1;
    const legalMoves = getLegalMoves(board, player);

    if (legalMoves.length === 0) {
      return player === 1 ? -COMPUTER_WIN_SCORE : COMPUTER_WIN_SCORE;
    }

    if (depth === 0) {
      return evaluateBoard(board);
    }

    if (player === 1) {
      let bestScore = -Infinity;

      for (const move of legalMoves) {
        const score = alphaBeta(
          applyMove(board, move, player),
          0,
          depth - 1,
          searchStats,
          alpha,
          beta,
        );
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);

        if (beta <= alpha) {
          break;
        }
      }

      return bestScore;
    }

    let bestScore = Infinity;

    for (const move of legalMoves) {
      const score = alphaBeta(
        applyMove(board, move, player),
        1,
        depth - 1,
        searchStats,
        alpha,
        beta,
      );
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        break;
      }
    }

    return bestScore;
  };

  const chooseComputerMove = (board) => {
    const searchStats = { checkedStates: 0 };
    const startTime = performance.now();
    const legalMoves = getLegalMoves(board, 1);
    const useAlphaBeta = searchMode.value === "alpha-beta";
    let bestMove = legalMoves[0];
    let bestScore = -Infinity;

    legalMoves.forEach((move) => {
      const nextBoard = applyMove(board, move, 1);
      const score = useAlphaBeta
        ? alphaBeta(
            nextBoard,
            0,
            MAX_SEARCH_DEPTH - 1,
            searchStats,
            -Infinity,
            Infinity,
          )
        : minimax(nextBoard, 0, MAX_SEARCH_DEPTH - 1, searchStats);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return {
      move: bestMove,
      mode: useAlphaBeta ? "Minimax with alpha-beta pruning" : "Minimax",
      checkedStates: searchStats.checkedStates,
      elapsedMilliseconds: Math.round(performance.now() - startTime),
    };
  };

  const hasLegalMove = (player) => {
    return getLegalMoves(getBoardState(), player).length > 0;
  };

  const markPiece = (cells, pieceClass, pieceLetter) => {
    cells.forEach((cell) => {
      cell.classList.add(pieceClass);
      cell.textContent = pieceLetter;
      cell.disabled = true;
    });
  };

  const showConfetti = () => {
    const colors = ["#2563eb", "#f97316", "#facc15", "#22c55e", "#ec4899"];
    const confetti = [];

    for (let index = 0; index < 36; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.35}s`;
      document.body.appendChild(piece);
      confetti.push(piece);
    }

    confettiTimer = setTimeout(() => {
      confetti.forEach((piece) => piece.remove());
    }, 2000);
  };

  const showWinnerOverlay = (winner) => {
    winnerTitle.textContent = winner === 0 ? "You win!" : "Computer wins!";
    winnerOverlay.hidden = false;

    if (winner === 0) {
      showConfetti();
    }
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
      showWinnerOverlay(winner);
    }
  };

  const makeComputerMove = () => {
    computerThinking = false;
    const searchResult = chooseComputerMove(getBoardState());
    const computerMove = searchResult.move;

    if (!computerMove) {
      endGameIfNeeded();
      return;
    }

    const cells = gameBoard.querySelectorAll(".board-cell");
    markPiece(
      [cells[computerMove.firstIndex], cells[computerMove.secondIndex]],
      "horizontal-piece",
      "H",
    );
    const row = Math.floor(computerMove.firstIndex / BOARD_SIZE) + 1;
    const firstColumn = (computerMove.firstIndex % BOARD_SIZE) + 1;
    const secondColumn = (computerMove.secondIndex % BOARD_SIZE) + 1;
    gameMessage.textContent =
      `Computer placed H at row ${row}, columns ${firstColumn}-${secondColumn}. ` +
      `${searchResult.mode}; search depth: ${MAX_SEARCH_DEPTH}; ` +
      `states checked: ${searchResult.checkedStates}; ` +
      `time: ${searchResult.elapsedMilliseconds} ms.`;
    currentPlayer = 0;
    setStatusForPlayer();
    endGameIfNeeded();
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
        if (gameOver || computerThinking || currentPlayer !== 0) {
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
            currentPlayer = 1;

            if (!hasLegalMove(currentPlayer)) {
              endGameIfNeeded();
              return;
            }

            computerThinking = true;
            gameStatus.textContent = "Computer is thinking...";
            gameMessage.textContent = "";
            computerMoveTimer = setTimeout(makeComputerMove, 500);
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

  const resetGame = () => {
    clearTimeout(computerMoveTimer);
    clearTimeout(confettiTimer);
    document.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove());
    gameBoard.querySelectorAll(".board-cell").forEach((cell) => {
      cell.className = "board-cell";
      cell.textContent = "";
      cell.disabled = false;
    });

    selectedCells.length = 0;
    currentPlayer = 0;
    gameOver = false;
    computerThinking = false;
    gameMessage.textContent = "";
    winnerOverlay.hidden = true;
    setStatusForPlayer();
  };

  newGameButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);

  console.log("Domineering Minimax page loaded successfully.");
});
