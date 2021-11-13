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

const Exclude_Wrapper = styled.div`
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
  activeExclude: string;
  updateFilter: (arg: Partial<GraphFilter>) => void;
}
const Exclude: React.FC<Props> = (props) => {
  return (
    <Exclude_Wrapper>
      <ToolLabel>--exclude</ToolLabel>
      <Styled_Input
        type="text"
        placeholder="..."
        value={props.activeExclude}
        onChange={(e) => {
          props.updateFilter({ exclude: e.target.value });
        }}
      />
    </Exclude_Wrapper>
  );
};

export default Exclude;
