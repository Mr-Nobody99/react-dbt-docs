import styled from "styled-components";
import React, { useState } from "react";
import ColorInput from "./ColorInput";
import COLORS from "../../../../../utils/COLORS";

const ColorGroup_Label = styled.strong`
  user-select: none;
  display: block;
  cursor: pointer;

  color: #313539;

  padding: 0 0.25rem;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ColorGroup_Wrapper = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  padding-bottom: 0.25rem;
`;

interface Props {
  updateGraph: () => void;
  color_obj: {
    [key: string]: string | {};
    DEFAULT: {
      BASE: string;
      HIGHLIGHT: string;
    };
  };
}
const ColorGroup: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ColorGroup_Label
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {props.children}
      </ColorGroup_Label>

      <ColorGroup_Wrapper isOpen={isOpen}>
        <ColorInput
          color_key="BASE"
          color_obj={props.color_obj}
          default_color={props.color_obj.DEFAULT.BASE}
          updateGraph={props.updateGraph}
        >
          Foreground
        </ColorInput>
        <ColorInput
          color_key="HIGHLIGHT"
          color_obj={props.color_obj}
          default_color={props.color_obj.DEFAULT.BASE}
          updateGraph={props.updateGraph}
        >
          Background
        </ColorInput>
        <ColorInput
          color_key="TEXT"
          color_obj={props.color_obj}
          default_color={COLORS.TEXT_DEFAULT}
          updateGraph={props.updateGraph}
        >
          Text
        </ColorInput>
      </ColorGroup_Wrapper>
    </>
  );
};

export default ColorGroup;
