const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const modeSelector = document.getElementById("mode");
const startButton = document.getElementById("start-game");
const gameBoard = document.getElementById("game-board");
const winCat = document.getElementById("win-cat");

let gameState = Array(9).fill(null);
let currentPlayer = "Player";
let isGameActive = false;
let mode = "2player";

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// AI Logic
const aiMove = {
    easy: () => {
        const available = gameState.map((v, i) => v === null ? i : null).filter(i => i !== null);
        return available[Math.floor(Math.random() * available.length)];
    },
    medium: () => {
        // Basic strategic AI
        return aiMove.easy();
    },
    hard: () => {
        // Advanced strategy (could include minimax)
        return aiMove.easy();
    }
};

// Start Game
startButton.addEventListener("click", () => {
    mode = modeSelector.value;
    isGameActive = true;
    resetGame();
    gameBoard.classList.remove("hidden");
    resetButton.classList.remove("hidden");
});

// Cell Clicks
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (!isGameActive || gameState[index]) return;

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer === "Player" ? "🏐" : "🤖";
        checkGameState();

        if (isGameActive && mode !== "2player" && currentPlayer === "AI") {
            setTimeout(() => {
                const aiIndex = aiMove[mode]();
                cells[aiIndex].click();
            }, 500);
        }
    });
});

// Check Game State
function checkGameState() {
    let winner = null;

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            winner = gameState[a];
            break;
        }
    }

    if (winner) {
        isGameActive = false;
        if (winner === "Player") {
            winCat.classList.remove("hidden");
        } else {
            alert("AI Wins!");
        }
        return;
    }

    if (!gameState.includes(null)) {
        alert("It's a Draw!");
        isGameActive = false;
    }

    currentPlayer = currentPlayer === "Player" ? "AI" : "Player";
}

// Reset Game
resetButton.addEventListener("click", resetGame);

function resetGame() {
    gameState.fill(null);
    cells.forEach(cell => (cell.textContent = ""));
    isGameActive = true;
    winCat.classList.add("hidden");
    currentPlayer = "Player";
}
