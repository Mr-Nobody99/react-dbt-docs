import COLORS from "../utils/COLORS";

export class Point {
  public isVert(): this is Vertex {
    return this instanceof Vertex;
  }

  protected _x: number;
  public get x(): number {
    return this._x;
  }
  public set x(v: number) {
    this._x = v;
  }

  protected _y: number;
  public get y(): number {
    return this._y;
  }
  public set y(v: number) {
    this._y = v;
  }

  protected _layer: number;
  public get layer(): number {
    return this._layer;
  }
  public set layer(v: number) {
    this._layer = v;
  }

  private _isVirtual: boolean;
  public get isVirtual(): boolean {
    return this._isVirtual;
  }

  constructor(x = 0, y = 0, l = 0, isVirtual = false) {
    this._x = x;
    this._y = y;
    this._layer = l;
    this._isVirtual = isVirtual;
  }
}

export class Vertex extends Point {
  static HEIGHT = 20;
  static PADDING = 10;

  public get data(): ManifestData {
    return this._data;
  }

  private _width = 0;
  public get width(): number {
    return this._width;
  }
  public set width(v: number) {
    this._width = v;
  }

  private _isFiltered = false;
  public get isFiltered(): boolean {
    return this._isFiltered;
  }
  public set isFiltered(v: boolean) {
    this._isFiltered = v;
  }

  private _parents: Vertex[] = [];
  public get parents(): Vertex[] {
    return this._parents.filter((p) => !p.isFiltered);
  }
  public set parents(v: Vertex[]) {
    this._parents = v;
  }
  public get all_parents(): Vertex[] {
    return this._parents;
  }

  private _ancestors = new Set<Vertex>();
  public get ancestors(): Set<Vertex> {
    if (this._ancestors.size === 0 && this._parents.length) {
      const walk_ancestors = (u: Vertex) => {
        u.all_parents.forEach((parent) => {
          this._ancestors.add(parent);
          walk_ancestors(parent);
        });
      };
      walk_ancestors(this);
    }
    return this._ancestors;
  }

  private _children: Vertex[] = [];
  public get children(): Vertex[] {
    return this._children.filter((c) => !c.isFiltered);
  }
  public set children(v: Vertex[]) {
    this._children = v;
  }
  public get all_children(): Vertex[] {
    return this._children;
  }

  private _decendants = new Set<Vertex>();
  public get decendants(): Set<Vertex> {
    if (this._decendants.size === 0 && this._children.length) {
      const walk_decendants = (u: Vertex) => {
        u.all_children.forEach((child) => {
          this._decendants.add(child);
          walk_decendants(child);
        });
      };
      walk_decendants(this);
    }
    return this._decendants;
  }

  public fillColor(isSelection = false): string {
    switch (isSelection) {
      case true:
        return COLORS.SELECTED.BASE;

      case false:
        switch (this.data.resource_type) {
          case "analysis":
            return COLORS.ANALYSIS.BASE;
          case "exposure":
            return COLORS.EXPOSURE.BASE;
          case "model":
            return COLORS.NODE.BASE;
          case "source":
            return COLORS.SOURCE.BASE;
          case "snapshot":
            return COLORS.SNAPSHOT.BASE;
          case "seed":
            return COLORS.SEED.BASE;
          case "test":
            return COLORS.TEST.BASE;

          default:
            break;
        }
        break;
    }
    return "";
  }

  public strokeColor(isSelection = false): string {
    switch (isSelection) {
      case true:
        return COLORS.SELECTED.HIGHLIGHT;

      case false:
        switch (this.data.resource_type) {
          case "analysis":
            return COLORS.ANALYSIS.HIGHLIGHT;
          case "exposure":
            return COLORS.EXPOSURE.HIGHLIGHT;
          case "model":
            return COLORS.NODE.HIGHLIGHT;
          case "source":
            return COLORS.SOURCE.HIGHLIGHT;
          case "snapshot":
            return COLORS.SNAPSHOT.HIGHLIGHT;
          case "seed":
            return COLORS.SEED.HIGHLIGHT;
          case "test":
            return COLORS.TEST.HIGHLIGHT;

          default:
            break;
        }
        break;
    }

    return "";
  }

  public textColor(): string {
    switch (this.data.resource_type) {
      case "analysis":
        return COLORS.ANALYSIS.TEXT;
      case "exposure":
        return COLORS.EXPOSURE.TEXT;
      case "model":
        return COLORS.NODE.TEXT;
      case "source":
        return COLORS.SOURCE.TEXT;
      case "snapshot":
        return COLORS.SNAPSHOT.TEXT;
      case "seed":
        return COLORS.SEED.TEXT;
      case "test":
        return COLORS.TEST.TEXT;

      default:
        return "";
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    isSelected = false,
    willBeFiltered = false
  ) {
    const R = 5;
    const h = Vertex.HEIGHT;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // Rect 1
    ctx.save();
    switch (willBeFiltered) {
      case true:
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = COLORS.FILTERED;
        break;
      case false:
        ctx.fillStyle = this.strokeColor(isSelected);
    }

    const [x1, y1] = [this.x + 1, this.y + 2];
    let [r, b] = [x1 + this.width + Vertex.PADDING, y1 + Vertex.HEIGHT];

    ctx.beginPath();
    ctx.moveTo(x1 + R, y1);
    ctx.lineTo(r - R, y1);

    ctx.quadraticCurveTo(r, y1, r, y1 + R);
    ctx.lineTo(r, y1 + h - R);

    ctx.quadraticCurveTo(r, b, r - R, b);
    ctx.lineTo(x1 + R, b);

    ctx.quadraticCurveTo(x1, b, x1, b - R);
    ctx.lineTo(x1, y1 + R);

    ctx.quadraticCurveTo(x1, y1, x1 + R, y1);
    ctx.fill();
    ctx.restore();

    // Rect 2
    ctx.fillStyle = willBeFiltered
      ? COLORS.FILTERED
      : this.fillColor(isSelected);
    const [x2, y2] = [this.x, this.y];
    [r, b] = [x2 + this.width + Vertex.PADDING, y2 + Vertex.HEIGHT];
    ctx.beginPath();
    ctx.moveTo(x2 + R, y2);
    ctx.lineTo(r - R, y2);

    ctx.quadraticCurveTo(r, y2, r, y2 + R);
    ctx.lineTo(r, y2 + h - R);

    ctx.quadraticCurveTo(r, b, r - R, b);
    ctx.lineTo(x2 + R, b);

    ctx.quadraticCurveTo(x2, b, x2, b - R);
    ctx.lineTo(x2, y2 + R);

    ctx.quadraticCurveTo(x2, y2, x2 + R, y2);
    ctx.fill();

    ctx.fillStyle = this.textColor();
    ctx.fillText(
      this._data.name,
      this.x + Vertex.PADDING / 2,
      this.y + Vertex.HEIGHT / 2
    );
  }

  constructor(private _data: ManifestData) {
    super();
  }
}
