import styled from "styled-components";
import React from "react";

const StyledPanel = styled.div`
  flex: 1 0;
  height: fit-content;
  padding: 20px 30px;
  margin-top: 20px;
  background: #fff;
  border-radius: 4px;
  overflow: auto;
  box-shadow: 0 0 0 1px rgba(0, 30, 60, 3%), 0 3px 3px -1.5px rgba(0, 0, 0, 3%);
`;

const Panel: React.FC = (props) => {
  return <StyledPanel>{props.children}</StyledPanel>;
};
export default Panel;
