// This file creates the board, handles moves, and runs depth-limited searches.

document.addEventListener("DOMContentLoaded", () => {
  const BOARD_SIZE = 4;
  const MAX_SEARCH_DEPTH = 5;
  const COMPUTER_WIN_SCORE = 100000;
  const ESTIMATED_BYTES_PER_CELL = 1;
  const pageTitle = document.querySelector(".page-title");
  const gameStatus = document.querySelector("#game-status");
  const gameMessage = document.querySelector("#game-message");
  const gameBoard = document.querySelector("#game-board");
  const newGameButton = document.querySelector("#new-game-button");
  const winnerOverlay = document.querySelector("#winner-overlay");
  const winnerTitle = document.querySelector("#winner-title");
  const playAgainButton = document.querySelector("#play-again-button");
  const searchMode = document.querySelector("#search-mode");
  const humanDirectionSelect = document.querySelector("#human-direction");
  const selectedCells = [];
  let humanDirection = humanDirectionSelect.value;
  let computerDirection = humanDirection === "vertical" ? "horizontal" : "vertical";
  let currentPlayer = 0;
  let gameOver = false;
  let computerThinking = false;
  let computerMoveTimer;
  let confettiTimer;

  const setStatusForPlayer = () => {
    const pieceDirection =
      currentPlayer === 0 ? humanDirection : computerDirection;
    gameStatus.textContent = `Player ${currentPlayer}’s turn: place a ${pieceDirection} piece.`;
  };

  humanDirectionSelect.addEventListener("change", () => {
    humanDirection = humanDirectionSelect.value;
    computerDirection =
      humanDirection === "vertical" ? "horizontal" : "vertical";
    setStatusForPlayer();
  });

  const getLegalMoves = (board, player) => {
    const moves = [];
    const direction = player === 0 ? humanDirection : computerDirection;
    const isVertical = direction === "vertical";
    const rowStep = isVertical ? 1 : 0;
    const columnStep = isVertical ? 0 : 1;
    const lastRow = isVertical ? BOARD_SIZE - 1 : BOARD_SIZE;
    const lastColumn = isVertical ? BOARD_SIZE : BOARD_SIZE - 1;

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
      estimatedMemoryBytes:
        searchStats.checkedStates *
        BOARD_SIZE *
        BOARD_SIZE *
        ESTIMATED_BYTES_PER_CELL,
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
    const firstCell = cells[computerMove.firstIndex];
    const secondCell = cells[computerMove.secondIndex];
    const pieceLetter = computerDirection === "vertical" ? "V" : "H";
    const pieceClass =
      computerDirection === "vertical"
        ? "vertical-piece"
        : "horizontal-piece";
    markPiece(
      [firstCell, secondCell],
      pieceClass,
      pieceLetter,
    );
    const firstRow = Math.floor(computerMove.firstIndex / BOARD_SIZE) + 1;
    const secondRow = Math.floor(computerMove.secondIndex / BOARD_SIZE) + 1;
    const firstColumn = (computerMove.firstIndex % BOARD_SIZE) + 1;
    const secondColumn = (computerMove.secondIndex % BOARD_SIZE) + 1;
    const moveDescription =
      computerDirection === "vertical"
        ? `column ${firstColumn}, rows ${firstRow}-${secondRow}`
        : `row ${firstRow}, columns ${firstColumn}-${secondColumn}`;
    const estimatedMemoryKilobytes = (
      searchResult.estimatedMemoryBytes / 1024
    ).toFixed(1);
    gameMessage.textContent =
      `Computer placed ${pieceLetter} at ${moveDescription}. ` +
      `${searchResult.mode}; search depth: ${MAX_SEARCH_DEPTH}; ` +
      `states checked: ${searchResult.checkedStates}; ` +
      `estimated state data: ${estimatedMemoryKilobytes} KB; ` +
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
          const selectedDirection =
            currentPlayer === 0 ? humanDirection : computerDirection;
          const selectedPieceIsVertical = selectedDirection === "vertical";
          const sameLine =
            selectedPieceIsVertical
              ? firstCell.dataset.column === secondCell.dataset.column
              : firstCell.dataset.row === secondCell.dataset.row;
          const consecutivePositions =
            selectedPieceIsVertical
              ? Math.abs(
                  Number(firstCell.dataset.row) -
                    Number(secondCell.dataset.row),
                ) === 1
              : Math.abs(
                  Number(firstCell.dataset.column) -
                    Number(secondCell.dataset.column),
                ) === 1;

          if (sameLine && consecutivePositions) {
            const pieceDirection =
              currentPlayer === 0 ? humanDirection : computerDirection;
            const pieceClass =
              pieceDirection === "vertical"
                ? "vertical-piece"
                : "horizontal-piece";
            const pieceLetter = pieceDirection === "vertical" ? "V" : "H";

            selectedCells.forEach((selectedCell) => {
              selectedCell.classList.remove("selected");
              selectedCell.classList.add(pieceClass);
              selectedCell.textContent = pieceLetter;
              selectedCell.disabled = true;
            });

            selectedCells.length = 0;
            humanDirectionSelect.disabled = true;
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
              selectedPieceIsVertical
                ? "Choose two cells in one column next to each other."
                : "Choose two cells in one row next to each other.";
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
    humanDirection = humanDirectionSelect.value;
    computerDirection =
      humanDirection === "vertical" ? "horizontal" : "vertical";
    humanDirectionSelect.disabled = false;
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
