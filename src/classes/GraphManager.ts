import React from "react";
import COLORS from "../utils/COLORS";
import Edge from "./Edge";
import Graph from "./Graph";
import Manifest from "./Manifest";
import { Point, Vertex } from "./Verts";

class GraphManager {
  private _selected_vert?: Vertex;
  public get selected_vert(): Vertex | undefined {
    return this._selected_vert;
  }
  private _filter?: GraphFilter;
  public updateFilter(v: GraphFilter) {
    this._filter = v;
    this.draw();
  }
  public applyFilter() {
    this.G.forEach((graph) => {
      if (this._filter) {
        graph.applyFilter(this._filter);
      }
    });
    this.draw();
  }

  private mouse_down = false;
  private isSelecting = false;
  private drag_start = new Point();

  private _frameId?: number;
  private _canvas: HTMLCanvasElement;
  public export_canvas(): string | undefined {
    if (this._canvas) {
      return this._canvas.toDataURL();
    }
    return undefined;
  }

  private G = new Map<string, Graph>();
  private _V = new Map<string, Vertex>();
  public get V(): Map<string, Vertex> {
    return this._V;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  public set canvas(v: HTMLCanvasElement) {
    this._canvas = v;
    this.resize();
  }

  constructor(manifest: Manifest) {
    this._canvas = document.createElement("canvas");
    const ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;

    manifest.Nodes.forEach((node) => {
      if (node.resource_type !== "test" || !node.tags?.includes("schema")) {
        this._V.set(node.unique_id, new Vertex(node));
      }
    });

    manifest.Sources.forEach((source) => {
      this._V.set(source.unique_id, new Vertex(source));
    });

    manifest.Exposures.forEach((exposure) => {
      this._V.set(exposure.unique_id, new Vertex(exposure));
    });

    this._V.forEach((u) => {
      u.width = ctx.measureText(u.data.name).width;
      const parent_ids = manifest.Parent_Map?.get(u.data.unique_id);
      if (parent_ids) {
        const parents: Vertex[] = [];
        parent_ids.forEach((id) => {
          const parent = this._V.get(id);
          if (parent) {
            parents.push(parent);
          }
        });
        u.parents = parents;
      }
      const child_ids = manifest.Child_Map?.get(u.data.unique_id);
      if (child_ids) {
        const children: Vertex[] = [];
        child_ids.forEach((id) => {
          const child = this._V.get(id);
          if (child) {
            children.push(child);
          }
        });
        u.children = children;
      }
    });
    manifest.packages.forEach((pkg) => {
      const V = [...this._V.values()].filter(
        (u) => u.data.package_name === pkg
      );
      const E = new Set(
        V.reduce(
          (arr, u) => arr.concat(u.children.map((c) => new Edge(u, c))),
          [] as Edge[]
        )
      );
      this.G.set(pkg, new Graph(V, E));
    });
  }

  handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this._selected_vert = undefined;
  }
  handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();

    this.drag_start.x = e.clientX;
    this.drag_start.y = e.clientY;
    this.isSelecting = false;
    this.mouse_down = true;

    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      const [ex, ey] = this.projectToCanvas(e.clientX, e.clientY, ctx);
      this._V.forEach((u) => {
        if (!u.isFiltered) {
          const xInBounds = ex >= u.x && ex <= u.x + u.width;
          const yInBounds = ey >= u.y && ey <= u.y + Vertex.HEIGHT;
          if (xInBounds && yInBounds) {
            this.isSelecting = true;
            this._selected_vert = u;
            console.log(u);
          }
        }
      });
      this.draw();
    }
  }
  handleMouseMove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (this.mouse_down) {
      const ctx = this.canvas.getContext("2d");
      if (ctx) {
        const [dx, dy] = this.projectToCanvas(
          this.drag_start.x,
          this.drag_start.y,
          ctx
        );
        const [ex, ey] = this.projectToCanvas(e.clientX, e.clientY, ctx);
        const [mx, my] = [Math.abs(ex - dx), Math.abs(ey - dy)];

        this.drag_start.x = e.clientX;
        this.drag_start.y = e.clientY;

        switch (this.isSelecting) {
          case true:
            if (this._selected_vert) {
              this._selected_vert.x += ex < dx ? -mx : mx;
              this._selected_vert.y += ey < dy ? -my : my;
            }
            break;
          case false:
            ctx.translate(ex - dx, ey - dy);
            break;
        }
        this.draw();
      }
    }
  }
  handleMouseUp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isSelecting = false;
    this.mouse_down = false;
    this.draw();
  }
  handleMouseWheel(e: React.WheelEvent): void {
    e.stopPropagation();

    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      const [ex, ey] = this.projectToCanvas(e.clientX, e.clientY, ctx);
      const M = ctx.getTransform();
      const scale = e.deltaY > 0 ? 0.8 : 1.2;
      M.scaleSelf(scale, scale, 0, ex, ey);
      if (0.05 < M.a && M.a < 5) {
        ctx.setTransform(M);
        this.draw();
      }
    }
  }

  private projectToCanvas(i: number, j: number, ctx: CanvasRenderingContext2D) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const M = ctx.getTransform().invertSelf();

    const x = (i - rect.left) * scaleX;
    const y = (j - rect.top) * scaleY;

    return [x * M.a + y * M.c + M.e, x * M.b + y * M.d + M.f];
  }

  public resize(): void {
    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      const M = ctx.getTransform();
      const [dx, dy] = this.projectToCanvas(0, 0, ctx);

      ctx.translate(dx, dy);
      this.canvas.height = this.canvas.clientHeight;
      this.canvas.width = this.canvas.clientWidth;
      ctx.translate(-dx, -dy);

      ctx.setTransform(M);
      this.draw();
    }
  }

  public draw(): void {
    const ctx = this.canvas.getContext("2d");

    const clear = () => {
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();
      }
    };
    const draw_background = () => {
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = COLORS.BACKGROUND;
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();
      }
    };
    const draw_cursor = () => {
      if (this.mouse_down && ctx) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = COLORS.CURSOR;
        switch (this.isSelecting) {
          case false: {
            const rect = this.canvas.getBoundingClientRect();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            ctx.arc(
              this.drag_start.x - rect.left,
              this.drag_start.y - rect.top,
              20,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
          }

          case true: {
            if (this._selected_vert) {
              ctx.fillRect(
                this._selected_vert.x - 5,
                this._selected_vert.y - 5,
                this._selected_vert.width + Vertex.PADDING + 10,
                Vertex.HEIGHT + 10
              );
              break;
            }
          }
        }
        ctx.restore();
      }
    };

    this._frameId && cancelAnimationFrame(this._frameId);
    this._frameId = requestAnimationFrame(() => {
      clear();
      this.G.forEach((graph, pkg) => {
        graph.draw(this._canvas, this._selected_vert, this._filter);
      });
      draw_cursor();
      draw_background();
    });
  }
}
export default GraphManager;
