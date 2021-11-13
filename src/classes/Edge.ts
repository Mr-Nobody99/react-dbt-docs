import { Point, Vertex } from "./Verts";

export default class Edge {
  public get start(): Point {
    return this._start;
  }
  public get end(): Point {
    return this._end;
  }
  public get length(): number {
    return Math.abs(this.start.layer - this.end.layer);
  }

  constructor(private _start: Point, private _end: Point) {}
}
