import styled from "styled-components";
import React, { RefObject, useState } from "react";
import ExposureButton from "./ExposureButton";

const StyledHeader = styled.h1`
  font-size: 1.5em;
  margin-top: 0;
  span {
    color: #313539;
    margin-right: 10px;
  }
  small {
    font-size: 50%;
    color: #8b969e;
  }
`;

const Header_Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Styled_Nav = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 0;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  box-shadow: 0 1px 0 rgb(0 30 60 / 8%);
`;

const Scroll_To = styled.li<{ active: boolean }>`
  color: #0bb;
  cursor: pointer;
  margin-right: 12px;
  padding-bottom: 10px;
  box-shadow: ${(props) => (props.active ? "0 1px #0bb" : null)};
`;

const Title_Wrapper = styled.div`
  top: 0px;
  z-index: 5;
  padding-top: 20px;
  position: sticky;
  height: fit-content;
  width: 100%;
  background-color: #f9fafb;
`;

enum SCROLL_TO {
  NONE = 1,
  DETAILS,
  DESCRTPTION,
  COLUMNS,
  ARGUMENTS,
  REFS,
  DEPS,
  SQL,
}
interface Props {
  data: ManifestData;
  exposure_url?: string;
  descriptionRef: RefObject<HTMLDivElement>;
  detailsRef: RefObject<HTMLDivElement>;
  columnsRef: RefObject<HTMLDivElement>;
  refByRef?: RefObject<HTMLDivElement>;
  depsRef?: RefObject<HTMLDivElement>;
  argsRef: RefObject<HTMLDivElement>;
  sqlRef: RefObject<HTMLDivElement>;
}
const Title: React.FC<Props> = (props) => {
  const [activeScroll, setActiveScroll] = useState(SCROLL_TO.NONE);
  return (
    <Title_Wrapper>
      <Header_Wrapper>
        <StyledHeader>
          <span>
            {props.data.resource_type === "macro"
              ? `${props.data.package_name}.${props.data.name}`
              : props.data.name}
          </span>
          <small>
            {props.data.resource_type !== "model"
              ? props.data.resource_type
              : "config" in props.data
              ? props.data.config?.materialized
              : null}
          </small>
        </StyledHeader>
        {props.exposure_url ? (
          <ExposureButton exposure_url={props.exposure_url}>
            View This Exposure
          </ExposureButton>
        ) : null}
      </Header_Wrapper>

      <Styled_Nav>
        {props.data.resource_type !== "macro" ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.DETAILS}
            onClick={() => {
              props.descriptionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
              setActiveScroll(SCROLL_TO.DETAILS);
            }}
          >
            Details
          </Scroll_To>
        ) : null}
        <Scroll_To
          active={activeScroll === SCROLL_TO.DESCRTPTION}
          onClick={() => {
            props.descriptionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
            setActiveScroll(SCROLL_TO.DESCRTPTION);
          }}
        >
          Description
        </Scroll_To>

        {"columns" in props.data && props.data.columns ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.COLUMNS}
            onClick={() => {
              props.columnsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
              setActiveScroll(SCROLL_TO.COLUMNS);
            }}
          >
            Columns
          </Scroll_To>
        ) : "arguments" in props.data && props.data.arguments ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.ARGUMENTS}
            onClick={() => {
              props.argsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              setActiveScroll(SCROLL_TO.ARGUMENTS);
            }}
          >
            Arguments
          </Scroll_To>
        ) : null}

        {props.refByRef ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.REFS}
            onClick={() => {
              props.refByRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setActiveScroll(SCROLL_TO.REFS);
            }}
          >
            Referenced By
          </Scroll_To>
        ) : null}

        {props.depsRef ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.DEPS}
            onClick={() => {
              props.depsRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setActiveScroll(SCROLL_TO.DEPS);
            }}
          >
            Depends On
          </Scroll_To>
        ) : null}

        {("raw_sql" in props.data && props.data.raw_sql) ||
        ("compiled_sql" in props.data && props.data.compiled_sql) ||
        ("macro_sql" in props.data && props.data.macro_sql) ? (
          <Scroll_To
            active={activeScroll === SCROLL_TO.SQL}
            onClick={() => {
              props.sqlRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              setActiveScroll(SCROLL_TO.SQL);
            }}
          >
            Sql
          </Scroll_To>
        ) : null}
      </Styled_Nav>
    </Title_Wrapper>
  );
};

export default Title;
