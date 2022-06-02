// Class Sprite with players properties
class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.width = 150;
    this.height = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 12;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrame() {
    this.framesElapsed++;

    if (this.framesElapsed === this.framesHold) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
      this.framesElapsed = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrame();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset,
    imageSrc,
    scale = 1,
    framesMax = 1,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
    });
    this.velocity = velocity;
    this.height = 170;
    this.width = 90;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 110,
      height: 25,
    };
    this.color = color;
    this.isAttacking = false;
    this.canAttack = true;
    this.health = 100;
    this.onGround = false;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 12;
  }

  update() {
    this.draw();
    this.animateFrame();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.velocity.y += gravity;
      this.onGround = false;
    }
  }

  attack() {
    this.canAttack = false;
    this.isAttacking = true;
    setTimeout(() => {
      this.canAttack = true;
    }, 600);
  }
}
