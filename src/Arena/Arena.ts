import { lerp } from "../utils/lerp";

export class Arena {
  bottom: number;

  laneCount: number;

  left: number;

  right: number;

  top: number;

  width: number;

  x: number;

  borders;

  constructor(x: number, width: number, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  } // end constructor()

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";

    for (let i = 1; i <= this.laneCount - 1; i += 1) {
      const whatsTheMiddleXCoordForEachLane = lerp(
        this.left,
        this.right,
        i / this.laneCount
      );
      const x = whatsTheMiddleXCoordForEachLane;
      // if (i > 0 && i < this.laneCount) {
      ctx.setLineDash([10, 10]); // 20,20
      // } else { // ctx.setLineDash([]); // }
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    // Reset line dash for solid edge borders
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  } // draw(ctx: CanvasRendering)

  getLaneCenter(laneIndex: number) {
    const widthLane = this.width / this.laneCount;
    const widthLaneCenter = widthLane / 2;
    const indexFallbackIfMoreThanCount = Math.min(
      laneIndex,
      this.laneCount - 1
    );

    return (
      this.left + widthLaneCenter + indexFallbackIfMoreThanCount * widthLane
    );
  } // getLaneCenter(laneIndex: number)
}

// ctx.beginPath();
// ctx.moveTo(this.left, this.top);
// ctx.lineTo(this.left, this.bottom);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(this.right, this.top);
// ctx.lineTo(this.right, this.bottom);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(this.top, this.left);
// ctx.lineTo(this.top, this.right);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(this.bottom, this.left);
// ctx.lineTo(this.bottom, this.right);
// ctx.stroke();
