class ThrowableObject extends MovableObject {
  sprites = new Sprites();
  bottleHit = false;
  bottleHitGround = false;
  direction = false;

  offset = {
    top: 10,
    bottom: 20,
    left: 20,
    right: 20,
  };

  constructor(x, y, direction) {
    super().loadImage("./img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.sprites.rotateBottle);
    this.loadImages(this.sprites.bottleSplash);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 80;
    this.throw();
    playAudio("throwing");
  }

  /**
   * Initiates the throwing action for the throwable object.
   * Adjusts the vertical speed, applies gravity (if not hit the ground), initiates animation, and moves horizontally.
   */

  throw() {
    this.speedY = 30;
    //Checks if the throwable object hit the ground.
    if (this.bottleHitGround === false) {
      this.applyGravity();
    }
    this.animate();
    setInterval(() => {
      /**
       * Checks the direction of the throwable object.
       * @type {boolean}
       */
      if (this.direction) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Initiates animations for the throwable object.
   * Sets up intervals for continuous rotation animation and splash animation upon hitting an object or the ground.
   */

  animate() {
    setInterval(() => {
      this.playAnimation(this.sprites.rotateBottle);
      if (this.bottleHit || this.bottleHitGround) {
        // Plays the splash animation if the throwable object hit an object or the ground.
        this.playAnimation(this.sprites.bottleSplash);
      }
    }, 60);
  }
}
