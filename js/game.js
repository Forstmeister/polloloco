let canvas;
let world;
let keyboard = new Keyboard();
let IntervallIds = [];
let GameOver = false;
let winGame = false;

/**
 * Sets an interval that can be stopped later using the returned interval ID.
 * @param {function} fn - The function to be executed at each interval.
 * @param {number} time - The interval time in milliseconds.
 * @returns {number} - The ID of the interval that can be used to stop it later.
 */

function setStoppableIntervall(fn, time) {
  let id = setInterval(fn, time);
  IntervallIds.push(id);
  return id;
}

/**
 * Stops all intervals associated with the game and clears the interval IDs.
 */

function stopGame() {
  /**
   * Clears all intervals associated with the game.
   * @param {number} intervalId - The ID of the interval to be cleared.
   */
  IntervallIds.forEach(clearInterval);
  IntervallIds = [];
}

function handleResize() {
  // Breite des Bildschirms abrufen
  let screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let container = document.getElementById("turnDevice");

  if (screenWidth < 600) {
    container.classList.remove("d-none");
    container.style.opacity = "1";
  }
  if (screenWidth > 600) {
    container.classList.add("d-none");
    container.style.opacity = "0";
  }
}

function checkScreen() {
  setStoppableIntervall(() => {
    handleResize();
  }, 200);
}

/**
 * Requests the browser to enter fullscreen mode for the specified canvas.
 * @throws {Error} Throws an error if the browser does not support the Fullscreen API.
 */

function fullscreen() {
  const canvas = document.getElementById("canvas");
  canvas.requestFullscreen();
}

/**
 * Exits fullscreen mode, if the document is currently in fullscreen.
 * @throws {Error} Throws an error if the browser does not support any of the exitFullscreen methods.
 */

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

/**
 * Starts the game by initializing game elements, hiding the start screen,
 * and making the game canvas visible.
 */

function startGame() {
  let screen = document.getElementById("startscreen");
  let canvas = document.getElementById("canvas");
  init();
  playAudio("menuLoop");
  // Hides the start screen by adding a "d-none" class (assumes existence of this class in your CSS).
  screen.classList.add("d-none");
  // Makes the game canvas visible by setting its opacity to 1.
  canvas.style.opacity = 1;
}

/**
 * Handles the game win scenario by updating UI elements, stopping the game,
 * playing a win audio, and adjusting fullscreen settings.
 */

function win() {
  let overlay = document.getElementById("canvasOverlay");
  let screen = document.getElementById("startscreen");
  let button = document.getElementById("startgame");
  let canvas = document.getElementById("canvas");
  if (winGame) {
    // Updates overlay, button, and screen elements for a win.
    overlay.src = "./img/9_intro_outro_screens/start/startscreen_2.png";
    button.innerHTML = "Restart Game";
    button.classList.add("d-none");
    screen.classList.remove("d-none");
    canvas.style.opacity = 0;
    stopGame();
    playAudio("winGame");
    // Makes the button visible after a delay.
    setTimeout(() => {
      button.classList.remove("d-none");
    }, 2000);
  }
  if (document.fullscreen) {
    closeFullscreen();
  }
  // Removes fullscreen option from UI.
  removeFullscreenOption();
}

/**
 * Displays the fullscreen control option by removing the "d-none" class.
 */

function showFullscreenOption() {
  let fullScreenControl = document.getElementById("fullScreenControl");
  fullScreenControl.classList.remove("d-none");
}

/**
 * Hides the fullscreen control option by adding the "d-none" class.
 */

function removeFullscreenOption() {
  let fullScreenControl = document.getElementById("fullScreenControl");
  fullScreenControl.classList.add("d-none");
}

/**
 * Handles the game over scenario by updating UI elements, stopping the game,
 * playing a game over audio, and adjusting fullscreen settings.
 */

function gameOverScreen() {
  let canvas = document.getElementById("canvas");
  let screen = document.getElementById("startscreen");
  let overlay = document.getElementById("canvasOverlay");
  let button = document.getElementById("startgame");
  if (GameOver) {
    // Updates screen, button, and canvas elements for a game over.
    screen.classList.remove("d-none");
    button.classList.add("d-none");
    button.innerHTML = "Restart Game";
    canvas.style.opacity = 0;
    overlay.src = "./img/9_intro_outro_screens/game_over/game over.png";
    stopGame();
    playAudio("looseGame");
    // Makes the button visible after a delay.
    setTimeout(() => {
      button.classList.remove("d-none");
    }, 2000);
  }
  if (document.fullscreen) {
    closeFullscreen();
  }
  removeFullscreenOption();
}

/**
 * Initializes the game by setting up necessary elements, creating a new level,
 * handling mobile buttons, and resetting game state flags.
 */

function init() {
  let overlay = document.getElementById("canvasOverlay");
  // Creates a new level.
  newLevel();
  mobileButton();
  // Resets game state flags if the game is over or won.
  if (GameOver || winGame) {
    GameOver = false;
    winGame = false;
  }
  canvas = document.getElementById("canvas");
  // Initializes the game world with the canvas and keyboard.
  world = new World(canvas, keyboard);
  // Updates the overlay with the start screen image.
  overlay.src = "./img/9_intro_outro_screens/start/startscreen_2.png";
}

/**
 * Displays control information by adjusting the position of the info box.
 */

function showControlInfo() {
  button = document.getElementById("btncontrol");
  infobox = document.getElementById("info");
  // Adjusts the position of the info box to make it visible.
  infobox.style.transform = "translateX(0)";
}

/**
 * Hides control information by adjusting the position of the info box.
 */

function closeControlInfo() {
  infobox = document.getElementById("info");
  // Adjusts the position of the info box to hide it.
  infobox.style.transform = "translateX(500%)";
}
