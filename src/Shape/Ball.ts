import { ctx, height, random, randomColor, BALL, width } from "../main";
import { SensorTrace } from "../Motion/SensorTrace";
import { Shape } from "./Shape";

export class Ball extends Shape {
  acceleration: number;

  angle: number;

  color: string;

  exists: boolean;

  height: number;

  polygon: { x: number; y: number }[];

  sensor: SensorTrace;

  size: number;

  speed: number;

  width: number;

  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    size: number,
    color: string
  ) {
    super(x, y, velX, velY);

    this.size = size;
    this.polygon = [];
    this.color = color;
    this.exists = true;

    this.width = size;
    this.height = size;
    this.polygon = this.createPolygon();

    this.sensor = new SensorTrace(this);
    this.speed = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
    this.acceleration = 0.05;
    this.angle = random(0, 2 * Math.PI);
  } // end constructor()

  draw() {
    // this.sensor.draw();

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
    // ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    // for (let i = 0; i < this.polygon.length; i += 1) {
    //   ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    // }
    ctx.fill();
    ctx.stroke();
  } // draw()

  update(arenaBorders: { x: number; y: number }[][]) {
    this.move();
    // this.sensor.castRays();
    this.sensor.update(arenaBorders);
    // this.detectCollision();
    if (this.exists) {
      // this.polygon = this.createPolygon();
    }
    if (this.sensor) {
    }
  } // update()

  private move() {
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
  } // private move()

  detectCollision() {
    const balls = BALL.ARR_BALLS;
    for (const ball of balls) {
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (distance < this.size + ball.size) {
          this.color = randomColor(random(0.8, 1));
          ball.color = this.color;
        }
      }
    }
  } // detectCollision()

  // https://youtu.be/M8kq2eJRIp0?t=200//
  private createPolygon(): { x: number; y: number }[] {
    const arrPoints = [] as { x: number; y: number }[];
    const POINTS = this.getPoints();
    arrPoints.push(POINTS.topRight);
    arrPoints.push(POINTS.bottomRight);
    arrPoints.push(POINTS.bottomLeft);
    arrPoints.push(POINTS.topLeft);

    return arrPoints;
  } // private createPolygon()

  private getPoints(): {
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    topLeft: { x: number; y: number };
  } {
    // actually the `this.size`(radius) of ctx.arc
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const POINTS = {
      topRight: {
        x: this.x - Math.sin(this.angle - alpha) * radius,
        y: this.y - Math.cos(this.angle - alpha) * radius,
      },
      bottomRight: {
        x: this.x - Math.sin(this.angle + alpha) * radius,
        y: this.y - Math.cos(this.angle + alpha) * radius,
      },
      bottomLeft: {
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
      },
      topLeft: {
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
      },
    };

    return POINTS;
  } // private getPoints()
}
