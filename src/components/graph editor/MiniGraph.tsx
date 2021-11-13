import styled from "styled-components";
import React, { useEffect, useRef } from "react";
import GraphManager from "../../classes/GraphManager";
import COLORS from "../../utils/COLORS";
import { Point, Vertex } from "../../classes/Verts";
import { curveWithArrow } from "../../utils/Shapes";
import FullScreenButton from "./components/FullScreenButton";

const CloseButton = styled.button`
  cursor: pointer;

  position: absolute;
  bottom: 0;
  right: 0;

  width: 4rem;
  height: 4rem;

  color: white;
  font-size: larger;

  background: none;
  border: none;

  &:hover {
    background: rgba(174, 174, 174, 0.2);
  }
`;

const MiniGraph_Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const MiniGraph_Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  right: 2%;
  top: 2.5%;

  height: 95%;
  width: 30%;

  min-width: 320px;
`;

interface Props {
  manager?: GraphManager;
  currentModel: string;
  applyFilter: () => void;
  updateFilter: (arg: Partial<GraphFilter>) => void;
  maxamize: () => void;
  closeFunc: () => void;
}
const MiniGraph: React.FC<Props> = (props) => {
  const _ref = useRef<HTMLCanvasElement>(null);
  const construct_ordering = (V: Vertex[]) => {
    const [stack, ordering]: [Set<Vertex>, Set<Vertex>] = [
      new Set(),
      new Set(),
    ];

    V.forEach((u) => {
      u.parents.length ? stack.add(u) : ordering.add(u);
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
    return [...ordering];
  };
  const draw = (vert?: Vertex) => {
    if (_ref.current) {
      const canvas = _ref.current;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = COLORS.BACKGROUND;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (vert) {
          const parent_ordering = construct_ordering(vert.all_parents);
          const child_ordering = construct_ordering(vert.all_children);
          const V = [...parent_ordering, vert, ...child_ordering];

          const max_w = Math.max(parent_ordering.length, child_ordering.length);

          let xStep = canvas.width / max_w / 2;
          const yStep = canvas.height / V.length;

          const D = xStep < 25 ? xStep : 25;
          const R = D / 2;

          if (vert.all_parents.length > 0 || vert.all_children.length > 0) {
            let [x, y] = [xStep, yStep / 2];

            const g = new Map<Vertex, { x: number; y: number }>();

            let i = 0;
            while (i < V.length) {
              const u = V[i];
              if (i < parent_ordering.length) {
                g.set(u, { x: x, y: y });
                x += xStep;
              }
              if (i === parent_ordering.length) {
                x = xStep;
                g.set(u, { x: x, y: y });
              }
              if (i > parent_ordering.length) {
                if (i === parent_ordering.length + 1) {
                  let target_x = xStep * child_ordering.length;
                  if (target_x + u.width >= canvas.width) {
                    target_x -= u.width;
                    xStep = target_x / child_ordering.length;
                  }
                  x = target_x;
                }
                g.set(u, { x: x, y: y });
                x -= xStep;
              }
              y += yStep;
              i++;
            }

            g.forEach((pos, u) => {
              const [x1, y1] = [pos.x, pos.y + D];
              ctx.fillStyle = COLORS.NODE.TEXT;
              ctx.fillText(u.data.name, pos.x + D, pos.y);

              ctx.fillStyle =
                u === vert ? COLORS.SELECTED.BASE : COLORS.NODE.BASE;
              ctx.beginPath();
              ctx.arc(pos.x, pos.y, R, 0, 2 * Math.PI);
              ctx.fill();

              ctx.lineWidth = 2;
              ctx.strokeStyle = COLORS.EDGE.BASE;

              u.children.forEach((v) => {
                const childPos = g.get(v);
                if (childPos) {
                  const [x2, y2] = [childPos.x, childPos.y - D];
                  const midY = (y1 + y2) / 2;

                  curveWithArrow(
                    ctx,
                    10,
                    new Point(x1, y1),
                    new Point(x1, midY),
                    new Point(x2, midY),
                    new Point(x2, y2)
                  );
                }
              });
            });
          } else {
            const [x, y] = [canvas.width / 2, canvas.height / 2];
            ctx.fillStyle = COLORS.SELECTED.BASE;
            ctx.beginPath();
            ctx.arc(x, y, R, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = COLORS.NODE.TEXT;
            ctx.fillText(vert.data.name, x + D, y);
          }
        }
      }
    }
  };
  useEffect(() => {
    if (props.manager) {
      const vert = props.manager.V.get(props.currentModel);
      props.updateFilter({
        select: `++${
          vert ? vert.data.name : props.currentModel.split(".").pop()
        }++`,
      });
      props.applyFilter();
      const render = () => {
        draw(vert);
      };
      render();
      window.addEventListener("resize", render);
      return () => {
        window.removeEventListener("resize", render);
      };
    }
  }, [props.currentModel]);

  return (
    <MiniGraph_Wrapper>
      <FullScreenButton styleRight={0} onClick={props.maxamize} />
      <MiniGraph_Canvas ref={_ref} />
      <CloseButton onClick={props.closeFunc}>X</CloseButton>
    </MiniGraph_Wrapper>
  );
};
export default MiniGraph;
