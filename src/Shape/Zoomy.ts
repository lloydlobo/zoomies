import { ctx, height, STATE_BALL, width } from "../main";
import { Controls } from "../Motion/Controls";
import { Sensor } from "../Motion/Sensor";
import { Shape } from "./Shape";

export class Zoomy extends Shape {
  color: any;

  size: any;

  lineWidth: number;

  damaged: boolean;

  speed: number;

  acceleration: number;

  maxSpeed: number;

  friction: number;

  angle: number;

  controls: Controls;

  sensor: Sensor;

  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    maxSpeed: number,
    color: string,
    size: number
  ) {
    super(x, y, velX, velY);
    this.x = x;
    this.y = y;
    this.color = color || "white";
    this.size = size || 20;
    this.lineWidth = 2;
    this.damaged = false;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;

    this.sensor = new Sensor(this);
    this.controls = new Controls("KEYS");
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  update() {
    if (!this.damaged) {
      this.move();
    }
    if (this.sensor) {
      this.sensor.update();
    }
  }

  updateBounds() {
    if (this.x + this.size >= width) this.x = width - this.size;
    if (this.x - this.size <= 0) this.x = this.size;
    if (this.y + this.size >= height) this.y = height - this.size;
    if (this.y - this.size <= 0) this.y = this.size;
  }

  detectCollision() {
    const balls = STATE_BALL.ARR_BALLS;
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance < this.size + ball.size) ball.exists = false;
      }
    }
  }

  move() {
    this.accelerateUpDown();
    this.limitSpeed();
    this.addFriction();
    this.slowDownStop();
    this.turnLeftRight();

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private accelerateUpDown() {
    if (this.controls.up) this.speed += this.acceleration;
    if (this.controls.down) this.speed -= this.acceleration;
  }

  private limitSpeed() {
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
  }

  private addFriction() {
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
  }

  private slowDownStop() {
    if (Math.abs(this.speed) < this.friction) this.speed = 0;
  }

  private turnLeftRight() {
    const flipDirection = this.speed > 0 ? 1 : -1;
    if (this.speed !== 0) {
      if (this.controls.left) this.angle += 0.03 * flipDirection;
      if (this.controls.right) this.angle -= 0.03 * flipDirection;
    }
  }
}
