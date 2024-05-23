class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0; // Fallgeschwindigkeit
  acceleration = 2.5; // Beschleunigung
  energy = 100;
  lastHit = 0;
  lastHitBoss = false;
  coin = 0;
  bottle = 0;
  collidingWithBoss = false;

  /**
   * Applies gravity to the character's vertical position and speed.
   * The character is affected by gravity only if it is above the ground or moving downward.
   */

  applyGravity() {
    setStoppableIntervall(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        // || this.speedY > 0 ist erforderlich, da der Anfngaswert negativ ist und sich bei einem Sprung erhöht
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } // hier wird von der SpeedY die BEschleunigung (acceleration) abgezogen
    }, 25);
  }

  /**
   * Initiates a jump for the character by setting its vertical speed.
   * Adjusts the character's vertical speed to achieve the desired jump height.
   */

  jump() {
    this.speedY = 30; // Sprunghöhe
  }

  /**
   * Generate a random time within a specified range.
   * @returns {number} - A random time value in milliseconds.
   */

  randomTime() {
    return Math.floor(Math.random() * 4000) + 2000;
  }

  /**
   * Checks if the character or throwable object is above the ground level.
   * For throwable objects, the condition is always true; for other objects,
   * it checks if the vertical position is above a certain threshold (180px).
   * @property {number} y - The vertical position of the character or throwable object.
   * @returns {boolean} Returns true if the object is above the ground, false otherwise.
   */

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Wenn es sich um ein Throwableobject handelt, fällt dieses tiefer als 180px
      return true;
    } else if (this instanceof Endboss) {
      // Spezielle Bedingung für den Endboss
      // Der Endboss ist über dem Boden, solange der y-Wert kleiner als oder gleich -50 ist
      return this.y <= -50;
    } else {
      // Standardbedingung für andere Objekte
      return this.y < 180;
    }
  }

  /**
   * Checks if the character or object is on or below the ground level.
   * It returns true if the vertical position is greater than 180px.
   * @property {number} y - The vertical position of the character or object.
   * @returns {boolean} Returns true if the object is on or below the ground, false otherwise.
   */

  isOnGround() {
    if (this.y > 180) {
      return true;
    }
  }

  /**
   * Handles a hit on the character, reducing its energy based on the last hit type.
   * If the character last hit a boss, it receives more damage.
   */

  hit(bossdamage) {
    if (bossdamage) {
      console.log("funzt");
      this.energy -= bossdamage;
      if (this.energy < 0) {
        this.energy = 0;
      }
    }
    if (this.lastHitBoss) {
      this.energy -= 10; // boss bekommt mehr schaden durch Flasche
      if (this.energy < 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    } else {
      this.energy -= 5;
      if (this.energy < 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    }
  }

  /**
   * Checks if the character is currently in a falling state based on its vertical speed.
   * @returns {boolean} Returns true if the character is falling (speedY < 0), false otherwise.
   */

  charcterIsFalling() {
    if (this.speedY >= 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Adds 20% coins to the character's coin count and ensures it does not exceed 100.
   * This method is typically used when the character collects coins.
   * @property {number} coin - The current count of coins for the character.
   */

  getCoin() {
    this.coin += 20;
    if (this.coin >= 100) {
      this.coin = 100;
    }
  }

  /**
   * Adds 20% bottles to the character's coin count and ensures it does not exceed 100.
   * This method is typically used when the character collects coins.
   * @property {number} bottle - The current count of coins for the character.
   */

  getBottle() {
    this.bottle += 20;
    if (this.bottle >= 100) {
      this.bottle = 100;
    }
    if (this.bottle <= 0) {
      this.bottle = 0;
    }
  }

  /**
   * Checks if the character is currently in a dead state, indicating zero energy.
   * @property {number} energy - The current energy level of the character.
   * @returns {boolean} Returns true if the character has zero energy, otherwise false.
   */

  isDead() {
    return this.energy == 0; // gibt true oder false zurück
  }

  /**
   * Checks if the character is currently in a hurt state based on the time elapsed since the last hit.
   * The character is considered hurt if the time elapsed is less than 1 second.
   * @property {number} lastHit - The timestamp of the last hit.
   * @returns {boolean} Returns true if the character is hurt, otherwise false.
   */

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Differenz in ms
    timePassed = timePassed / 1000; // differenz in Sekunden
    return timePassed < 1; // gibt true zurück wenn der Wert < 5 ist
  }

  /**
   * Checks if the current object is colliding with another object.
   * @param {Object} mo - The other object to check for collision.
   * @param {number} mo.x - The x-coordinate of the other object.
   * @param {number} mo.y - The y-coordinate of the other object.
   * @param {number} mo.width - The width of the other object.
   * @param {number} mo.height - The height of the other object.
   * @param {Object} mo.offset - The offset of the other object.
   * @param {number} mo.offset.left - The left offset of the other object.
   * @param {number} mo.offset.right - The right offset of the other object.
   * @param {number} mo.offset.top - The top offset of the other object.
   * @param {number} mo.offset.bottom - The bottom offset of the other object.
   * @returns {boolean} Returns true if there is a collision, false otherwise.
   */

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right >= mo.x + mo.offset.left &&
      this.y + this.offset.top + this.height - this.offset.bottom >=
        mo.y + mo.offset.top &&
      this.x + this.offset.left <=
        mo.x + mo.offset.left + mo.width - mo.offset.right &&
      this.y + this.offset.top <=
        mo.y + mo.offset.top + mo.height - mo.offset.bottom
    );
  }

  /**
   * Moves the character to the left by updating its horizontal position.
   * This method is used to simulate leftward movement.
   * @property {number} x - The horizontal position of the character.
   * @property {number} speed - The speed at which the character moves to the left.
   */

  moveLeft() {
    this.x -= this.speed;
    setStoppableIntervall(() => {}, 1000 / 60);
  }

  /**
   * Moves the character to the right by updating its horizontal position.
   * This method is typically used to simulate rightward movement.
   * @property {number} x - The horizontal position of the character.
   * @property {number} speed - The speed at which the character moves to the right.
   * @property {boolean} otherDirection - Flag indicating whether the character is facing the opposite direction.
   */

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Plays an animation by updating the character's image based on the provided array of image paths.
   * The method cycles through the images in the array to create an animation effect.
   * @param {string[]} images - An array of image paths representing the animation frames.
   * @property {number} currentImage - The index of the current image in the animation sequence.
   * @property {Object} imageCache - A cache of preloaded images for efficient animation.
   * @property {string} img - The current image used for the character.
   */

  playAnimation(images, stopIndex) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    if (i === stopIndex && !this.charcterIsFalling()) {
      //this.i = stopIndex;
      stopIndex = this.img;
      return;
    } else if (i !== stopIndex || this.charcterIsFalling()) {
      this.currentImage++;
    }
  }
}
