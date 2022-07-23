import { ctx, height, random, randomColor, STATE_BALL, width } from "../main";
import { Shape } from "./Shape";

export class Ball extends Shape {
  size: any;

  color: string;

  exists: boolean;

  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    size: any,
    color: string
  ) {
    super(x, y, velX, velY);
    this.size = size;
    this.color = color;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  detectCollision() {
    const balls = STATE_BALL.ARR_BALLS;
    for (const ball of balls) {
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance < this.size + ball.size) {
          this.color = randomColor(random(0.4, 1));
          ball.color = this.color;
        }
      }
    }
  }
}
