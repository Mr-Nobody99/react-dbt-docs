import React from "react";
import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  cursor: pointer;
  border-collapse: collapse;
`;

const THead = styled.thead``;
const TBody = styled.tbody``;

const TH = styled.th`
  top: 0;
  position: sticky;
  color: #8b969e;
  font-weight: 500;
  text-align: left;
  font-size: 0.75rem;
  padding: 10px 20px;
  background: #ffffff;
  letter-spacing: 0.15em;
`;
const TR = styled.tr``;
const TD = styled.td`
  color: #313539;
  padding: 10px 20px;
`;

const Columns_Wrapper = styled.div`
  flex: 1 0;
  min-height: 50%;
  overflow: auto;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);
`;

interface Props {
  args: Dbt_Manifest.MacroArgument[];
}
const Arguments = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    return (
      <div ref={ref}>
        <h5>Arguments</h5>
        <Columns_Wrapper>
          <StyledTable>
            <THead>
              <TR>
                <TH>Argument</TH>
                <TH>TYPE</TH>
                <TH>DESCRIPTION</TH>
                <TH>More?</TH>
              </TR>
            </THead>
            <TBody>
              {props.args.map((arg) => (
                <TR key={arg.name}>
                  <TD>{arg.name}</TD>
                  <TD>{arg?.type || "Undefined"}</TD>
                  <TD>{arg.description}</TD>
                  <TD>...</TD>
                </TR>
              ))}
            </TBody>
          </StyledTable>
        </Columns_Wrapper>
      </div>
    );
  }
);
export default Arguments;
