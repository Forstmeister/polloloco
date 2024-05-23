class World {
  character = new Character();
  lastThrow = 0;
  level = level_1; // hier wird das Level mit seinen Objekten geladen // Alternativ könnte man auch enemies = level_1.enemies schreiben um z.B. Gegener einzufügen
  canvas; // wird in der game.js vorgeladen
  ctx; // ist der context
  keyboard;
  camera_x = 0;
  throwableObjects = [];
  ground = 262.5;
  BonusBar = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    // das this in der Klammer ist die Referenz für das World-Objekt
    // ohne das this kann z.B. nicht auf das Level etc. zugegriffen werden.
    this.collision = new Collision(this);
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.setBars();
    this.draw();
    this.run();
  }
  /**
   * Sets the world property of the character to the current instance of the world.
   * Assigns the current instance of the world to the 'World' property of the character.
   */

  setWorld() {
    this.character.World = this;
  }

  /**
   * Runs the game loop by setting up recurring intervals for specific game logic.
   * Uses the 'setStoppableIntervall' function to execute various game-related functions at defined intervals.
   */

  run() {
    this.bottleBarNew.setPercent(this.character.bottle);
    this.coinBarNew.setPercent(this.character.coin);
    this.healthBarNew.setPercent(this.character.energy);
    this.bossBarNew.setPercent(this.level.boss[0].energy);
    this.bonusHealthBar.setPercent(0);
    setStoppableIntervall(() => {
      this.removeItems();
      this.checkCollisions();
      this.pepeNearBoss();
      this.checkIfPepeisbehindBoss();
    }, 100);
    setStoppableIntervall(() => {
      checkScreen();
      this.checkThrownBottleYaxis();
      this.checkThrowableStuff();
      this.drawBonusBar();
    }, 200);
  }

  /**
   * Sets up bars in the game by initializing and assigning new instances of various bar objects.
   * Assigns new instances of bottle bar, coin bar, health bar, and boss bar to respective class properties.
   */

  setBars() {
    this.bottleBarNew = newBottleBar;
    this.coinBarNew = newCoinBar;
    this.healthBarNew = newHealthBar;
    this.bossBarNew = newEndbossBar;
    this.bonusHealthBar = bonusHealthBar;
  }

  /**
   * Removes items in the game based on the game state.
   * If the game is over or won, resets the character's coin and bottle collections to zero,
   * and clears the array of throwable objects.
   */
  removeItems() {
    if (GameOver || winGame) {
      this.character.coinCollection = 0;
      this.character.bottlesCollection = 0;
      this.throwableObjects = [];
    }
  }

  /**
   * Removes throwable objects from the game.
   * Iterates through the array of throwable objects and removes each object from the array.
   */

  removeThrowableObject() {
    this.throwableObjects.forEach((bottle) => {
      this.throwableObjects.splice(bottle, 1);
    });
  }

  /**
   * Checks if the time passed since the last throw is less than 1 second.
   * @returns {boolean} Returns true if the time passed is less than 1 second, otherwise false.
   */

  isThorwing() {
    let timePassed = new Date().getTime() - this.lastThrow; // Differenz in ms
    timePassed = timePassed / 1000; // differenz in Sekunden
    return timePassed < 1; // gibt true zurück wenn der Wert < 1 ist
  }

  /**
   * Checks conditions for throwing a throwable object (e.g., a bottle) in the game.
   * Checks if the 'd' key is pressed, the character has bottles in the collection, and is not currently throwing a bottle.
   * If conditions are met, creates a new throwable object, updates related properties, and adds the object to the array.
   */

  checkThrowableStuff() {
    if (
      this.keyboard.d &&
      this.character.bottlesCollection > 0 &&
      !this.isThorwing()
    ) {
      // Records the timestamp when the last throw occurred.
      this.lastThrow = new Date().getTime();
      // Creates a new throwable object at an offset from the character's position.
      let bottleThrow = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        this.character.otherDirection
      );
      // Adds the new throwable object to the array of throwable objects.
      this.throwableObjects.push(bottleThrow);
      // Updates properties related to character's bottle throwing.
      this.character.throwsBottle = true;
      this.character.bottlesCollection -= 1;
      this.character.bottle -= 20;
      // Updates the bottle bar to reflect the new bottle count.
      this.bottleBarNew.setPercent(this.character.bottle);
    }
  }

  /**
   * Checks if thrown bottles have reached the ground and handles the consequences.
   */

  checkThrownBottleYaxis() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.y > this.ground) {
        bottle.bottleHitGround = true;
        playAudio("bottlebreaking");
        setTimeout(() => {
          this.removeThrowableObject();
        }, 500);
      }
    });
  }

  /**
   * Checks various types of collisions within the game, including collisions with coins,
   * bottles, chickens, and the boss. Also, checks if the boss is hit by a bottle.
   */

  checkCollisions() {
    this.collision.coin();
    this.collision.bottle();
    this.collision.collidingWithBoss();
    this.collision.collidingWithChicken();
    this.collision.chickenHitByBottle();
    this.collision.bossHitByBottle();
    //this.collision.endbossInstantKill();
  }

  /**
   * Checks if Pepe (the character) is near or behind the boss in the level.
   * If Pepe's x-coordinate is within a specified range from the boss's x-coordinate,
   * sets the 'nearPepe' property of the boss to true.
   */

  pepeNearBoss() {
    if (this.character.x + 350 > this.level.boss[0].x) {
      // If Pepe is within the specified range, sets the 'nearPepe' property of the boss to true.
      this.level.boss[0].nearPepe = true;
    }
  }

  checkIfPepeisbehindBoss() {
    if (this.character.x > this.level.boss[0].x) {
      // If Pepe isbehind the boss, sets the 'pepeBehindBoss' property of the boss to true.
      this.level.boss[0].pepeBehindBoss = true;
    }
  }

  /**
   * Draws elements on the game canvas, including background objects, bars, characters, boss, enemies,
   * throwable objects, coins, and bottles. Utilizes the canvas context to manage translations and clearing.
   * The draw function is recursively called using requestAnimationFrame for continuous rendering.
   */

  draw() {
    // Clears the canvas and translates the context based on the camera's x-coordinate.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    // Draws background objects to the map.
    this.drawBackgroundObjectstoMap();
    // Translates the context back to the original position.
    this.ctx.translate(-this.camera_x, 0); // Reverts the translation
    // Draws bars to the map if the game is not over.
    if (GameOver === false) {
      this.drawBarsToMap();
      this.drawBonusBar();
    }
    // Translates the context forward based on the camera's x-coordinate.
    this.ctx.translate(this.camera_x, 0); // Moves forward
    // Adds the character and boss to the map.
    this.addtoMap(this.character);
    this.addObjectstoMap(this.level.boss);
    // Adds enemies and throwable objects to the map if the game is not over.
    if (GameOver === false) {
      this.addObjectstoMap(this.level.enemies);
      this.addObjectstoMap(this.throwableObjects);
    }
    // Draws coins and bottles to the map if the game is not over.
    if (GameOver === false) {
      this.drawCoinsandBottlesToMap();
    }
    // Translates the context back to the original position.
    this.ctx.translate(-this.camera_x, 0); // Reverts the translation
    // Recursively calls draw using requestAnimationFrame for continuous rendering.
    let self = this;
    requestAnimationFrame(function () {
      // In this method, 'this' is not available. Hence, the variable 'self' is used.
      self.draw();
    });
  }

  drawCoinsandBottlesToMap() {
    this.addObjectstoMap(this.level.coins);
    this.addObjectstoMap(this.level.bottles);
  }

  drawBackgroundObjectstoMap() {
    this.addObjectstoMap(this.level.backgroundObjects);
    this.addObjectstoMap(this.level.clouds);
  }

  drawBarsToMap() {
    this.addtoMap(this.bossBarNew);
    this.addtoMap(this.healthBarNew);
    this.addtoMap(this.coinBarNew);
    this.addtoMap(this.bottleBarNew);
    //this.addtoMap(this.bonusHealthBar);
  }

  drawBonusBar() {
    if (this.BonusBar) {
      this.addtoMap(this.bonusHealthBar);
    }
  }

  /**
   * Adds objects from an array to the game map.
   * Iterates through the array of objects and calls the 'addtoMap' method for each object.
   * @param {Array<Object>} objects - An array of objects to be added to the game map.
   */
  addObjectstoMap(objects) {
    /**
     * Iterates through the array of objects and calls the 'addtoMap' method for each object.
     * @param {Object} o - The current object being added to the map.
     */
    objects.forEach((o) => {
      this.addtoMap(o);
    });
  }
  /**
   * Adds individual contents to the game map.
   * If the object has 'otherDirection' property set to true, it flips the image horizontally,
   * calls the 'draw' method of the object to insert the image into the map,
   * and flips the image back if 'otherDirection' is true.
   * @param {Object} mo - The object to be added to the game map.
   */
  addtoMap(mo) {
    /**
     * If 'otherDirection' property of the object is true, flips the image horizontally.
     * @param {Object} mo - The object to be checked for 'otherDirection' property.
     */
    if (mo.otherDirection) {
      this.flipImage(mo);
      // Executes the code if 'otherDirection' is true.
    }
    // Calls the 'draw' method of the object to insert the image into the map.
    mo.draw(this.ctx);
    /**
     * If 'otherDirection' property of the object is true, flips the image back.
     * @param {Object} mo - The object to be checked for 'otherDirection' property.
     */
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
 * Flips the image horizontally for a given object on the game map.
 * Saves the current state of the canvas context, translates the canvas by the width of the object to the right,
 * scales the context horizontally by -1 to flip the image, and updates the x-coordinate of the object accordingly.
 * @param {Object} mo - The object for which the image is to be flipped horizontally.

 */

  flipImage(mo) {
    // Saves the current state of the canvas context.
    this.ctx.save();
    // Translates the canvas by the width of the object to the right.
    this.ctx.translate(mo.width, 0);
    // Scales the context horizontally by -1 to flip the image.
    this.ctx.scale(-1, 1); // hier wird das Bild gespiegelt
    // Updates the x-coordinate of the object by multiplying it by -1.
    mo.x = mo.x * -1; // Here, the x-coordinate is reversed.
  }

  /**
   * Reverts the horizontal flipping of an image for a given object on the game map.
   * Updates the x-coordinate of the object by multiplying it by -1 and restores the saved canvas context state.
   * @param {Object} mo - The object for which the horizontal flipping is to be reverted.
   */

  flipImageBack(mo) {
    /**
     * Updates the x-coordinate of the object by multiplying it by -1.
     * @param {Object} mo - The object for which the horizontal flipping is to be reverted.
     */
    // Restores the saved canvas context state to revert the horizontal flipping.
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
