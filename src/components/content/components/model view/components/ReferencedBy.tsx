import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Nav_Item = styled.li<{ active: boolean }>`
  color: #313539;
  cursor: pointer;
  margin-right: 12px;
  padding-bottom: 10px;
  box-shadow: ${(props) => (props.active ? "0 1px #0bb" : null)};
  text-transform: capitalize;
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
  ref_by: string[];
}
const ReferencedBy = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const [refMap, setRefMap] = useState<Map<string, string[]>>(new Map());
    const [activeKey, setActiveKey] = useState("");

    useEffect(() => {
      const temp: Map<string, string[]> = new Map();
      props.ref_by.forEach((str) => {
        const type = str.split(".")[0];
        !temp.has(type) && temp.set(type, []);
        temp.get(type)?.push(str);
      });
      setRefMap(temp);
      setActiveKey([...temp.keys()][0]);
    }, []);

    return (
      <div ref={ref}>
        <h5>Referenced By</h5>
        <ReferencedBy_Wrapper>
          <Styled_Nav>
            {[...refMap.keys()].map((k) => (
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
            {refMap.has(activeKey)
              ? [...(refMap.get(activeKey) as string[])].map((id) => (
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
export default ReferencedBy;
