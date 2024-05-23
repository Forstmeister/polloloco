class Keyboard {
  left = false;
  right = false;
  up = false;
  down = false;
  space = false;
  d = false;
}

/**
 * Event listener for handling keydown events on the window.
 * Updates the state of the 'keyboard' object based on the pressed keys.
 * @param {KeyboardEvent} event - The keyboard event object containing information about the key press.
 */

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39) {
    keyboard.right = true;
  }
  if (event.keyCode == 37) {
    keyboard.left = true;
  }
  if (event.keyCode == 38) {
    keyboard.up = true;
  }
  if (event.keyCode == 40) {
    keyboard.down = true;
  }
  if (event.keyCode == 32) {
    keyboard.space = true;
  }
  if (event.keyCode == 68) {
    keyboard.d = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39) {
    keyboard.right = false;
  }
  if (event.keyCode == 37) {
    keyboard.left = false;
  }
  if (event.keyCode == 38) {
    keyboard.up = false;
  }
  if (event.keyCode == 40) {
    keyboard.down = false;
  }
  if (event.keyCode == 32) {
    keyboard.space = false;
  }
  if (event.keyCode == 68) {
    keyboard.d = false;
  }
});

/**
 * Configures touch event listeners for mobile buttons to simulate keyboard input.
 * Listens for touchstart and touchend events on specific buttons to update the state of the 'keyboard' object.
 */
function mobileButton() {
  document.getElementById("btnLeft").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.left = true;
  });

  document.getElementById("btnLeft").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.left = false;
  });

  document.getElementById("btnRight").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.right = true;
  });

  document.getElementById("btnRight").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.right = false;
  });

  document.getElementById("btnJump").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.space = true;
  });

  document.getElementById("btnJump").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.space = false;
  });

  document.getElementById("btnThrow").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.d = true;
  });

  document.getElementById("btnThrow").addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.d = false;
  });
}
