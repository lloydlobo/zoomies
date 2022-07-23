import { Ball } from "./Shape/Ball";
import { Zoomy } from "./Shape/Zoomy";
import "./style.css";
import { lerp } from "./utils/lerp";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <canvas></canvas>
  </div>
`;

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const width = canvas.width;
export const height = canvas.height;

const lerpRandom = (min: number, max: number): number =>
  Math.min(
    min + 1 + lerp(min, max, 20 * Math.abs(Math.sin(Math.random()))),
    max - 1 / lerp(max, min, 20 * Math.abs(Math.sin(Math.random())))
  );

export function random(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;

  return num;
}
const VELOCITY = 20;
export const STATE_BALL = {
  velX: random(-VELOCITY, VELOCITY),
  velY: random(-VELOCITY, VELOCITY),
  size: random(12, 21),
  hue: `${lerp(0, 255, Math.random() * 10)}`,
  saturation: `${lerp(50, 81.8, Math.random() * 10)}`,
  lightness: `${lerp(30, 51.8, Math.random() * 10)}`,
  count: random(10, 35),
  ARR_BALLS: [] as Ball[],
};

export function randomColor(alpha: number): string {
  return `
  hsla(
    ${lerp(0, parseFloat(STATE_BALL.hue), Math.random() * 10)}, 
    ${STATE_BALL.saturation}%, 
    ${STATE_BALL.lightness}%, ${alpha})
  `;
}

function createNewBall() {
  return new Ball(
    lerpRandom(0 + STATE_BALL.size, width - STATE_BALL.size),
    lerpRandom(0 + STATE_BALL.size, height - STATE_BALL.size),
    random(-STATE_BALL.velX, STATE_BALL.velX),
    random(-STATE_BALL.velY, STATE_BALL.velY),
    Math.min(lerp(10, STATE_BALL.size, Math.random() * 10), 35),
    randomColor(random(0.4, 0.99))
  );
}

for (let i = 0; i < STATE_BALL.count; i += 1) {
  const ball = createNewBall();
  STATE_BALL.ARR_BALLS.push(ball);
}
const zoomies = new Zoomy(
  random(10, width),
  random(10, height),
  random(-VELOCITY, VELOCITY),
  random(-VELOCITY, VELOCITY),
  VELOCITY / 4,
  "white",
  10
);

function loop() {
  ctx.fillStyle = `hsla(0,${zoomies.speed * 2 + 50}%, 1%, 0.47)`;
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < STATE_BALL.count; i += 1) {
    if (STATE_BALL.ARR_BALLS[i].exists) {
      STATE_BALL.ARR_BALLS[i].draw();
      STATE_BALL.ARR_BALLS[i].update();
      STATE_BALL.ARR_BALLS[i].detectCollision();
    }
  }
  zoomies.draw();
  zoomies.update();
  zoomies.updateBounds();
  zoomies.detectCollision();
  zoomies.sensor.draw();
  zoomies.sensor.update();

  requestAnimationFrame(loop);
}

loop();
