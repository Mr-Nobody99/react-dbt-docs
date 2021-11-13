//@ts-ignore
import dir_icon from "../../../assets/dir_icon.svg";
//@ts-ignore
import dir_icon_open from "../../../assets/dir_icon_open.svg";
//@ts-ignore
import doc_icon from "../../../assets/doc_icon.svg";
//@ts-ignore
import doc_selected_icon from "../../../assets/doc_selected_icon.svg";

import Manifest from "../../../classes/Manifest";
import { Link } from "react-router-dom";
import styled from "styled-components";
import React, { useState } from "react";
import { TREE_MODE } from "../../App";

const Tree_Wrapper = styled.div`
  flex: 1 0;
  min-height: 0;
  min-width: 0;

  display: flex;
  flex-direction: column;

  overflow: auto;
  overflow-x: scroll;

  strong {
    color: #5e666c;
  }

  .icon {
    flex: 0 0 auto;
    margin-right: 8px;
    vertical-align: middle;
  }

  .sub-tree {
    padding-left: 10px;

    a {
      display: block;
      color: inherit;
      border-radius: 4px;
      padding-left: 0.5rem;
      :hover {
        background: #f0f2f4;
      }
    }

    .collapse-toggle {
      display: block;
      border-radius: 10px;
      user-select: none;
      cursor: pointer;
      padding-left: 0.5rem;
      border-radius: 4px;

      &:hover {
        color: #313539;
        background: #f0f2f4;
      }
    }
  }
`;

const Collapse = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 10px;
  height: ${(props) => (props.isOpen ? "auto" : "0")};
  overflow: ${(props) => (props.isOpen ? null : "hidden")};

  li:hover {
    color: #313539;
    background: #f0f2f4;
  }

  .tree-item-wrapper {
    display: flex;
    flex-direction: row;
  }
`;

interface SubTreeProps {
  tree: Tree;
  label: string;
  depth: number;
  isLink?: boolean;
  current_model: string;
  openTrees: Set<string>;
  toggleOpen: (id: string, toggle: boolean) => void;
}

const SubTree: React.FC<SubTreeProps> = (props) => {
  return (
    <div className="sub-tree">
      {props.isLink ? (
        <Link
          to={`${props.label}.__${props.label}__`}
          onClick={() => {
            props.toggleOpen(props.label, !props.openTrees.has(props.label));
          }}
        >
          <img
            width="16px"
            className="icon"
            src={props.openTrees.has(props.label) ? dir_icon_open : dir_icon}
          />
          {props.label}
        </Link>
      ) : (
        <span
          className="collapse-toggle"
          onClick={() => {
            props.toggleOpen(props.label, !props.openTrees.has(props.label));
          }}
        >
          <img
            width="16px"
            className="icon"
            src={props.openTrees.has(props.label) ? dir_icon_open : dir_icon}
          />
          {props.label}
        </span>
      )}
      <Collapse isOpen={props.openTrees.has(props.label)}>
        {[...props.tree.entries()].sort().map(([k, v]) =>
          v instanceof Map ? (
            <SubTree
              key={k}
              tree={v}
              label={k}
              depth={props.depth + 1}
              current_model={props.current_model}
              openTrees={props.openTrees}
              toggleOpen={props.toggleOpen}
            />
          ) : (
            <li key={k}>
              <Link to={`${v.unique_id}`}>
                <span className="tree-item-wrapper">
                  <span>
                    <img
                      width="16px"
                      className="icon"
                      src={
                        k === props.current_model ? doc_selected_icon : doc_icon
                      }
                    />
                  </span>
                  <span>{v.name}</span>
                </span>
              </Link>
            </li>
          )
        )}
      </Collapse>
    </div>
  );
};

/* ------------------------------------------------------- */

interface TreeProps {
  manifest?: Manifest;
  treeMode: TREE_MODE;
  current_model: string;
}

const Tree: React.FC<TreeProps> = (props) => {
  const [openTrees, setOpenTrees] = useState(new Set<string>());
  const toggleOpen = (label: string, toggle: boolean) => {
    const tmp = new Set(openTrees);
    toggle ? tmp.add(label) : tmp.delete(label);
    setOpenTrees(tmp);
  };

  const sourceTree = props.manifest?.Tree.get("sources");
  const exposureTree = props.manifest?.Tree.get("exposures");
  const projectTree = props.manifest?.Tree.get("projects");
  const db_tree = props.manifest?.DbTree;

  return (
    <Tree_Wrapper>
      {props.treeMode === TREE_MODE.PROJECT ? (
        <>
          {sourceTree?.size ? (
            <>
              <strong>Sources</strong>
              {[...sourceTree.entries()].map(([k, v]) =>
                v instanceof Map ? (
                  <SubTree
                    key={k}
                    label={k}
                    tree={v}
                    depth={0}
                    current_model={props.current_model}
                    openTrees={openTrees}
                    toggleOpen={toggleOpen}
                  />
                ) : (
                  <span key={k}>{v.name}</span>
                )
              )}
            </>
          ) : null}
          {exposureTree?.size ? (
            <>
              <strong>Exposures</strong>
              {[...exposureTree.entries()].map(([k, v]) =>
                v instanceof Map ? (
                  <SubTree
                    key={k}
                    label={k}
                    tree={v}
                    depth={0}
                    current_model={props.current_model}
                    openTrees={openTrees}
                    toggleOpen={toggleOpen}
                  />
                ) : (
                  <span key={k}>{v.name}</span>
                )
              )}
            </>
          ) : null}
          {projectTree?.size ? (
            <>
              <strong>Projects</strong>
              {[...projectTree.entries()].map(([k, v]) =>
                v instanceof Map ? (
                  <SubTree
                    key={k}
                    label={k}
                    isLink={props.manifest?.Docs.has(`${k}.__${k}__`)}
                    tree={v}
                    depth={0}
                    current_model={props.current_model}
                    openTrees={openTrees}
                    toggleOpen={toggleOpen}
                  >
                    k
                  </SubTree>
                ) : (
                  <span key={k}>{v.name}</span>
                )
              )}
            </>
          ) : null}
        </>
      ) : db_tree?.size ? (
        <>
          <strong>Tables and Views</strong>
          {[...db_tree.entries()].map(([k, v]) => (
            <SubTree
              key={k}
              label={k}
              tree={v}
              depth={0}
              current_model={props.current_model}
              openTrees={openTrees}
              toggleOpen={toggleOpen}
            />
          ))}
        </>
      ) : null}
    </Tree_Wrapper>
  );
};

export default Tree;
