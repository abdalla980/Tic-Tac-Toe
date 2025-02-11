const cells = Array.from(document.querySelectorAll(".cell"));
const playerTurnElement = document.querySelector(".player-turn")!;
const restartButton = document.querySelector(".restartButton")!;

let currentPlayer: "X" | "O" = "X";
let gameBoard: (string | null)[] = Array(9).fill(null);

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkwinner(): "X" | "O" | null {
    for (const [a, b, c] of winningCombinations) {
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a] as "X" | "O";
        }
    }
    return null;
}


function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem("ticTacToeState") || '{}');
    if (savedState.board) {
        gameBoard = savedState.board;
        currentPlayer = savedState.currentPlayer;
    }
    updateBoard();
}


function saveGameState() {
    const gameState = {
        board: gameBoard,
        currentPlayer: currentPlayer
    };
    localStorage.setItem("ticTacToeState", JSON.stringify(gameState));
}


function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index] || '';
    });
    playerTurnElement.textContent = `Player ${currentPlayer}'s Turn`;
    saveGameState();
}

cells.forEach((cell, index) => {
    cell.addEventListener("mouseover", () => {
        if (!gameBoard[index]) {
            cell.textContent = currentPlayer;
        }
    });

    cell.addEventListener("mouseout", () => {
        if (!gameBoard[index]) {
            cell.textContent = '';
        }
    });


    cell.addEventListener("click", () => {
        if (gameBoard[index] || checkwinner()) return;

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;

        const winner = checkwinner();
        if (winner) {
            setTimeout(() => {
                alert(`${winner} wins!`);
                disableCells();
            }, 90);
        } else if (gameBoard.every(cell => cell !== null)) {
            setTimeout(() => {
                alert("It's a draw!");
                disableCells();
            }, 99);
        } else {

            currentPlayer = currentPlayer === "X" ? "O" : "X";
            playerTurnElement.textContent = `Player ${currentPlayer}'s Turn`;
        }

        saveGameState();
    });
});


function disableCells() {
    cells.forEach(cell => {
        cell.setAttribute("disabled", "");
    });
}

restartButton.addEventListener("click", () => {
    gameBoard.fill(null);
    currentPlayer = "X";
    playerTurnElement.textContent = `Player X's Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.removeAttribute("disabled");

    });
    saveGameState();
});

window.addEventListener("load", () => {
    loadGameState();
});
