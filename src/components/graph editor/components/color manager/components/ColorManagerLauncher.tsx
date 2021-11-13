import styled from "styled-components";
import React from "react";

const StyledButton = styled.button`
  cursor: pointer;
  display: block;

  position: absolute;
  left: 2.5%;

  border: none;
  border-radius: 4px;

  width: 3rem;
  height: 3rem;

  background: none;
  font-size: large;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;
const ColorManagerLauncher_Wrapper = styled.div``;

interface Props {
  clickHandler: () => void;
}
const ColorManagerLauncher: React.FC<Props> = (props) => {
  return (
    <ColorManagerLauncher_Wrapper>
      <StyledButton onClick={props.clickHandler}>🎨️</StyledButton>
    </ColorManagerLauncher_Wrapper>
  );
};
export default ColorManagerLauncher;
