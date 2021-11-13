import styled from "styled-components";
import React from "react";

const Reset_Label = styled.div`
  padding-right: 0.25rem;
  padding-left: 0.25rem;
  border-radius: 4px;
  user-select: none;
  font-weight: bold;
  color: #313539;
  cursor: pointer;
  float: left;

  width: 1rem;

  text-align: center;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Color_Label = styled.label`
  user-select: none;
  color: #313539;
`;

const StyledInput = styled.input`
  margin-left: 0.25rem;
  margin-right: 1rem;
`;

const ColorInput_Wrapper = styled.div`
  padding: 0.25rem;
`;

interface Props {
  color_obj: { [key: string]: string | {} };
  color_key: string;
  default_color: string;
  updateGraph: () => void;
}

const ColorInput: React.FC<Props> = (props) => {
  const color = props.color_obj;
  const key = props.color_key;

  return (
    <ColorInput_Wrapper>
      <Reset_Label
        onClick={(e) => {
          color[key] = props.default_color;
          const color_input = e.currentTarget.nextSibling;
          if (color_input) {
            (color_input as HTMLInputElement).value = props.default_color;
          }
          props.updateGraph();
        }}
      >
        ↺
      </Reset_Label>

      <StyledInput
        type="color"
        id={`${props.children}`}
        name={`${props.children}`}
        defaultValue={props.color_obj[props.color_key] as string}
        onChange={(e) => {
          color[key] = e.target.value;
          props.updateGraph();
        }}
      />

      <Color_Label htmlFor={`${props.children}`}>{props.children}</Color_Label>
    </ColorInput_Wrapper>
  );
};
export default ColorInput;
