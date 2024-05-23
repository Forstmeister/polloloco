class Bottles extends MovableObject {
  sprites = new Sprites();
  height = 60;
  y = 355;

  offset = {
    top: 10,
    bottom: 10,
    left: 30,
    right: 40,
  };

  constructor() {
    super().loadImage("./img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.sprites.images_bottles);
    this.animate();
    this.x = 100 + Math.random() * 1000;
  }
  /**
   * Initiates an animation loop using a stoppable interval.
   * Calls the 'playAnimation' method with the sprites for bottle images at a specified interval.
   */
  animate() {
    //Initiates an animation loop using a stoppable interval.
    setStoppableIntervall(() => {
      this.playAnimation(this.sprites.images_bottles);
    }, 200);
  }
}
