class Chicken extends MovableObject {
  disableHit = false;
  sprites = new Sprites();
  y = 345;
  height = 88;
  width = 83;
  isSpliceable = false;
  offset = {
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
  };

  constructor() {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 1200 + Math.random() * 500; // die x koordinate ist immer 200, anschließend wird mit math.random ein zufälliger Wert bis max 500 generiert welche auf x addiert wird.
    this.speed = 0.15 + Math.random() * 0.5;
    this.loadImages(this.sprites.chicken_images_walking);
    this.loadImages(this.sprites.chicken_images_dead);
    this.animate();
  }

  /**
   * Initiates animations for a walking chicken.
   * Sets up intervals for continuous left movement and walking animation.
   * Stops the animations when the chicken is dead.
   */

  animate() {
    let intervall5 = setStoppableIntervall(() => {
      this.moveLeft();
      // Checks if the chicken is dead and clears the interval if true.
      if (this.isDead()) {
        clearInterval(intervall5);
      }
    }, 1000 / 60);
    /**
     * Initiates an animation loop using a stoppable interval for walking animation.
     */
    setStoppableIntervall(() => {
      this.playAnimation(this.sprites.chicken_images_walking);
      if (this.isDead()) {
        this.disableHit = true;
        this.playAnimation(this.sprites.chicken_images_dead);
      }
    }, 80);
  }

  /**
   * Initiates the process of killing the chicken.
   * Sets the chicken's energy to 0, plays a chicken kill audio, and marks the chicken as spliceable.
   */

  killChicken() {
    this.energy = 0;
    playAudio("chickenKill");
    this.isSpliceable = true;
  }
}
