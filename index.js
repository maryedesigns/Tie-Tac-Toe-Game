//From base code
const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X"; //human player
const PLAYER_O = "O"; //ai player
let turn = PLAYER_X;
let boardState = Array(tiles.length).fill(null);
let currentPlayer = PLAYER_X;

//enhacement added
let gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
let gameActive = true;
let timer;
let timeLeft = 15;
let gameOver = false;

const timerDisplay = document.getElementById("timer-display");
const playAgain = document.getElementById("play-again");
const aiLevelSelect = document.getElementById("aiLevel");
const human = document.getElementById("human");
const time = document.getElementById("time");

//enhacement added, added event listener to load the DOM Content
document.addEventListener("DOMContentLoaded", () => {
  const letPlayButton = document.getElementById("letPlay");
  const recordsDiv = document.getElementById("records");
  const boardContainer = document.getElementById("board-container");
  const resetScore = document.getElementById("resetButton");
  const restartButtons = document.querySelectorAll(".game--restart");
  const start = document.querySelectorAll(".start");
  const scores = document.getElementById("scoreBoard");

  //enhacement added, Add event listener to "Let's Play" button to display some session when the let's play button is clicked
  letPlayButton.addEventListener("click", () => {
    if (aiLevelSelect.value === 'easy' || aiLevelSelect.value === 'medium') {
      // Hide the records section
      recordsDiv.style.display = "none";

      // Show the board container
      boardContainer.style.display = "block";
      scores.style.display = "grid";
      resetScore.style.display = "inline-block"

      // Show the restart and back to home buttons
      restartButtons.forEach(button => button.style.display = "inline-block");
      start.forEach(button => button.style.display = "inline-block");

    } else if (human.value === 'x' || human.value === 'o') {
      //display and start the timer for human to human players
      startTimer();
      // Hide the records section
      recordsDiv.style.display = "none";

      // Show the board container
      boardContainer.style.display = "block";
      scores.style.display = "grid";
      resetScore.style.display = "inline-block"

      // Show the restart and back to home buttons
      restartButtons.forEach(button => button.style.display = "inline-block");
      start.forEach(button => button.style.display = "inline-block");

      //show the timer
      timerDisplay.style.display = "inline-block";
      time.style.display = "inline-block";
    }
    else {
      // If no valid selection, show alert and keep the button disabled
      alert("Please select either AI level or a Player to start the game.");
    }

  });
});

//enhacement added
function stopTimer() {
  clearInterval(timer); // Stop the timer
}

//enhacement added
function startTimer() {
  timeLeft = 15;
  timerDisplay.innerText = timeLeft; // Initialize timer display

  timer = setInterval(() => {
    timeLeft--; // Decrease time left by 1 second
    timerDisplay.innerText = timeLeft; // Update the display
    // Check if time has run out
    if (timeLeft <= 0) {
      clearInterval(timer);
      stopTimer(); // Stop the timer
      askQuestionForPlayer(); //display the question session after time runs out
    }
  }, 1000); //Update every second
}

//Elements from base code
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");

playAgain.addEventListener("click", startNewGame);

//Sounds element from base code
const gameOverSound = new Audio("sounds/sounds_game_over.wav");
const clickSound = new Audio("sounds/sounds_click.wav");
const clapSound = new Audio("sounds/clap_sound.mp3"); //enhacement added, clap sound added for wins

// enhancement added, event listener added to the DOM to load dropdown changes
document.addEventListener("DOMContentLoaded", () => {
  const aiLevel = document.getElementById("aiLevel");
  const human = document.getElementById("human");

  //Attach listeners for dropdown changes
  aiLevel.addEventListener("change", () => setupGameMode("ai"));
  human.addEventListener("change", () => setupGameMode("human"));

  //initialize game setup (default to AI or Human)
  setupGameMode("ai");
});

//enhacement added, ai/players selection configuration
function setupGameMode(mode) {
  const updatedTiles = document.querySelectorAll(".tile");

  //Selection for ai levels
  if (mode === "ai") {
    const aiLevel = document.getElementById("aiLevel").value;
    if (aiLevel === "easy" || aiLevel === "medium") {
      updatedTiles.forEach((tile) => tile.addEventListener("click", tileClick));
    }
  } 
  //selection for human players
  else if (mode === "human") {
    const selectedPlayer = document.getElementById("human").value;
    if (selectedPlayer === "x" || selectedPlayer === "o") {
      updatedTiles.forEach((tile) => tile.addEventListener("click", tileClickPlayer));
    }
  }
}

