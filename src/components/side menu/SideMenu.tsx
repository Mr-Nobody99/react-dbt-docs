//@ts-ignore
import logo from "../../assets/logo.svg";
import styled from "styled-components";
import React, { useState } from "react";
import OverviewButton from "./components/OverviewButton";
import DatabaseSwitch from "./components/DatabaseSwitch";
import Manifest from "../../classes/Manifest";
import Tree from "./components/Tree";
import { TREE_MODE } from "../App";

const SideMenu_Header = styled.div`
  height: 3.5vh;
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 1px 0 rgb(0 0 0 /8%);
`;

const SideMenu_Body = styled.div`
  padding-bottom: 20px;
  padding-left: 30px;
  padding-top: 20px;

  flex: 1 0;
  min-height: 0;

  display: flex;
  flex-direction: column;
`;

const SideMenu_Wrapper = styled.div`
  position: relative;
  flex: 0 0 auto;

  width: 20%;
  min-width: 300px;

  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;
  }
`;
interface Props {
  manifest?: Manifest;
  treeMode: TREE_MODE;
  current_model: string;
  setTreeMode: (value: TREE_MODE) => void;
}
const SideMenu: React.FC<Props> = (props) => {
  return (
    <SideMenu_Wrapper>
      <SideMenu_Header>
        <img src={logo} width="100px" />
      </SideMenu_Header>

      <SideMenu_Body>
        <OverviewButton />
        <DatabaseSwitch
          treeMode={props.treeMode}
          setTreeMode={props.setTreeMode}
        />
        <Tree
          manifest={props.manifest}
          treeMode={props.treeMode}
          current_model={props.current_model}
        />
      </SideMenu_Body>
    </SideMenu_Wrapper>
  );
};
export default SideMenu;
