import { ctx, height, width } from "../main";
import { Zoomy } from "../Shape/Zoomy";
import { getIntersection } from "../utils/getIntersection";
import { lerp } from "../utils/lerp";

export class Sensor {
  rayCount: number;

  raySpread: number;

  rayLength: number;

  zoomies: Zoomy;

  rays: { x: number; y: number }[][];

  readings: { x: number; y: number }[];
  constructor(zoomies: Zoomy, raySpread: number) {
    this.zoomies = zoomies;
    this.rayCount = 5;
    this.rayLength = (lerp(width, height, 0.618) / zoomies.size) * 1.618;
    this.raySpread = raySpread;

    this.rays = [];
    this.readings = [];
  }

  update(arenaBorders: { x: number; y: number }[][]) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      const reading = this.getReadings(this.rays[i], arenaBorders);
      if (!reading) continue;
      this.readings.push(reading);
    }
  }

  private getReadings(
    ray: { x: number; y: number }[],
    arenaBorders: { x: number; y: number }[][]
  ) {
    const arrTouches = [];

    for (let i = 0; i < arenaBorders.length; i += 1) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        arenaBorders[i][0],
        arenaBorders[i][1]
      );

      if (touch) {
        arrTouches.push(touch);
      }
    }

    if (arrTouches.length === 0) {
      return null;
    } else {
      const arrOffsets = arrTouches.map((elem) => elem.offset);
      const minOffset = Math.min(...arrOffsets);
      const findTouchWithMinOffset = arrTouches.find(
        (e) => e.offset === minOffset
      );

      return findTouchWithMinOffset;
    }
  } // private getReadings()

  castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i += 1) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.zoomies.angle;

      const flipX = this.zoomies.speed > 0 ? 1 : -1;
      const flipY = this.zoomies.speed > 0 ? 1 : -1;
      const dragX =
        Math.sin(this.zoomies.angle) * this.zoomies.speed -
        this.zoomies.speed * this.zoomies.acceleration;

      const dragY =
        Math.cos(this.zoomies.angle) * this.zoomies.speed -
        this.zoomies.speed * this.zoomies.acceleration;
      // TODO if zoomies.speed or controls.down then -Math.cos()
      const start = {
        x: this.zoomies.x + dragX * flipX,
        y: this.zoomies.y + dragY * flipY,
      };
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
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "blue";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
