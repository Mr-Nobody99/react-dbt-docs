import styled from "styled-components";
import React from "react";

const StyledLink = styled.a`
  text-decoration: none;
  font-weight: bold;
  line-height: 1.5;

  color: #fff;
  background: #0bb;

  border-radius: 4px;
  border-width: 0;

  height: 1.5rem;
  padding: 0.45rem 0.875rem;

  &:hover {
    background: #009595;
  }

  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);
`;

interface Props {
  exposure_url: string;
}
const ExposureButton: React.FC<Props> = (props) => {
  return <StyledLink href={props.exposure_url}>{props.children}</StyledLink>;
};
export default ExposureButton;
