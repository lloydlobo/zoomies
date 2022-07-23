import { ctx, height, BALL, width } from "../main";
import { Ball } from "../Shape/Ball";
import { getIntersection } from "../utils/getIntersection";
import { lerp } from "../utils/lerp";

export class SensorTrace {
  rayCount: number;

  raySpread: number;

  rayLength: number;

  balls: Ball;

  rays: { x: number; y: number }[][];

  readings:
    | { x: number; y: number }[]
    | ({ x: number; y: number; offset: number } | null)[];

  constructor(balls: Ball) {
    this.balls = balls;
    this.rayCount = 30;
    this.rayLength = lerp(width, height, 0.618) / balls.size / 0.5;
    this.raySpread = 2 * Math.PI;

    this.rays = [];
    this.readings = [];
  }

  update() {
    this.castRays();
    this.readings = [];
    const balls = BALL.ARR_BALLS as Ball[];
    if (balls) {
      for (let i = 0; i < this.rays.length; i += 1) {
        const reading = this.getReadings(this.rays[i], balls);
        if (!reading) return;

        this.readings.push(reading);
      }
    }
  }

  private castRays() {
    this.rays = [];
    // const flipX = this.balls.velX > 0 ? 1 : -1;
    // const flipY = this.balls.velY > 0 ? 1 : -1;
    for (let i = 0; i < this.rayCount; i += 1) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) +
        Math.sqrt(Math.pow(this.balls.velX, 2) + Math.pow(this.balls.velY, 2));

      const start = {
        x: this.balls.x - this.balls.velX,
        y: this.balls.y - this.balls.velY,
      };
      const end = {
        x: this.balls.x - Math.sin(rayAngle) * this.rayLength,
        y: this.balls.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  private getReadings(ray: { x: number; y: number }[], balls: Ball[]) {
    let arrTouches = [];
    let poly;
    for (let i = 0; i < balls.length; i += 1) {
      poly = balls[i].polygon;
      for (let j = 0; j < poly.length; j += 1) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (touch) {
          arrTouches.push(touch);
        }
      }
    }

    if (arrTouches.length === 0) {
      return null;
    } else {
      const offsets = arrTouches.map((e) => e.offset);
      const offsetMin = Math.min(...offsets);
      return arrTouches.find((e) => e.offset === offsetMin);
    }
  }

  draw() {
    for (let i = 0; i < this.rayCount; i += 1) {
      let end: { x: number; y: number } = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i] as { x: number; y: number };
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(0, 67%, 30%, 0.5)`;
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "green";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
