class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  constructor(ImagePath, x) {
    super().loadImage(ImagePath);
    this.y = 480 - this.height;
    this.x = x;
  }
}
