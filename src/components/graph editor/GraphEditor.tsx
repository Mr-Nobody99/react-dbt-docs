import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import GraphManager from "../../classes/GraphManager";
import ToolBar from "./components/tool bar/Toolbar";
import ContextMenu from "./components/ContextMenu";
import FullScreenButton from "./components/FullScreenButton";
import ColorManagerLauncher from "./components/color manager/components/ColorManagerLauncher";
import ColorManager from "./components/color manager/ColorManager";

const StyledCanvas = styled.canvas`
  height: 90%;
  width: 95%;
`;

const GraphEditor_Wrapper = styled.div`
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;
  z-index: 20;
  position: absolute;

  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
`;

interface Props {
  manager?: GraphManager;
  currentModel: string;

  filter: GraphFilter;
  applyFilter: () => void;
  updateFilter: (arg: Partial<GraphFilter>) => void;
  clearFilter: () => void;

  tag_list: string[];
  package_list: string[];

  minimize: () => void;
  closeGraph: () => void;
}

const GraphEditor: React.FC<Props> = (props) => {
  const _ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (props.manager && _ref.current) {
      props.manager.canvas = _ref.current;
      const resize = () => {
        props.manager?.resize();
      };
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [props.manager]);

  const [colorManagerActive, setColorManagerActive] = useState(false);
  const [contextMenuActive, setContextMenuActive] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const openContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenuActive(true);
    setContextMenuPosition({ x: e.x, y: e.y });
  };

  const export_canvas = () => props.manager && props.manager.export_canvas();

  useEffect(() => {
    document.addEventListener("contextmenu", openContextMenu);
    return () => {
      document.removeEventListener("contextmenu", openContextMenu);
      setContextMenuActive(false);
    };
  }, []);

  const [shouldUpdate, setShouldUpdate] = useState(false);
  const color_change = () => {
    props.manager?.draw();
    setShouldUpdate(!shouldUpdate);
  };

  return (
    <GraphEditor_Wrapper>
      {colorManagerActive ? (
        <ColorManager
          updateGraph={color_change}
          close={() => {
            setColorManagerActive(false);
          }}
        />
      ) : (
        <ColorManagerLauncher
          clickHandler={() => {
            setColorManagerActive(true);
          }}
        />
      )}

      {props.currentModel ? (
        <FullScreenButton styleRight={2.5} onClick={props.minimize} />
      ) : null}

      <StyledCanvas
        ref={_ref}
        onClick={() => {
          contextMenuActive && setContextMenuActive(false);
        }}
        onDoubleClick={(e) => {
          props.manager?.handleDoubleClick(e);
        }}
        onMouseDown={(e) => {
          props.manager?.handleMouseDown(e);
        }}
        onMouseMove={(e) => {
          props.manager?.handleMouseMove(e);
        }}
        onMouseUp={(e) => {
          props.manager?.handleMouseUp(e);
        }}
        onWheel={(e) => {
          props.manager?.handleMouseWheel(e);
        }}
      />

      <ToolBar
        filter={props.filter}
        updateFilter={props.updateFilter}
        applyFilter={props.applyFilter}
        tag_list={props.tag_list}
        package_list={props.package_list}
        closeFunc={props.closeGraph}
      />

      {contextMenuActive ? (
        <ContextMenu
          position={contextMenuPosition}
          close_func={props.closeGraph}
          graphSelection={props.manager?.selected_vert?.data}
          updateFilter={props.updateFilter}
          applyFilter={props.applyFilter}
          clearFilter={props.clearFilter}
          exportCanvas={export_canvas}
        />
      ) : null}
    </GraphEditor_Wrapper>
  );
};
export default GraphEditor;
