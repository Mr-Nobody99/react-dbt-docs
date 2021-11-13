import styled from "styled-components";
import React, { useRef } from "react";
import DropUp from "./DropUp";

const Tags_Wrapper = styled.div`
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
  tag_list: string[];
  activeSelection: Set<string>;
  updateSelection: (arg: Set<string>) => void;
}
const Tags: React.FC<Props> = (props) => {
  const _ref = useRef<HTMLDivElement>(null);
  return (
    <Tags_Wrapper tabIndex={0} ref={_ref}>
      <DropUp
        label="tags"
        display={
          props.activeSelection.size === 0
            ? "none selected"
            : props.activeSelection.size === 1
            ? [...props.activeSelection][0]
            : props.activeSelection.size > 1
            ? props.activeSelection.size !== props.tag_list.length
              ? `${props.activeSelection.size} selected`
              : "all selected"
            : ""
        }
        data={props.tag_list}
        activeSelection={props.activeSelection}
        updateSelection={props.updateSelection}
        openFunc={() => {
          _ref.current?.focus();
        }}
      />
    </Tags_Wrapper>
  );
};

export default Tags;
