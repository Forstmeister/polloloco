class Endboss extends MovableObject {
  sprites = new Sprites();
  height = 500;
  width = 350;
  y = -50;
  nearPepe = false;
  bottleHit = false;
  pepeBehindBoss = false;
  levelEnd = 2175;
  levelStart = 0;
  attackAnimation = false;
  offset = {
    top: 80,
    bottom: 80,
    left: 40,
    right: 50,
  };

  constructor() {
    super().loadImage("./img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.sprites.boss_images_walking);
    this.loadImages(this.sprites.boss_images_alert);
    this.loadImages(this.sprites.boss_images_attack);
    this.loadImages(this.sprites.boss_images_hurt);
    this.loadImages(this.sprites.boss_images_dead);
    this.animate();
    this.applyGravity();
    this.pepeBehind();
    this.checkIfDead();
    this.speed = 9.15 + Math.random() * 3.5; // schrittgeschwindigkeit vom boss
    this.x = 2000;
  }

  attackReverse() {
    this.moveRight();
    if (this.pepeBehindBoss) {
      this.otherDirection = true;
    }
  }

  attack() {
    this.moveLeft();
    setTimeout(() => {
      if (!this.isAboveGround() && this.bottleHit) {
        this.attackAnimation = true;
        this.jump();
        this.speed = 30.5 + Math.random() * 3.5;
      }
    }, this.randomTime());
  }
  /**
   * Initiates the removal process for the end boss.
   * Adjusts the vertical speed, applies gravity, and gradually moves the end boss downward and forward.
   */
  removeEndboss() {
    this.speedY = 5;
    this.applyGravity();
    setStoppableIntervall(() => {
      this.y += 10;
      this.x += 5;
    }, 25);
  }
  /**
   * Checks if the end boss is dead.
   * Initiates an interval to continuously check the end boss's death state and triggers victory actions.
   */
  checkIfDead() {
    let Intervall8 = setStoppableIntervall(() => {
      if (this.isDead && this.energy === 0) {
        winGame = true;
        playAudio("bossDead");
        setTimeout(() => {
          win();
        }, 1000);
        clearInterval(Intervall8);
      }
    }, 25);
  }

  pepeBehind() {
    setStoppableIntervall(() => {
      this.otherDirection = false;
      if (this.pepeBehindBoss) {
        this.attackReverse();
      }
    }, 25);
  }

  checkLevelPosition() {
    if (this.x === this.levelEnd) {
      this.attack();
    }
    if (this.x === this.levelStart) {
      this.attackReverse();
    }
  }
  /**
   * Initiates animations for the end boss.
   * Sets up a stoppable interval for continuous animation, checking for death, hurt, walking, and attacking states.
   */
  animate() {
    let intervall3 = setStoppableIntervall(() => {
      this.playAnimation(this.sprites.boss_images_alert);
      if (this.isDead()) {
        clearInterval(intervall3);
        this.removeEndboss();
        this.playAnimation(this.sprites.boss_images_dead);
      } else if (this.isHurt()) {
        this.playAnimation(this.sprites.boss_images_hurt);
      } else if (this.nearPepe || this.bottleHit) {
        this.playAnimation(this.sprites.boss_images_walking);
        this.attack();
        if (this.attackAnimation) {
          this.playAnimation(this.sprites.boss_images_attack);
        }
        this.pepeBehindBoss = false;
      }
      this.checkLevelPosition();
    }, 200);
  }
}
