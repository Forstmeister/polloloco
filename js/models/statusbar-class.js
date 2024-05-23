class Statusbar extends DrawableObject {
  width = 250;
  height = 60;

  constructor(images, percent, x, y) {
    super();
    this.x = x;
    this.y = y;
    this.images = images;
    this.loadImages(images);
    this.setPercent(percent);
  }

  /**
   * Sets the percentage value for the progress bar and updates the displayed image accordingly.
   * @param {number} percent - The percentage value to set for the progress bar.
   */

  setPercent(percent) {
    this.percent = percent;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index based on the current percentage value for the progress bar.
   * @returns {number} - The resolved image index.
   */
  resolveImageIndex() {
    //Represents the resolved image index based on the percentage value.
    if (this.percent === 100) {
      return 5;
    } else if (this.percent >= 80) {
      return 4;
    } else if (this.percent >= 60) {
      return 3;
    } else if (this.percent >= 40) {
      return 2;
    } else if (this.percent >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
