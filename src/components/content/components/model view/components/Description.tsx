import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import marked from "marked";

const Wrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);

  color: #5e666c;
`;

interface Props {
  docs_block: Dbt_Manifest.ParsedDocumentation | null;
  model: ManifestData;
}
const Description = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const doc_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (props.docs_block !== undefined && doc_ref.current) {
        const description = props.docs_block?.block_contents
          ? marked(props.docs_block.block_contents)
          : props.model.description
          ? marked(props.model.description)
          : `This ${props.model.resource_type} is not currently documented.`;

        doc_ref.current.innerHTML = description;
      }
    });

    return (
      <div ref={ref}>
        <h5>Description</h5>
        <Wrapper>
          <div ref={doc_ref}></div>
        </Wrapper>
      </div>
    );
  }
);
export default Description;
