class Coins extends MovableObject {
  sprites = new Sprites();
  offset = {
    top: 50,
    bottom: 120,
    left: 30,
    right: 60,
  };

  constructor() {
    super().loadImage("./img/8_coin/coin_1.png");
    this.loadImages(this.sprites.images_coins);
    this.animate();
    this.x = 100 + Math.random() * 1500;
    this.y = 100 + Math.random() * 150;
  }

  animate() {
    setStoppableIntervall(() => {
      this.playAnimation(this.sprites.images_coins);
    }, 200);
  }
}
