import marked from "marked";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TestBadges from "./components/TestBadges";
import TestDetails from "./components/TestDetails";

const Columns_Wrapper = styled.div`
  flex: 1 0;
  overflow: hidden;
  min-height: 50%;
  border-radius: 4px;
  padding: 20px 30px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);

  table {
    width: 100%;
    cursor: pointer;
    border-collapse: collapse;
  }

  thead {
    background: #ffffff;
    position: sticky;
    top: 0;
  }

  th {
    color: #8b969e;

    text-align: left;
    font-weight: 500;
    font-size: 0.75rem;
    letter-spacing: 0.15em;

    padding: 0.6rem 1.25rem;
  }

  tr {
    &:hover {
      background: #f9fafb;
    }

    .text-centered {
      text-align: center;
    }
  }

  td {
    color: #313539;
    line-height: 1.6;
    vertical-align: top;
    padding: 0.6rem 1.25rem;
    max-width: 1px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    table {
      background: #f9fafb;
    }

    thead {
      background: inherit;
    }

    td {
      max-width: initial;
      overflow: initial;
      white-space: initial;
      text-overflow: initial;
    }
  }

  .no-hover:hover {
    background: inherit;
  }
`;

const Columns_Scroll = styled.div`
  max-height: 800px;
  overflow-y: scroll;
`;

const More_Wrapper = styled.div`
  margin-left: 20px;
  padding: 5px 20px;
  border-left: 1px solid #ccc;

  h5 {
    margin-bottom: 0.5em;
  }

  & :first-child {
    margin-top: 0;
  }
`;

interface DescriptionProps {
  description?: string;
}
const ColumnDescription: React.FC<DescriptionProps> = (props) => {
  const _ref = useRef<HTMLTableDataCellElement>(null);
  useEffect(() => {
    if (_ref.current) {
      _ref.current.innerHTML = marked(props.description || "");
    }
  });
  return <div ref={_ref}></div>;
};

interface TableRowProps {
  column: ColumnInfo;
}
const TableRow: React.FC<TableRowProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <td>{props.column.name}</td>
        <td>{props.column.data_type || "Undefined"}</td>
        <td>{!isOpen ? props.column.description : null}</td>
        <td className="text-centered">
          {!isOpen ? (
            props.column.tests ? (
              <TestBadges tests={props.column.tests} />
            ) : null
          ) : null}
        </td>
        <td className="text-centered">{isOpen ? "^" : ">"}</td>
      </tr>
      {isOpen ? (
        <tr className="no-hover">
          <td colSpan={5}>
            <More_Wrapper>
              {props.column.description ? (
                <>
                  <h5>Description</h5>
                  <ColumnDescription description={props.column.description} />
                </>
              ) : null}

              {(props.column?.tests as TestInfo[])?.length ? (
                <>
                  <h5>Tests</h5>
                  <TestDetails
                    tests={
                      props.column.tests
                        ? (props.column.tests as TestInfo[])
                        : ([] as TestInfo[])
                    }
                  />
                </>
              ) : null}
            </More_Wrapper>
          </td>
        </tr>
      ) : null}
    </>
  );
};

interface Props {
  columns: { [key: string]: ColumnInfo };
}
const ModelColumns = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    return (
      <div ref={ref}>
        <h5>Columns</h5>
        <Columns_Wrapper>
          <Columns_Scroll>
            <table>
              <thead>
                <tr>
                  <th>COLUMN</th>
                  <th>TYPE</th>
                  <th>DESCRIPTION</th>
                  <th style={{ width: "1px" }}>TESTS</th>
                  <th style={{ width: "1px" }}>MORE?</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(props.columns)
                  .sort((a, b) => (a.index && b.index ? a.index - b.index : 0))
                  .map((col) => (
                    <TableRow key={col.name} column={col} />
                  ))}
              </tbody>
            </table>
          </Columns_Scroll>
        </Columns_Wrapper>
      </div>
    );
  }
);
export default ModelColumns;
