import COLORS from "../utils/COLORS";
import { curveWithArrow, lineWithArrow } from "../utils/Shapes";
import Edge from "./Edge";
import { Point, Vertex } from "./Verts";

export default class Graph {
  private _V: Vertex[];
  private _E: Set<Edge>;

  private max_layer_count = 25;

  COL_GAP = 200;
  ROW_GAP = Vertex.HEIGHT * 2;

  constructor(V: Vertex[], E: Set<Edge>) {
    this._V = V;
    this._E = E;

    this.assign_positions(
      this.merge_sub_graphs(
        this.construct_sub_graphs(this.construct_partial_orderings(V))
      )
    );
  }

  private construct_ordering(V: Vertex[]): [Vertex[], Vertex[]] {
    const [stack, loners, ordering]: [Set<Vertex>, Set<Vertex>, Set<Vertex>] = [
      new Set(),
      new Set(),
      new Set(),
    ];

    V.forEach((u) => {
      u.parents.length
        ? stack.add(u)
        : u.children.length
        ? ordering.add(u)
        : loners.add(u);
    });

    const lookupTable = new Map([...ordering].map((u, i) => [u, i]));

    while (stack.size) {
      const candidates = [...stack].filter((u) =>
        u.parents.filter((p) => V.includes(p)).every((p) => ordering.has(p))
      );

      if (candidates.length === 0) {
        console.warn("something went wrong while constructing ordering...");
        break;
      }

      candidates.forEach((u) => {
        u.parents.sort(
          (a, b) =>
            (lookupTable.get(a) as number) - (lookupTable.get(b) as number)
        );
      });

      candidates.sort((a, b) => {
        for (let i = 0; i < Math.min(a.parents.length, b.parents.length); i++) {
          const posA = lookupTable.get(a.parents[i]);
          const posB = lookupTable.get(b.parents[i]);
          if (posA && posB && posB < posA) return 1;
        }
        return 0;
      });

      candidates.forEach((u) => {
        lookupTable.set(u, ordering.size);
        ordering.add(u);
        stack.delete(u);
      });
    }
    return [[...ordering], [...loners]];
  }
  private assign_layers(ordering: Vertex[], loners: Vertex[] = []): Vertex[][] {
    ordering.forEach((u, i) => (u.layer = i));

    const layers: Vertex[][] = ordering.map(() => []);
    while (ordering.length) {
      const u = ordering.pop();
      if (u) {
        const highestChild = Math.min(
          ...u.children
            .filter((child) => ordering.includes(child))
            .map((child) => child.layer)
        );

        let targetLayer =
          highestChild > 0 && highestChild < Infinity
            ? highestChild - 1
            : u.layer;
        if (layers[targetLayer].length >= this.max_layer_count) {
          while (targetLayer > 0) {
            targetLayer--;
            if (layers[targetLayer].length < this.max_layer_count) {
              break;
            }
          }
        }

        u.layer = targetLayer;
        layers[targetLayer].push(u);
      } else {
        break;
      }
    }

    const G = layers.filter((layer) => layer.length);
    loners.length && G.unshift(loners);
    return G;
  }
  private assign_positions(G: Point[][], centered = true): void {
    let w = 0;
    if (centered) {
      const maxLen = Math.max(...G.map((layer) => layer.length));
      for (let i = 0; i < G.length; i++) {
        w +=
          i > 0
            ? Math.max(
                ...G[i - 1].map((v) =>
                  v.isVert() && !v.isFiltered ? v.width : 0
                )
              )
            : 0;

        while (G[i].length < maxLen) {
          G[i][G[i].length % 2 ? "push" : "unshift"](new Point());
        }

        for (let j = 0; j < G[i].length; j++) {
          const u = G[i][j];
          if (u.isVert()) {
            u.x = this.COL_GAP * i + w;
            u.y = j * this.ROW_GAP;
          }
        }

        G[i] = G[i].filter((u) => u.isVert());
      }
    } else {
      G.forEach((layer, i) => {
        w +=
          i > 0
            ? Math.max(...G[i - 1].map((v) => (v.isVert() ? v.width : 0)))
            : 0;
        layer.forEach((u, j) => {
          u.x = this.COL_GAP * i + w;
          u.y = j * this.ROW_GAP;
        });
      });
    }
  }

