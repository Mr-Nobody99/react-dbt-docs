import ToolLabel from "./ToolLabel";

import styled from "styled-components";
import React from "react";

const Styled_Input = styled.input`
  border: none;
  background: none;
  color: whitesmoke;

  ::placeholder {
    color: #00afc6;
  }

  &:focus-visible {
    color: black;
    outline: none;
  }
`;

const Select_Wrapper = styled.div`
  flex: 2;
  height: 100%;
  padding-left: 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  color: #00afc6;

  &:hover {
    color: grey;
    background: lightgray;
  }

  &:focus-within {
    color: grey;
    background: whitesmoke;
  }
`;

interface Props {
  activeSelect: string;
  updateFilter: (arg: Partial<GraphFilter>) => void;
}
const Select: React.FC<Props> = (props) => {
  return (
    <Select_Wrapper>
      <ToolLabel>--select</ToolLabel>
      <Styled_Input
        type="text"
        placeholder="..."
        value={props.activeSelect}
        onChange={(e) => {
          props.updateFilter({ select: e.target.value });
        }}
      />
    </Select_Wrapper>
  );
};

export default Select;
