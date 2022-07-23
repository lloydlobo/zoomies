import { ctx, height, random, randomColor, STATE_BALL, width } from "../main";
import { SensorTrace } from "../Motion/SensorTrace";
import { Shape } from "./Shape";

export class Ball extends Shape {
  size: any;

  color: string;

  exists: boolean;

  sensor: SensorTrace;

  angle: number;

  pointX: number;

  pointY: number;

  speed: number;

  acceleration: number;

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

    this.sensor = new SensorTrace(this);
    this.pointX = this.x;
    this.pointY = this.y;
    this.speed = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
    this.acceleration = 0.05;
    this.angle = random(0, 2 * Math.PI);
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.move();

    // this.angle -= Math.sin(this.angle);
    this.trace();
    if (this.sensor) {
      this.sensor.update();
    }
  }
  private trace() {
    this.pointX -= Math.sin(this.angle) * this.speed;
    this.pointY -= Math.cos(this.angle) * this.speed;
  }

  private move() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
      // this.speed = -this.speed;
    }
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
      // this.speed = -this.speed;
    }
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
      // this.speed = -this.speed;
    }
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
      // this.speed = -this.speed;
    }

    this.x += this.velX;
    this.y += this.velY;

    // this.angle = -this.angle;
    // this.x -= Math.sin(this.angle) * this.speed;
    // this.y -= Math.cos(this.angle) * this.speed;
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
