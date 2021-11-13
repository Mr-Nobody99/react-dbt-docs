import React from "react";
import styled from "styled-components";

const GraphButton_Wrapper = styled.div`
  width: 4vw;
  height: 4vw;

  right: 2%;
  bottom: 2.5%;
  position: absolute;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 110%;

  width: 150%;
  margin-left: -35%;
  padding: 5px;
  background: #007699;
  border-radius: 4px;

  text-align: center;
  font-size: 0.9rem;
  line-height: 1.25rem;
  color: #fff;

  opacity: 0;
  ${GraphButton_Wrapper}:hover & {
    opacity: 100%;
  }
  transition: opacity 0.25s;

  &::after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #007699 transparent transparent transparent;
  }
`;

const Button = styled.button`
  cursor: pointer;
  user-select: none;

  display: flex;
  justify-content: center;

  width: 100%;
  height: 100%;

  font-size: 2.5vw;

  border: 0;
  border-radius: 50px;

  color: white;
  background: #0bb;

  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 20px 20px -10px rgb(0 0 0 / 20%);

  &:hover {
    background: #009595;
  }

  &:focus {
    outline: none !important;
  }
`;

interface Props {
  click_handler: () => void;
}
const GraphLauncher: React.FC<Props> = ({ ...props }: Props) => {
  return (
    <GraphButton_Wrapper>
      <Tooltip>View Lineage Graph</Tooltip>
      <Button onClick={props.click_handler}>⑆</Button>
    </GraphButton_Wrapper>
  );
};
export default GraphLauncher;
