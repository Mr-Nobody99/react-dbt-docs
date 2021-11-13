import { Link } from "react-router-dom";
import styled from "styled-components";
import React from "react";

const StyledButton = styled.div`
  cursor: pointer;
  padding: 5px 0;
  padding-left: 10px;
  border-radius: 4px;
  font-weight: bold;
  color: #313539;
  &:hover {
    background-color: #f0f2f4;
  }
`;

const OverviewButton: React.FC = (props) => {
  return (
    <Link to="/">
      <StyledButton>Overview</StyledButton>
    </Link>
  );
};

export default OverviewButton;
