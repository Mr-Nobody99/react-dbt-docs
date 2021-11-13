//@ts-ignore
import logo from "../../../assets/logo.svg";
import styled from "styled-components";
import React from "react";

const Logo_Wrapper = styled.div`
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 1px 0 rgb(0 16 32 /5%);
`;

const Logo: React.FC = (props) => {
  return (
    <Logo_Wrapper>
      <img src={logo} width="100px" />
    </Logo_Wrapper>
  );
};

export default Logo;
