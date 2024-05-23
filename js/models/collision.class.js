class Collision {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks for collisions between the character and chickens in the level.
   * If a collision is detected, it performs various actions based on the game logic.
   */

  collidingWithChicken() {
    // Überprüfen, ob das Level-Objekt und die enemies-Eigenschaft vorhanden sind
    if (this.world.level && this.world.level.enemies) {
      // Iteriert durch die Array der enemies im Level
      this.world.level.enemies.forEach((chicken, i) => {
        if (
          chicken.energy !== 0 && // Verhindert die Ausführung von isColliding-Funktion, wenn das Huhn tot ist.
          !chicken.isDead() &&
          this.world.character.isColliding(chicken)
        ) {
          // Überprüft verschiedene Bedingungen basierend auf der Spiellogik
          if (
            this.world.character.isAboveGround() &&
            this.world.character.charcterIsFalling() &&
            !chicken.isDead()
          ) {
            // Wenn der Charakter über dem Boden ist, fällt und nicht verletzt ist, wird das Huhn getötet.
            chicken.killChicken();
            if (chicken.isSpliceable) {
              // Wenn das Huhn entfernbar ist, wird es aus dem Array entfernt.
              // this.world.level.enemies.splice(i, 1);
              this.removeChickenfromMap(chicken);
            }
          } else if (chicken.disableHit === false) {
            // Wenn das Huhn nicht daran gehindert wird, getroffen zu werden, wird der Charakter getroffen.
            this.world.character.hit();
            playAudio("pepeHurt");
            if (this.world.character.energyUpdated) {
              this.world.bonusHealthBar.setPercent(this.world.character.energy);
            }
            if (!this.world.character.energyUpdated) {
              this.world.healthBarNew.setPercent(this.world.character.energy);
            }
            this.manageExtraLife();
          }
        }
      });
    }
  }

  manageExtraLife() {
    /**
     * Checks if the character has an available extra life and is at maximum energy.
     * @returns {boolean} - Returns true if the conditions for applying an extra life are met; otherwise, false.
     */
    if (
      this.world.character.extraLife > 0 &&
      this.world.character.energy === 10
    ) {
      if (!this.world.character.energyUpdated) {
        // Set character energy to 100 and update the bonus health bar.
        this.world.character.energy = 100;
        this.world.bonusHealthBar.setPercent(this.world.character.energy);
      }
      // Mark that the character's energy has been updated.
      this.world.character.energyUpdated = true;
    }
  }

  /**
   * if the boss was hitted by a bottle then boss is getting damage, a audio file is played
   * and the bottle will be removed.
   */

  bossHitByBottle() {
    for (let i = 0; i < this.world.throwableObjects.length; i++) {
      const bottle = this.world.throwableObjects[i];
      if (bottle.isColliding(this.world.level.boss[0])) {
        playAudio("bossHurt");
        playAudio("bottlebreaking");
        bottle.bottleHit = true;
        this.world.level.boss[0].bottleHit = true;
        setTimeout(() => {
          this.world.removeThrowableObject();
        }, 150);
        this.world.level.boss[0].lastHitBoss = true;
        this.world.level.boss[0].hit();
        this.world.bossBarNew.setPercent(this.world.level.boss[0].energy);
      }
    }
  }

  /**
   * Handles the logic when a chicken is hit by a throwable object (e.g., a bottle).
   * Checks for collisions between each throwable object and the chickens in the level.
   * If a collision is detected, it reduces the chicken's energy to zero and removes it from the level.
   * Also removes the throwable object upon collision with a chicken.
   */

  chickenHitByBottle() {
    this.world.throwableObjects.forEach((bottle) => {
      this.world.level.enemies.forEach((chicken, i) => {
        if (bottle.isColliding(chicken)) {
          bottle.bottleHit = true;
          playAudio("bottlebreaking");
          chicken.energy = 0;
        }
        if (chicken.energy === 0) {
          this.world.removeThrowableObject();
          //this.world.level.enemies.splice(i, 1);
          this.removeChickenfromMap(chicken);
        }
      });
    });
  }

  /**
   * Checks for collisions between the character and the boss in the level.
   * If a collision is detected, the character is hit, audio is played, and the health bar is updated.
   */

  collidingWithBoss() {
    if (this.world.character.isColliding(this.world.level.boss[0])) {
      // If collision is detected, the character is hit, audio is played, and the health bar is updated.
      this.world.character.hit(10);
      playAudio("pepeHurt");
      if (this.world.character.energyUpdated) {
        this.world.bonusHealthBar.setPercent(this.world.character.energy);
      }
      if (!this.world.character.energyUpdated) {
        this.world.healthBarNew.setPercent(this.world.character.energy);
      }
      this.manageExtraLife();
    }
  }

  /**
   * Kills the character instant if the character is under the endboss, and the ednboss is above ground
   */

  /**
   *   endbossInstantKill() {
    if (this.world.level.boss[0].isColliding(this.world.character)) {
      if (
        this.world.level.boss[0].isAboveGround() &&
        this.world.level.boss[0].charcterIsFalling() &&
        !this.world.level.boss[0].isHurt() &&
        !this.world.level.boss[0].isDead()
      ) {
        this.world.character.hit();
        this.world.character.energy = 0;
      }
    }
  }
   */

  /**
 * Removes a chicken from the map after a delay.
 *
 * @param {Object} chicken - The chicken object to be removed.
 * @throws {Error} Throws an error if the provided chicken is not found in the enemies array.

 */

  removeChickenfromMap(chicken) {
    /**
     * Reference to the enemies array in the world level.
     * @type {Array<Object>}
     */
    let enemy = this.world.level.enemies;
    /**
     * Asynchronously removes the chicken from the enemies array after a delay.
     */
    setTimeout(() => {
      enemy.splice(enemy.indexOf(chicken), 1);
    }, 1000);
  }

  /**
   * Handles the logic when the character collects coins.
   * Checks for collisions between the character and coins in the level.
   * If a collision is detected, the character collects the coin, plays audio, updates the coin bar,
   * and removes the coin from the level.
   */

  coin() {
    /**
     * Iterates through the array of coins in the level to check for collisions with the character.
     * @param {Coin} coin - The current coin being checked for collision.
     * @param {number} index - The index of the current coin in the coins array.
     */
    this.world.level.coins.forEach((coin, index) => {
      if (this.world.character.isColliding(coin)) {
        // If collision is detected, the character collects the coin, plays audio, and updates the coin bar.
        this.world.character.getCoin();
        if (this.world.character.coinCollection <= 4) {
          playAudio("getItem");
          this.world.coinBarNew.setPercent(this.world.character.coin);
          // Updates the character's coin collection count and removes the coin from the level.
          this.world.character.coinCollection += 1;
          this.world.level.coins.splice(index, 1);
        }
        if (this.world.character.coinCollection === 5) {
          this.world.character.extraLife = 1;
          this.world.character.coinCollection = 0;
          this.world.character.coin = 0;
          this.world.coinBarNew.setPercent(this.world.character.coin);
        }
      }
    });
  }

  /**
   * Handles the logic when the character collects bottles.
   * Checks for collisions between the character and bottles in the level.
   * If a collision is detected, the character collects the bottle, updates the bottle bar,
   * plays audio, and removes the bottle from the level.
   */
  bottle() {
    /**
     * Iterates through the array of bottles in the level to check for collisions with the character.
     * @param {Bottle} bottle - The current bottle being checked for collision.
     * @param {number} index - The index of the current bottle in the bottles array.
     */
    this.world.level.bottles.forEach((bottle, index) => {
      // bei foreach ist der zweite parameter der index
      if (this.world.character.isColliding(bottle)) {
        // If collision is detected, the character collects the bottle, updates the bottle bar,
        // plays audio, and removes the bottle from the level.
        this.world.character.getBottle();
        this.world.bottleBarNew.setPercent(this.world.character.bottle);
        if (this.world.character.bottlesCollection <= 4) {
          this.world.character.bottlesCollection += 1;
          playAudio("getItem");
          this.world.level.bottles.splice(index, 1);
        }
      }
    });
  }
}