//setting hover text for each tile from base code
function setHoverText() {
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

//setting the tile bgcolor enhacement added
function setTextColor() {
  tiles.forEach((tile) => {
    tile.classList.remove("x-text");
    tile.classList.remove("o-text");
  });

  const textColor = `${turn.toLowerCase()}-text`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(textColor);
    }
  });
}

setTextColor();

//tile click event handler from base code for ai mode selection
function tileClick(event) {
  if (gameOverArea.classList.contains("visible") || !gameActive) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }
  makeMove(tileNumber - 1, PLAYER_X);

  //enhacement added for AI move 
  if (gameActive && currentPlayer === PLAYER_X) {
    setTimeout(aiMove, 500);
  }

  clickSound.play();
  setTextColor();
  setHoverText();
}

//enhancement added, tile click player event handler for human - human mode selection
function tileClickPlayer(event) {
  if (gameOverArea.classList.contains("visible") || !gameActive) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;

  if (tile.innerText != "") {
    return;
  }
  
  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
  }

  else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
  }

  clickSound.play();
  setTextColor();
  setHoverText();
  checkWinner();
}

//Checking for a winner from base code
//added enhacement for one more tile check since the board is now expanded to 4 by 4
function checkWinner() {
  for (const winningCombination of winningCombinations) {
    //Object Destructuring- extracting the combo object 
    const { combo } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];
    const tileValue4 = boardState[combo[3] - 1]; //added this line of code

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3 &&
      tileValue1 === tileValue4 //added this line of code
    ) {

      //enhacement added, bgcolor to indicate winning cells
      document.querySelector(`[data-index="${combo[0]}"]`).classList.add('winner-square');
      document.querySelector(`[data-index="${combo[1]}"]`).classList.add('winner-square');
      document.querySelector(`[data-index="${combo[2]}"]`).classList.add('winner-square');
      document.querySelector(`[data-index="${combo[3]}"]`).classList.add('winner-square');

      //ehancement added, to clear the question section and stopping the timer when the game is over 
      document.getElementById("questionContainer").innerHTML = "";
      stopTimer();

      gameOverScreen(tileValue1);

      if (tileValue1 === PLAYER_X) {
        updateGameState('x-wins'); //enhcement added to update wins scores for player x
        clapSound.play(); //enhancement added to play the clap sound when x wins
      }
      else if (tileValue1 === PLAYER_O) {
        updateGameState('o-wins'); //enhcement added to update wins scores for player o
        clapSound.play(); //enhancement added to play the clap sound when o wins
      }
      gameOver = true;
      return;
    }
  }

  //Checking for a draw from base code
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);

    if (allTileFilledIn) {
      updateGameState('x-draws'); //enhcement added to update draws scores for player x
      updateGameState('o-draws'); //enhcement added to update draws scores for player o
    }
    gameOverSound.play(); //from base code play the game over sound when there is a draw
    gameOver = true;
  }
}

//gameover function section from base code
function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
    clapSound.play();
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;

  //ehancement added to clear the question section, stop the timer 
  // and hide the restart button when the game is over 
  document.getElementById("questionContainer").innerHTML = ""; // Clear question
  document.querySelector('.game--restart').style.display = 'none'; //hide restart button
  stopTimer(); //stop the timer
}

//play again function from base code
function startNewGame() {
  clapSound.pause();
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach(tile => {
    tile.classList.remove('winner-square'); //enhacement added to remove bgcolor from the winning tile when a new game begins
    tile.innerText = ""
  });
  turn = PLAYER_X;
  setTextColor();
  setHoverText();
  setBoardActive(); //enhacement addd to Make sure the board is active when the game starts

  //enhacement added making the restart button visible when a new game starts
  //stop the timer to avoid timer misfunctioning in terms of counting
  //start the timer afresh -- the timer will only display for human to human mode selection
  document.querySelector('.game--restart').style.display = 'block';

  if (human.value === 'x' || human.value === 'o'){
    stopTimer();
    startTimer();
  }
  setupGameMode("ai");
  gameOver = false;
}

