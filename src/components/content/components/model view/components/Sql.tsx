import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prism-themes/themes/prism-ghcolors.css";

const Sql_Wrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);

  #sql-nav {
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 0;

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    box-shadow: 0 1px 0 rgb(0 30 60 / 8%);

    #to-clipboard {
      cursor: pointer;
      color: #00aaaa;
      margin-left: auto;
      text-decoration: none;
    }
  }

  pre {
    resize: vertical;
    border: none;
    overflow-x: auto;
    overflow-y: scroll;
  }
`;

const Nav_Item = styled.li<{ active: boolean }>`
  color: #313539;
  cursor: pointer;
  margin-right: 12px;
  padding-bottom: 10px;
  box-shadow: ${(props) => (props.active ? "0 1px #0bb" : null)};
`;

enum MODE {
  SOURCE,
  COMPILED,
}
interface Props {
  raw_sql?: string;
  compiled_sql?: string;
  macro_sql?: string;
}
const ModelSQL = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const [sqlMode, setSqlMode] = useState(MODE.SOURCE);
    const [clipTxt, setClipTxt] = useState("copy to clipboard");

    const code_ref = useRef(null as unknown as HTMLElement);
    useEffect(() => {
      Prism.highlightElement(code_ref.current);
    }, [sqlMode]);

    return (
      <div ref={ref}>
        <h5>SQL</h5>
        <Sql_Wrapper>
          <ul id="sql-nav">
            <Nav_Item
              active={sqlMode === MODE.SOURCE}
              onClick={() => {
                setSqlMode(MODE.SOURCE);
              }}
            >
              Source
            </Nav_Item>

            {props.raw_sql ? (
              <Nav_Item
                active={sqlMode === MODE.COMPILED}
                onClick={() => {
                  setSqlMode(MODE.COMPILED);
                }}
              >
                Compiled
              </Nav_Item>
            ) : null}

            <a
              id="to-clipboard"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    sqlMode === MODE.COMPILED && props.compiled_sql
                      ? props.compiled_sql
                      : props.raw_sql
                      ? props.raw_sql
                      : ""
                  )
                  .then(() => {
                    setClipTxt("copied");
                    setTimeout(() => {
                      setClipTxt("copy to clipboard");
                    }, 1000);
                  });
              }}
            >
              {clipTxt}
            </a>
          </ul>

          <pre className="line-numbers">
            <code ref={code_ref} className="language-sql">
              {props.macro_sql
                ? props.macro_sql
                : sqlMode === MODE.SOURCE
                ? props.raw_sql
                : props.compiled_sql}
            </code>
          </pre>
        </Sql_Wrapper>
      </div>
    );
  }
);

export default ModelSQL;
