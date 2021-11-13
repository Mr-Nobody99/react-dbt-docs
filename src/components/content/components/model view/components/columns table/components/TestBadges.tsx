import styled from "styled-components";
import React from "react";

const TestBadges_Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  span {
    color: #8b969e;
  }
`;

interface Props {
  tests: TestInfo[];
}
const TestBadges: React.FC<Props> = (props) => {
  return (
    <TestBadges_Wrapper>
      {props.tests.map((test) => {
        switch (test.test_type) {
          case "unique":
            return <span key={test.test_type}>U</span>;
          case "not_null":
            return <span key={test.test_type}>N</span>;
          case "accepted_values":
            return <span key={test.test_type}>A</span>;
          case "relationships":
            return <span key={test.test_type}>F</span>;
          default:
            return null;
        }
      })}
    </TestBadges_Wrapper>
  );
};
export default TestBadges;
