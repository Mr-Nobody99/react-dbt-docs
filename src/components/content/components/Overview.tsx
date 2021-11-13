import styled from "styled-components";
import React, { useEffect, useRef } from "react";

const StyledOverview = styled.div`
  color: #313539;
  code {
    background: #e7e7e7;
  }
  a {
    color: #0aa;
    text-decoration: none;
  }
`;

interface Props {
  doc_block?: Dbt_Manifest.ParsedDocumentation;
}
const Overview: React.FC<Props> = (props) => {
  const _ref = useRef(null as unknown as HTMLDivElement);
  useEffect(() => {
    if (_ref.current && props.doc_block !== undefined) {
      _ref.current.innerHTML = props.doc_block.block_contents;
    }
  });
  return <StyledOverview ref={_ref} />;
};
export default Overview;