//enhacement added, 4 by 4 winning combinations
const winningCombinations = [
  //squares
  { combo: [1, 2, 5, 6] },
  { combo: [2, 3, 6, 7] },
  { combo: [3, 4, 7, 8] },
  { combo: [5, 6, 9, 10] },
  { combo: [6, 7, 10, 11] },
  { combo: [7, 8, 11, 12] },
  { combo: [9, 10, 13, 14] },
  { combo: [10, 11, 14, 15] },
  { combo: [11, 12, 15, 16] },

  //vertical
  { combo: [1, 5, 9, 13] },
  { combo: [4, 8, 12, 16] },

  //horizontal
  { combo: [1, 2, 3, 4] },
  { combo: [13, 14, 15, 16] },

  //diagonals
  { combo: [1, 6, 11, 16] },
  { combo: [4, 7, 10, 13] },
];

//ehnacement added, gotten from class base code
function handleRestartGame() {
  // Show the confirmation modal
  document.getElementById("confirmationModal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Handle "Yes" button click to restart the game
document.getElementById("yesButton").addEventListener("click", function() {
  alert("You are about to restart the game");
  gameActive = true;
  currentPlayer = PLAYER_X;
  gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
  document.querySelectorAll('.tile').forEach(cell => cell.innerHTML = "");

  startNewGame();

  // Clear the question section when the game restarts
  document.getElementById("questionContainer").innerHTML = "";
  setTextColor();
  setHoverText();

  // Hide the modal and overlay
  document.getElementById("confirmationModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

// Handle "No" button click to cancel the restart
document.getElementById("noButton").addEventListener("click", function() {
  // Hide the modal and overlay without restarting the game
  document.getElementById("confirmationModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});


//ehancement added, for storing game state scores
function updateGameState(result) {
  let xwins = parseInt(localStorage.getItem('x-wins')) || 0;
  let owins = parseInt(localStorage.getItem('o-wins')) || 0;
  let xdraws = parseInt(localStorage.getItem('x-draws')) || 0;
  let odraws = parseInt(localStorage.getItem('o-draws')) || 0;

  if (result === 'x-wins') {
    xwins += 1;
    localStorage.setItem('x-wins', xwins);
  }
  else if (result === 'o-wins') {
    owins += 1;
    localStorage.setItem('o-wins', owins);
  }
  else if (result === 'x-draws') {
    xdraws += 1;
    localStorage.setItem('x-draws', xdraws);
  }
  else if (result === 'o-draws') {
    odraws += 1;
    localStorage.setItem('o-draws', odraws);
  }
  displayGameState();
}

//enhacement added, to displaying the game state scores
function displayGameState() {
  const xwins = localStorage.getItem('x-wins');
  const owins = localStorage.getItem('o-wins');
  const xdraws = localStorage.getItem('x-draws');
  const odraws = localStorage.getItem('o-draws');

  document.getElementById('x-wins').textContent = `${xwins}`;
  document.getElementById('o-wins').textContent = `${owins}`;
  document.getElementById('x-draws').textContent = `${xdraws}`;
  document.getElementById('o-draws').textContent = `${odraws}`;

}

//enhancement added to reset the game state scores back to 0
function resetGameState() {
  localStorage.setItem('x-wins', 0);
  localStorage.setItem('o-wins', 0);
  localStorage.setItem('x-draws', 0);
  localStorage.setItem('o-draws', 0);

  displayGameState();
  gameOver = false;
}

//enhacement added, an event listener to the reset score button
document.getElementById('resetButton').addEventListener('click', resetGameState);

//enhancement added, an event listener to retrieve and display the current game state score
document.addEventListener('DOMContentLoaded', function () {
  displayGameState();
});

//enhacement added, an event listener to the restart game button
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

// enahcement added to Redirect players to the home page
document.getElementById('home').addEventListener('click', function () {
  window.location.href = './index.html';
});

//enahcement added for the AI move
function aiMove() {
  const availableTiles = boardState.map((val, index) => val === null ? index : null).filter(v => v !== null);
  let aiMoveIndex;

  if (aiLevelSelect.value === "easy") {
    aiMoveIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  } else if (aiLevelSelect.value === "medium") {
    const winningMove = findWinningMove(PLAYER_O);
    const blockingMove = findWinningMove(PLAYER_X);
    if (winningMove !== -1) {
      aiMoveIndex = winningMove;  // Use the winning move if available
    } else if (blockingMove !== -1) {
      aiMoveIndex = blockingMove;  // Use the blocking move if no winning move
    } else {
      aiMoveIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];  // Random move if no winning or blocking moves
    }
  }
  if (aiMoveIndex !== undefined && aiMoveIndex !== null && boardState[aiMoveIndex] === null) {
    console.log(`AI move selected:" Index ${aiMoveIndex}`);
    makeMove(aiMoveIndex, PLAYER_O);
  }
}

//enhancement added, to determine selected player
function humanMove() {
  if (human.value === "x") {
    turn = PLAYER_X;
  } else if (human.value === "o") {
    turn = PLAYER_O;
  }
  setTextColor();
  setHoverText();
}
human.addEventListener("change", humanMove);

//enhacement added, to find the winning move for medium level
function findWinningMove(player) {
  for (const { combo } of winningCombinations) {
    //object destruction to extract the combo property from the array
    const tileValues = combo.map(index => boardState[index - 1]);

    const playerCount = tileValues.filter(val => val === player).length;
    const emptyCount = tileValues.filter(val => val === null).length;

    if (playerCount === 3 && emptyCount === 1) {
      const moveIndex = combo[tileValues.indexOf(null)] - 1; //Adjust for 0-based index
      return moveIndex;
    }
  }
  return -1;
}

//enhacement added, for making move
function makeMove(tileNumber, player) {
  if (gameOver || boardState[tileNumber] !== null) {
    return;
  }
  boardState[tileNumber] = player;
  const tile = tiles[tileNumber];
  tile.innerText = player;
  setTextColor();
  setHoverText();
  checkWinner();
}

//Question session for human - human player game
//enhacement added, an array that stores the questions to be displayed after time count down to 0
const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars"
  },
  {
    question: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    answer: "4"
  },
  {
    question: "Who was the Queen of England",
    choices: ["Paul", "Elizabeth", "Mary", "Peter"],
    answer: "Elizabeth"
  },
];

//enhacement added, to display questions at random
function askQuestionForPlayer() {
  // Disable board while the question is asked
  setBoardInactive();

  // getting questions at random
  const randomIndex = Math.floor(Math.random() * questions.length);
  const currentQuestion = questions[randomIndex];

  let playerQuestion = `This question is for '${turn}' player`;
  // Display question to the player
  let questionHTML = `<p style="text-align: center; font-size:20px; background-color: #f1f1f1; border: 1px solid #ddd; border-radius: 8px; color: red; padding:5px;">${playerQuestion}</p>`;
  questionHTML += `<p style="text-align: center; font-size:20px;">${currentQuestion.question}</p>`;
  currentQuestion.choices.forEach((choice) => {
    questionHTML += `<button onclick="checkAnswer('${choice}', '${currentQuestion.answer}')" style="padding: 10px 20px; justify-content:center; font-size: 16px;">${choice}</button>`;
  });

  //display the questions
  document.getElementById("questionContainer").innerHTML = questionHTML;
}

//enhacement added, to check for correct answer in the question session
function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    alert("Correct answer! Continue Playing...");
    document.getElementById("questionContainer").innerHTML = ""; // Clear question session
    setBoardActive(); // activing the board state when a question is answered correctly
    startTimer();//start the timer 
  } 

  //when a question is answered incorrectly, switch turns
  else {
    switchPlayer();
    alert(`Incorrect answer! Missed your turn, It's '${turn}' player turn`);
    document.getElementById("questionContainer").innerHTML = ""; // Clear question session
    setBoardActive(); // activing the board state when a question is answered incorrectly for the next player
    stopTimer();
    startTimer();
  }
  setHoverText();
  setTextColor();
}

//enacement added to disable the game board when the question session is up
function setBoardInactive() {
  tiles.forEach(tile => {
    tile.style.pointerEvents = 'none'; // Disable clicking on tiles
    tile.classList.add("inactive"); //adding the class to the tile element
  });
}

//enhacement added to enable the game board
function setBoardActive() {
  tiles.forEach(tile => {
    tile.style.pointerEvents = 'auto'; // Enable clicking on tiles
    tile.classList.remove("inactive"); // Remove the class from the tile element
  });
}

//enhancement added, to swtich player turns
function switchPlayer() {
  turn = turn === PLAYER_X ? PLAYER_O : PLAYER_X;
  setHoverText();
  setTextColor();
}