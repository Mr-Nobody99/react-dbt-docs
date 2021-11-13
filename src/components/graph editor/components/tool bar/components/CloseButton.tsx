import styled from "styled-components";
import React from "react";

const CloseButton = styled.button`
  margin-left: auto;

  width: 100px;
  height: 5vh;

  border: none;
  outline: none;
  background: none;

  color: white;

  &:hover {
    background: lightgray;
  }
`;

export default CloseButton;
