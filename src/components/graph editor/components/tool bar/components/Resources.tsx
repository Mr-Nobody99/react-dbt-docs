import styled from "styled-components";
import React, { useRef } from "react";
import DropUp from "./DropUp";

const Resources_Wrapper = styled.div`
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  :focus {
    color: #313539;
    background: whitesmoke;

    .dropup {
      display: block;
    }
    .dropup-display {
      color: #313539;
    }
  }

  color: #00afc6;

  &:hover {
    color: grey;
    background: lightgray;
    .dropup-display {
      color: grey;
    }
  }
`;

interface Props {
  activeSelection: Set<string>;
  updateSelection: (arg: Set<string>) => void;
}
const Resources: React.FC<Props> = (props) => {
  const _ref = useRef<HTMLDivElement>(null);
  const resource_list = [
    "model",
    "seed",
    "snapshot",
    "source",
    "test",
    "analysis",
    "exposure",
  ];
  return (
    <Resources_Wrapper tabIndex={0} ref={_ref}>
      <DropUp
        label="resources"
        display={
          props.activeSelection.size === 0
            ? "none selected"
            : props.activeSelection.size === 1
            ? [...props.activeSelection][0]
            : props.activeSelection.size > 1
            ? props.activeSelection.size < resource_list.length
              ? `${props.activeSelection.size} selected`
              : "all selected"
            : ""
        }
        data={resource_list}
        activeSelection={props.activeSelection}
        updateSelection={props.updateSelection}
        openFunc={() => {
          _ref.current?.focus();
        }}
      />
    </Resources_Wrapper>
  );
};

export default Resources;
