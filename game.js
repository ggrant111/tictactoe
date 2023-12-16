const mainCells = document.querySelectorAll(".main-cell");
const subCells = document.querySelectorAll(".sub-cell");
let currentPlayer = "X";
let gameState = new Array(9).fill(null).map(() => new Array(9).fill(""));
let mainGameState = new Array(9).fill("");
let lastPlayedCell = null;

function isCellPlayable(mainCellIndex) {
  // If it's the first move or the sub-board corresponding to the last move is won or full,
  // the player can play in any sub-board that's not won and not full
  if (
    lastPlayedCell === null ||
    isMainCellWon(lastPlayedCell) ||
    isMainCellFull(lastPlayedCell)
  ) {
    return !isMainCellWon(mainCellIndex) && !isMainCellFull(mainCellIndex);
  }

  // Otherwise, the player must play in the sub-board corresponding to the last move
  return mainCellIndex === lastPlayedCell;
}

function isMainCellWon(mainCellIndex) {
  return (
    mainGameState[mainCellIndex] === "X" || mainGameState[mainCellIndex] === "O"
  );
}

function isMainCellFull(mainCellIndex) {
  return gameState[mainCellIndex].every((cell) => cell !== "");
}

function checkSubBoardWinner(mainCellIndex) {
  const subBoard = gameState[mainCellIndex];
  const winConditions = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      subBoard[a] &&
      subBoard[a] === subBoard[b] &&
      subBoard[a] === subBoard[c]
    ) {
      mainGameState[mainCellIndex] = currentPlayer; // Update main game state

      // Add class to the main cell to reflect the win
      mainCells[mainCellIndex].classList.add(currentPlayer.toLowerCase());

      return true; // Return true indicating a win
    }
  }

  return false; // Return false if no win condition is met
}

function checkMainBoardWinner() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      mainGameState[a] &&
      mainGameState[a] === mainGameState[b] &&
      mainGameState[a] === mainGameState[c]
    ) {
      return mainGameState[a]; // Returns 'X' or 'O' if there's a winner
    }
  }
  return null;
}

function updateStatusText() {
  const statusTextElement = document.getElementById("statusText");
  statusTextElement.textContent = currentPlayer + "'s turn";
}
function checkForWinner() {
  const winner = checkMainBoardWinner(); // Your existing function to check the winner
  if (winner) {
    document.getElementById("winnerMessage").textContent =
      winner + " wins the Game!";
    document.getElementById("winnerModal").style.display = "block";
  }
}

// Call this function after each move to check for a winner

function handleSubCellClick(event) {
  const subCell = event.target;
  const subCellIndex = parseInt(subCell.id.split("-")[2]) - 1;
  const mainCell = subCell.parentElement;
  const mainCellIndex = parseInt(mainCell.id.replace("main-cell", "")) - 1;

  // Check if the main cell (sub-board) is already won or if the clicked sub-cell is already marked
  if (
    isMainCellWon(mainCellIndex) ||
    gameState[mainCellIndex][subCellIndex] !== ""
  ) {
    return;
  }

  // Check if the cell is playable based on game rules
  if (!isCellPlayable(mainCellIndex)) {
    return;
  }

  gameState[mainCellIndex][subCellIndex] = currentPlayer;
  subCell.textContent = currentPlayer; // Update with X and O styles

  if (checkSubBoardWinner(mainCellIndex)) {
    const winner = checkMainBoardWinner();
    if (winner) {
      console.log(winner + " wins the main board!");
      const statusTextElement = document.getElementById("statusText");
      statusTextElement.textContent = winner + " wins the Game!";
      checkForWinner();
    } else {
      // Continue the game if no main board winner yet
      lastPlayedCell = subCellIndex;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatusText();
      checkForWinner();
    }
  } else {
    // Continue the game if no sub-board winner
    lastPlayedCell = subCellIndex;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();
    checkForWinner();
  }
}

function resetGame() {
  if (confirm("Are you sure you want to reset the game?")) {
    // Reset the game state
    gameState = new Array(9).fill(null).map(() => new Array(9).fill(""));
    mainGameState = new Array(9).fill("");
    lastPlayedCell = null;
    currentPlayer = "X";

    // Reset the UI
    subCells.forEach((subCell) => {
      subCell.textContent = "";
      subCell.classList.remove("x", "o");
    });
    mainCells.forEach((mainCell) => {
      mainCell.classList.remove("won", "x", "o");
    });

    // Add any additional reset logic here
  }
}

updateStatusText();

subCells.forEach((subCell) => {
  subCell.addEventListener("click", handleSubCellClick);
});

document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("startNewGame").addEventListener("click", function () {
  resetGame(); // Your existing reset game function
  document.getElementById("winnerModal").style.display = "none";
  updateStatusText();
});
