import { ctx, height, width } from "../main";
import { Zoomy } from "../Shape/Zoomy";
import { lerp } from "../utils/lerp";

export class Sensor {
  rayCount: number;

  raySpread: number;

  rayLength: number;

  zoomies: Zoomy;

  rays: { x: number; y: number }[][];

  readings: never[];
  constructor(zoomies: Zoomy) {
    this.zoomies = zoomies;
    this.rayCount = 5;
    this.rayLength = (lerp(width, height, 0.618) / zoomies.size) * 1.618;
    this.raySpread = Math.PI;

    this.rays = [];
    this.readings = [];
  }

  update() {
    this.castRays();
  }

  private castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i += 1) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.zoomies.angle;

      const start = { x: this.zoomies.x, y: this.zoomies.y };
      const end = {
        x: this.zoomies.x - Math.sin(rayAngle) * this.rayLength,
        y: this.zoomies.y - Math.cos(rayAngle) * this.rayLength,
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
      ctx.strokeStyle = "yellow";
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
