import styled from "styled-components";
import React from "react";
import ToolLabel from "./ToolLabel";

const DropUp_Menu = styled.div`
  position: absolute;
  bottom: 104%;

  width: 100%;
  border-radius: 4px;
  background-color: #f1f1f1;

  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

  display: none;
`;

const DropUp_Item = styled.a`
  display: block;
  cursor: pointer;
  padding: 2px 10px;
  color: #313539;
  user-select: none;
  &:hover {
    background: lightgray;
  }
`;

const Display = styled.div`
  user-select: none;
  color: white;
`;

const Toggle_Wrapper = styled.div`
  padding-left: 1em;
`;

const DropUp_Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: inline-block;
`;

interface Props {
  label: string;
  display: string;

  data: string[];

  activeSelection: Set<string>;
  updateSelection: (arg: Set<string>) => void;

  openFunc: () => void;
}
const DropUp: React.FC<Props> = (props) => {
  return (
    <DropUp_Wrapper>
      <Toggle_Wrapper onClick={props.openFunc}>
        <ToolLabel>{props.label}</ToolLabel>
        <Display className="dropup-display">{props.display}</Display>
      </Toggle_Wrapper>
      <DropUp_Menu className="dropup">
        <DropUp_Item
          onClick={() => {
            props.activeSelection.size
              ? props.updateSelection(new Set())
              : props.updateSelection(new Set(props.data));
          }}
        >
          <strong>Select All</strong>
        </DropUp_Item>
        {props.data.map((item) => (
          <DropUp_Item
            key={item}
            onClick={() => {
              const newSelection = new Set(props.activeSelection);
              props.activeSelection.has(item)
                ? newSelection.delete(item)
                : newSelection.add(item);
              props.updateSelection(newSelection);
            }}
          >
            {item} {props.activeSelection.has(item) ? "✓" : null}
          </DropUp_Item>
        ))}
      </DropUp_Menu>
    </DropUp_Wrapper>
  );
};

export default DropUp;