  private construct_partial_orderings(V: Vertex[]): Set<Vertex>[] {
    const DFS = (vert: Vertex, seen = new Set<Vertex>()) => {
      seen.add(vert);
      vert.children.forEach((child) => {
        if (!seen.has(child)) {
          DFS(child, seen);
        }
      });
      return seen;
    };

    const partials = V.filter((u) => u.parents.length === 0)
      .map((root) => DFS(root))
      .sort((a, b) => a.size - b.size);

    partials.forEach((g, i) => {
      for (let j = i + 1; j < partials.length; j++) {
        partials[j].forEach((u) => g.delete(u));
      }
    });

    return partials;
  }
  private construct_sub_graphs(partials: Set<Vertex>[]): Vertex[][][] {
    const sub_graphs = partials.map((_g) => {
      let result: Vertex[][];
      const [ordering, loners] = this.construct_ordering([..._g]);
      if (ordering.length > 1) {
        result = this.assign_layers(ordering, loners);
      } else {
        result = [[...ordering, ...loners]];
      }
      return result;
    });
    return sub_graphs;
  }
  private merge_sub_graphs(sub_graphs: Vertex[][][]): Vertex[][] {
    const G: Vertex[][] = new Array(
      Math.max(...sub_graphs.map((g) => g.length))
    )
      .fill(0)
      .map(() => []);

    sub_graphs.forEach((g) => {
      g.forEach((layer, i) => {
        layer.forEach((u) => {
          G[i].push(u);
        });
      });
    });

    // Move children up where possible
    for (let i = 0; i < G.length; i++) {
      const layer = G[i];
      layer.forEach((u, i) => {
        if (u.parents.length) {
          const lowest_parent = Math.max(...u.parents.map((p) => p.layer));
          if (u.layer > lowest_parent + 1) {
            const v = layer.splice(i, 1).pop();
            if (v) {
              v.layer = lowest_parent + 1;
              G[v.layer].push(v);
            }
          }
        }
      });
    }

    // Move parents down where possible
    for (let i = 0; i < G.length; i++) {
      const layer = G[i];
      layer.forEach((u, i) => {
        if (u.children.length) {
          const highestChild = Math.min(...u.children.map((c) => c.layer));
          if (u.layer < highestChild - 1) {
            const v = layer.splice(i, 1).pop();
            if (v) {
              v.layer = highestChild - 1;
              G[v.layer].push(v);
            }
          }
        }
      });
    }

    return G.filter((layer) => layer.length);
  }

  public applyFilter(filter: GraphFilter) {
    this._V.forEach((u) => {
      u.isFiltered = false;
      u.layer = 0;
    });

    const toBeFiltered = new Set<Vertex>();
    this._V.forEach((u) => {
      if (!u.data.tags?.some((tag) => filter.tags.has(tag))) {
        toBeFiltered.add(u);
      }
      if (!filter.packages.has(u.data.package_name)) {
        toBeFiltered.add(u);
      }
      if (u.data.resource_type && !filter.resources.has(u.data.resource_type)) {
        toBeFiltered.add(u);
      }
    });

    if (filter.select) {
      const match = filter.select.match(/([+-]*)?\s*(\w*)\s*([+-]*)?/);
      if (match) {
        this._V.forEach((u) => toBeFiltered.add(u));
        const [upstream, target, downstream] = [match[1], match[2], match[3]];
        const matchedVert = this._V.filter((u) => u.data.name === target).pop();
        if (matchedVert) {
          const selection = new Set<Vertex>([matchedVert]);
          if (upstream === "+") {
            matchedVert.parents.forEach((a) => selection.add(a));
          }
          if (upstream === "++") {
            matchedVert.ancestors.forEach((a) => selection.add(a));
          }
          if (downstream === "+") {
            matchedVert.children.forEach((d) => selection.add(d));
          }
          if (downstream === "++") {
            matchedVert.decendants.forEach((d) => selection.add(d));
          }
          selection.forEach((u) => toBeFiltered.delete(u));
        }
      }
    }

    if (filter.exclude) {
      const match = filter.exclude.match(/([+-]*)?\s*(\w*)\s*([+-]*)?/);
      if (match) {
        const [upstream, target, downstream] = [match[1], match[2], match[3]];
        const matchedVert = this._V.filter((u) => u.data.name === target).pop();
        if (matchedVert) {
          toBeFiltered.add(matchedVert);
          if (upstream === "+") {
            matchedVert.parents.forEach((a) => toBeFiltered.add(a));
          }
          if (upstream === "++") {
            matchedVert.ancestors.forEach((a) => toBeFiltered.add(a));
          }
          if (downstream === "+") {
            matchedVert.children.forEach((d) => toBeFiltered.add(d));
          }
          if (downstream === "++") {
            matchedVert.decendants.forEach((d) => toBeFiltered.add(d));
          }
        }
      }
    }

    toBeFiltered.forEach((u) => (u.isFiltered = true));
    const unfiltered = this._V.filter((u) => !toBeFiltered.has(u));

    this._E = new Set(
      unfiltered.reduce(
        (arr, u) => arr.concat(u.children.map((c) => new Edge(u, c))),
        [] as Edge[]
      )
    );

    if (unfiltered.length) {
      this.assign_positions(
        this.merge_sub_graphs(
          this.construct_sub_graphs(
            this.construct_partial_orderings(unfiltered)
          )
        )
      );
    }
  }
  public draw(
    canvas: HTMLCanvasElement,
    selected_vert?: Vertex,
    filter?: GraphFilter
  ) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "middle";

