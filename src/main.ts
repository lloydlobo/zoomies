import { Arena } from "./Arena/Arena";
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

const VELOCITY = 8;

export const BALL = {
  ARR_BALLS: [] as Ball[],
  count: random(4, 100),
  hue: `${lerp(0, 255, Math.random() * 10)}`,
  lightness: `${lerp(30, 51.8, Math.random() * 10)}`,
  saturation: `${lerp(50, 81.8, Math.random() * 10)}`,
  size: random(30, 50),
  velX: random(-VELOCITY, VELOCITY),
  velY: random(-VELOCITY, VELOCITY),
};

export function randomColor(alpha: number): string {
  return `
  hsla(
    ${lerp(0, parseFloat(BALL.hue), Math.random() * 10)}, 
    ${BALL.saturation}%, 
    ${BALL.lightness}%, ${alpha})
  `;
}

const offsetArenaEdges = 98.99 / 100;
export const arena = new Arena(
  width / 2,
  height / 2,
  width * offsetArenaEdges,
  height,
  3
);

function createNewBall() {
  return new Ball(
    lerpRandom(0 + BALL.size, width - BALL.size),
    lerpRandom(0 + BALL.size, height - BALL.size),
    random(-BALL.velX, BALL.velX),
    random(-BALL.velY, BALL.velY),
    // Math.min(lerp(10, BALL.size, Math.random()), 20),
    40,
    randomColor(random(0.4, 0.99))
  );
}

for (let i = 0; i < BALL.count; i += 1) {
  const ball = createNewBall();
  BALL.ARR_BALLS.push(ball);
}
const zoomies = new Zoomy(
  // random(10, width),
  arena.getLaneCenter(1),
  random(10, height),
  random(-VELOCITY, VELOCITY),
  random(-VELOCITY, VELOCITY),
  VELOCITY / 1.618,
  "white",
  10
);

function animateLoop() {
  zoomies.update(arena.borders);
  canvas.height = window.innerHeight;

  ctx.fillStyle = `hsla(0,0%, 0%, 0.7)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save(); // cool camera trick infinite scroll type
  ctx.translate(0, -zoomies.y + canvas.height * 0.7);
  arena.draw(ctx); // use after ctx.save(), ctx.translate()
  zoomies.draw();
  zoomies.detectCollision();

  for (let i = 0; i < BALL.count; i += 1) {
    if (BALL.ARR_BALLS[i].exists) {
      BALL.ARR_BALLS[i].draw();
      BALL.ARR_BALLS[i].update();
      // STATE_BALL.ARR_BALLS[i].detectCollision();
      BALL.ARR_BALLS[i].sensor.draw();
      BALL.ARR_BALLS[i].sensor.update();
    }
  }
  ctx.restore(); // restore save & translate

  requestAnimationFrame(animateLoop);
}

animateLoop();
