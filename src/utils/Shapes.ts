import { Point } from "../classes/Verts";

const normalize = (a: Point, b: Point) => {
  let [normX, normY] = [-(b.y - a.y), b.x - a.x];
  const len = Math.sqrt(normX ** 2 + normY ** 2);
  return new Point(normX / len, normY / len);
};

export const lineWithArrow = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  h: number
): void => {
  ctx.lineWidth = 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  ctx.translate(x1, y1);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);

  ctx.moveTo(length - h, -w);
  ctx.lineTo(length, 0);
  ctx.lineTo(length - h, w);
  ctx.stroke();
};

export const curveWithArrow = (
  ctx: CanvasRenderingContext2D,
  length: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3?: Point
): void => {
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);

  const w = length / 2;

  let norm: Point;
  let end: Point;

  if (p3) {
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    end = new Point(p3.x, p3.y);
    norm = normalize(p2, p3);
  } else {
    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);

    end = new Point(p2.x, p2.y);
    norm = normalize(p1, p2);
  }

  let x = w * norm.x + length * -norm.y;
  let y = w * norm.y + length * norm.x;

  ctx.moveTo(end.x + x, end.y + y);
  ctx.lineTo(end.x, end.y);

  x = w * -norm.x + length * -norm.y;
  y = w * -norm.y + length * norm.x;

  ctx.lineTo(end.x + x, end.y + y);
  ctx.stroke();
};