      ctx.save();
      ctx.lineWidth = 2;
      this._E.forEach((edge) => {
        const [u, v] = [edge.start, edge.end];

        const [x1, y1] = [
          u.isVert() ? u.x + u.width + Vertex.PADDING + 5 : u.x,
          u.isVert() ? u.y + Vertex.HEIGHT / 2 : u.y,
        ];

        const [x2, y2] = [
          v.isVert() ? v.x - Vertex.PADDING / 2 : v.x,
          v.isVert() ? v.y + Vertex.HEIGHT / 2 : v.y,
        ];

        const midX = (x1 + x2) / 2;

        if (
          u === selected_vert ||
          v === selected_vert ||
          (u.isVert() &&
            selected_vert?.ancestors.has(u) &&
            v.isVert() &&
            selected_vert.ancestors.has(v)) ||
          (u.isVert() &&
            selected_vert?.decendants.has(u) &&
            v.isVert() &&
            selected_vert.decendants.has(v))
        ) {
          ctx.strokeStyle = COLORS.EDGE.SELECTED;
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.strokeStyle = COLORS.EDGE.BASE;
          ctx.globalCompositeOperation = "destination-over";
        }

        curveWithArrow(
          ctx,
          10,
          new Point(x1, y1),
          new Point(midX, y1),
          new Point(midX, y2),
          new Point(x2, y2)
        );
      });
      ctx.restore();

      let select_match: Vertex | null = null;
      let select_downstream = "";
      let select_upstream = "";

      let exclude_match: Vertex | null = null;
      let exclude_downstream = "";
      let exclude_upstream = "";

      if (filter?.select) {
        const match = filter.select.match(/([+-]*)?\s*(\w*)\s*([+-]*)?/);
        if (match) {
          select_upstream = match[1];
          select_downstream = match[3];
          const target = match[2];
          const vert = this._V.filter((u) => u.data.name === target).pop();
          if (vert) {
            select_match = vert;
          }
        }
      }

      if (filter?.exclude) {
        const match = filter.exclude.match(/([+-]*)?\s*(\w*)\s*([+-]*)?/);
        if (match) {
          exclude_upstream = match[1];
          exclude_downstream = match[3];

          const target = match[2];
          const vert = this._V.filter((u) => u.data.name === target).pop();

          if (vert) {
            exclude_match = vert;
          }
        }
      }

      this._V.forEach((u) => {
        if (!u.isFiltered) {
          let willBeFiltered = false;
          if (filter) {
            if (!u.data.tags?.some((tag) => filter.tags.has(tag))) {
              willBeFiltered = true;
            }
            if (!filter.packages.has(u.data.package_name)) {
              willBeFiltered = true;
            }
            if (
              u.data.resource_type &&
              !filter.resources.has(u.data.resource_type)
            ) {
              willBeFiltered = true;
            }

            if (select_match === null && filter.select) {
              willBeFiltered = true;
            }
            if (select_match && u !== select_match) {
              if (!select_upstream && select_downstream) {
                switch (select_downstream) {
                  case "+":
                    if (!select_match.all_children.includes(u)) {
                      willBeFiltered = true;
                    }
                    break;

                  case "++":
                    if (!select_match.decendants.has(u)) {
                      willBeFiltered = true;
                    }
                    break;

                  default:
                    break;
                }
              }

              if (select_upstream && !select_downstream) {
                switch (select_upstream) {
                  case "+":
                    if (!select_match.all_parents.includes(u)) {
                      willBeFiltered = true;
                    }
                    break;

                  case "++":
                    if (!select_match.ancestors.has(u)) {
                      willBeFiltered = true;
                    }
                    break;

                  default:
                    break;
                }
              }

              if (!select_upstream && !select_downstream) {
                willBeFiltered = true;
              }
            }

            if (exclude_match && u === exclude_match) {
              willBeFiltered = true;
            }
            if (exclude_match && u !== exclude_match) {
              if (
                (exclude_upstream === "+" &&
                  exclude_match.all_parents.includes(u)) ||
                (exclude_upstream === "++" && exclude_match.ancestors.has(u)) ||
                (exclude_downstream === "+" &&
                  exclude_match.all_children.includes(u)) ||
                (exclude_downstream === "++" && exclude_match.decendants.has(u))
              ) {
                willBeFiltered = true;
              }
            }
          }

          u.draw(ctx, u === selected_vert, willBeFiltered);
        }
      });
    }
  }
}
