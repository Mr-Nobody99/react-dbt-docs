import styled from "styled-components";
import React from "react";
import CloseButton from "./components/CloseButton";
import Select from "./components/Select";
import Exclude from "./components/Exclude";
import Resources from "./components/Resources";
import Packages from "./components/Packages";
import Tags from "./components/Tags";
import UpdateButton from "./components/UpdateButton";

const Toolbar_Wrapper = styled.div`
  width: 95%;
  display: flex;
  align-items: flex-end;
  background: #00475c;
`;

interface Props {
  package_list: string[];
  tag_list: string[];

  filter: GraphFilter;
  applyFilter: () => void;
  updateFilter: (arg: Partial<GraphFilter>) => void;

  closeFunc: () => void;
}
const ToolBar: React.FC<Props> = (props) => {
  return (
    <Toolbar_Wrapper>
      <Resources
        activeSelection={props.filter.resources}
        updateSelection={(arg: Set<string>) => {
          props.updateFilter({ resources: arg });
        }}
      />
      <Packages
        activeSelection={props.filter.packages}
        updateSelection={(arg: Set<string>) => {
          props.updateFilter({ packages: arg });
        }}
        package_list={props.package_list}
      />
      <Tags
        activeSelection={props.filter.tags}
        updateSelection={(arg: Set<string>) => {
          props.updateFilter({ tags: arg });
        }}
        tag_list={props.tag_list}
      />
      <Select
        activeSelect={props.filter.select}
        updateFilter={props.updateFilter}
      />
      <Exclude
        activeExclude={props.filter.exclude}
        updateFilter={props.updateFilter}
      />
      <UpdateButton
        onClick={() => {
          props.applyFilter();
        }}
      >
        Update Graph
      </UpdateButton>
      <CloseButton onClick={props.closeFunc}>X</CloseButton>
    </Toolbar_Wrapper>
  );
};

export default ToolBar;
