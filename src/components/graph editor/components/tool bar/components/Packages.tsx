import styled from "styled-components";
import React, { useRef } from "react";
import DropUp from "./DropUp";

const Packages_Wrapper = styled.div`
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
  package_list: string[];
  activeSelection: Set<string>;
  updateSelection: (arg: Set<string>) => void;
}
const Packages: React.FC<Props> = (props) => {
  const _ref = useRef<HTMLDivElement>(null);
  return (
    <Packages_Wrapper tabIndex={0} ref={_ref}>
      <DropUp
        label="packages"
        display={
          props.activeSelection.size === 0
            ? "none selected"
            : props.activeSelection.size === 1
            ? [...props.activeSelection][0]
            : props.activeSelection.size > 1
            ? `${props.activeSelection.size} selected`
            : "all selected"
        }
        data={props.package_list}
        activeSelection={props.activeSelection}
        updateSelection={props.updateSelection}
        openFunc={() => {
          _ref.current?.focus();
        }}
      />
    </Packages_Wrapper>
  );
};

export default Packages;
