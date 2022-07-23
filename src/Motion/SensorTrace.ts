import { ctx, height, random, randomColor, width } from "../main";
import { Ball } from "../Shape/Ball";
import { lerp } from "../utils/lerp";

export class SensorTrace {
  rayCount: number;

  raySpread: number;

  rayLength: number;

  balls: Ball;

  rays: { x: number; y: number }[][];

  readings: never[];
  constructor(balls: Ball) {
    this.balls = balls;
    this.rayCount = 12 || 12;
    this.rayLength = lerp(width, height, 0.618) / balls.size / 1.5;
    this.raySpread = 2 * Math.PI;

    this.rays = [];
    this.readings = [];
  }

  update() {
    this.castRays();
  }

  private castRays() {
    this.rays = [];
    const flipX = this.balls.velX > 0 ? 1 : -1;
    const flipY = this.balls.velY > 0 ? 1 : -1;
    for (let i = 0; i < this.rayCount; i += 1) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) +
        Math.sqrt(
          Math.pow(this.balls.velX * flipX, 2) +
            Math.pow(this.balls.velY * flipY, 2)
        );

      const start = { x: this.balls.x, y: this.balls.y };
      const end = {
        x: this.balls.x - Math.sin(rayAngle) * this.rayLength,
        y: this.balls.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw() {
    for (let i = 0; i < this.rayCount; i += 1) {
      let end = this.rays[i][1];
      if (this.readings[i]) end = this.readings[i];

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(0, 67%, 30%, 0.5)`;
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
