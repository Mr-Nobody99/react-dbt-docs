import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuItem = styled.div`
  cursor: default;
  padding: 5px 10px;
  color: black;
  &:hover {
    color: white;
    background: #0097c9;
  }
`;

interface WrapperProps {
  pos: { x: number; y: number };
}
const ContextMenu_Wrapper = styled.div<WrapperProps>`
  z-index: 50;
  position: absolute;

  left: ${(props) => `${props.pos.x}px`};
  top: ${(props) => `${props.pos.y}px`};

  background: whitesmoke;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

interface Props {
  close_func: () => void;
  graphSelection?: ManifestData;
  position: { x: number; y: number };
  applyFilter: () => void;
  updateFilter: (arg: Partial<GraphFilter>) => void;
  clearFilter: () => void;
  exportCanvas: () => string | undefined;
}
const ContextMenu: React.FC<Props> = (props: Props) => {
  const [canvasURI, setCanvasURI] = useState(props.exportCanvas());
  return (
    <ContextMenu_Wrapper pos={props.position}>
      {props.graphSelection ? (
        <>
          <Link
            to={`/${props.graphSelection.unique_id}`}
            onClick={() => {
              props.close_func();
            }}
          >
            <MenuItem>View Documentation</MenuItem>
          </Link>

          <MenuItem
            onClick={() => {
              props.updateFilter({ select: `+${props.graphSelection?.name}+` });
              props.applyFilter();
            }}
          >
            Focus On Node
          </MenuItem>

          <MenuItem
            onClick={() => {
              props.updateFilter({ select: `++${props.graphSelection?.name}` });
              props.applyFilter();
            }}
          >
            View Upstream
          </MenuItem>

          <MenuItem
            onClick={() => {
              props.updateFilter({ select: `${props.graphSelection?.name}++` });
              props.applyFilter();
            }}
          >
            View Downstream
          </MenuItem>
        </>
      ) : null}

      <MenuItem
        onClick={() => {
          props.clearFilter();
        }}
      >
        Clear all filters
      </MenuItem>

      <MenuItem>
        <a
          onClick={() => {
            setCanvasURI(props.exportCanvas());
          }}
          href={canvasURI}
          download
        >
          Export to PNG
        </a>
      </MenuItem>
    </ContextMenu_Wrapper>
  );
};

export default ContextMenu;
