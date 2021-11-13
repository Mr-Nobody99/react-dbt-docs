import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Nav_Item = styled.li<{ active: boolean }>`
  color: #313539;
  cursor: pointer;
  margin-right: 12px;
  padding-bottom: 10px;
  text-transform: capitalize;
  box-shadow: ${(props) => (props.active ? "0 1px #0bb" : null)};
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

const Ref_List = styled.ul`
  list-style: none;
  padding-left: 0;
  a {
    text-decoration: none;
    color: #0bb;
  }
`;

const ReferencedBy_Wrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);
`;

interface Props {
  deps: Deps;
}
const DependsOn = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const [depMap, setDepMap] = useState<Map<string, string[]>>(new Map());
    const [activeKey, setActiveKey] = useState("");

    useEffect(() => {
      const typeMap = new Map<string, string[]>();

      props.deps.nodes.forEach((id) => {
        const type = id.split(".")[0];
        !typeMap.has(type) && typeMap.set(type, []);
        typeMap.get(type)?.push(id);
      });

      props.deps.macros.length && typeMap.set("macros", props.deps.macros);

      setDepMap(typeMap);
      setActiveKey([...typeMap.keys()][0]);
    }, []);

    return (
      <div ref={ref}>
        <h5>Depends On</h5>
        <ReferencedBy_Wrapper>
          <Styled_Nav>
            {[...depMap.keys()].map((k) => (
              <Nav_Item
                key={k}
                active={activeKey === k}
                onClick={() => {
                  setActiveKey(k);
                }}
              >
                {k}
                {k[k.length - 1] === "s" ? "" : "s"}
              </Nav_Item>
            ))}
          </Styled_Nav>
          <Ref_List>
            {depMap.has(activeKey)
              ? [...(depMap.get(activeKey) as string[])].map((id) => (
                  <Link key={id} to={id}>
                    <li>{id.split(".").pop()}</li>
                  </Link>
                ))
              : null}
          </Ref_List>
        </ReferencedBy_Wrapper>
      </div>
    );
  }
);
export default DependsOn;
