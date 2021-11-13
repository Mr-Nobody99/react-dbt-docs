import styled from "styled-components";
import React, { useRef } from "react";
import ColorInput from "./components/ColorInput";
import COLORS from "../../../../utils/COLORS";
import ColorGroup from "./components/ColorGroup";

const CloseButton = styled.button``;

const CloseButton_Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ColorManager_Wrapper = styled.div`
  background: whitesmoke;
  border-radius: 4px;
  position: absolute;
  padding: 1em;
  margin: 10px;
  left: 2.5%;

  max-height: 50%;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #c7c7c7;
    :hover {
      background: #888888;
    }
  }
`;

interface Props {
  close: () => void;
  updateGraph: () => void;
}
const ColorManager: React.FC<Props> = (props) => {
  return (
    <div>
      <ColorManager_Wrapper>
        <ColorInput
          color_obj={COLORS}
          color_key={"BACKGROUND"}
          default_color={COLORS.BACKGROUND_DEFUALT}
          updateGraph={props.updateGraph}
        >
          Background
        </ColorInput>

        <ColorInput
          color_obj={COLORS.EDGE}
          color_key={"BASE"}
          default_color={COLORS.EDGE.DEFAULT.BASE}
          updateGraph={props.updateGraph}
        >
          Connections
        </ColorInput>

        <ColorInput
          color_obj={COLORS}
          color_key={"CURSOR"}
          default_color={COLORS.CURSOR_DEFUALT}
          updateGraph={props.updateGraph}
        >
          Cursor
        </ColorInput>
        <hr />
        <ColorGroup color_obj={COLORS.NODE} updateGraph={props.updateGraph}>
          Models
        </ColorGroup>
        <hr />
        <ColorGroup color_obj={COLORS.SOURCE} updateGraph={props.updateGraph}>
          Sources
        </ColorGroup>
        <hr />
        <ColorGroup color_obj={COLORS.SNAPSHOT} updateGraph={props.updateGraph}>
          Snapshots
        </ColorGroup>
        <hr />
        <ColorGroup color_obj={COLORS.SEED} updateGraph={props.updateGraph}>
          Seeds
        </ColorGroup>
        <hr />
        <ColorGroup color_obj={COLORS.EXPOSURE} updateGraph={props.updateGraph}>
          Exposures
        </ColorGroup>
        <hr />
        <ColorGroup color_obj={COLORS.TEST} updateGraph={props.updateGraph}>
          Tests
        </ColorGroup>

        <hr />
        <CloseButton_Wrapper>
          <CloseButton onClick={props.close}>Close</CloseButton>
        </CloseButton_Wrapper>
      </ColorManager_Wrapper>
    </div>
  );
};
export default ColorManager;
