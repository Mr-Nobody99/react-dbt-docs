import styled from "styled-components";
import React from "react";

const StyledButton = styled.button<{ styleRight: number }>`
  user-select: none;
  cursor: pointer;
  display: block;

  position: absolute;
  right: ${(props) => `${props.styleRight}%`};

  background: none;
  border: none;
  border-radius: 4px;

  width: 4rem;
  height: 4rem;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  pre {
    color: white;
    line-height: 1px;
    font-weight: bold;
    font-size: 2em;
  }
`;

const FullScreenButton_Wrapper = styled.div``;
interface Props {
  styleRight: number;
  onClick: () => void;
}
const FullScreenButton: React.FC<Props> = (props) => {
  return (
    <FullScreenButton_Wrapper>
      <StyledButton styleRight={props.styleRight} onClick={props.onClick}>
        <pre>
          ˹˺
          <br />
          ˻˼
        </pre>
      </StyledButton>
    </FullScreenButton_Wrapper>
  );
};
export default FullScreenButton;
