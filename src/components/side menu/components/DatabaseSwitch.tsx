import styled from "styled-components";
import React, { useState } from "react";
import { TREE_MODE } from "../../App";

const SwitchButton = styled.div<{ active: boolean }>`
  flex: 1 1 auto;
  cursor: pointer;

  padding: 0.45rem 1.25rem;

  text-align: center;
  font-size: 0.8rem;

  border-radius: 4px;
  box-shadow: inset 0 0 5px rgb(0 0 0 /5%);

  &:hover {
    color: #313539;
  }

  font-weight: ${(props) => (props.active ? "bold" : null)};
  color: ${(props) => (props.active ? "#313539" : "#8b969e")};
  background: ${(props) => (props.active ? "#ffffff" : null)};

  transition: all 0.25s cubic-bezier(0.25, 0, 0, 1);
`;

const DatabaseSwitch_Wrapper = styled.div`
  margin: 1.5em 0;
  background: #edeff2;
  border-radius: 4px;
  display: flex;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 3%), 0 4px 4px -2px rgb(0 0 0 / 4%);
`;

interface Props {
  treeMode: TREE_MODE;
  setTreeMode: (value: TREE_MODE) => void;
}

const DatabaseSwitch: React.FC<Props> = (props) => {
  return (
    <DatabaseSwitch_Wrapper>
      <SwitchButton
        active={props.treeMode === TREE_MODE.PROJECT}
        onClick={() => {
          props.setTreeMode(TREE_MODE.PROJECT);
        }}
      >
        Project
      </SwitchButton>

      <SwitchButton
        active={props.treeMode === TREE_MODE.DATABASE}
        onClick={() => {
          props.setTreeMode(TREE_MODE.DATABASE);
        }}
      >
        {" "}
        Database
      </SwitchButton>
    </DatabaseSwitch_Wrapper>
  );
};

export default DatabaseSwitch;
