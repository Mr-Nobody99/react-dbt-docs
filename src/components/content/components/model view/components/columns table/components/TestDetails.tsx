import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";

const TestDetails_Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #5e666c;
  h5 {
    margin-top: 0;
  }
  span {
    color: #8b969e;
  }
  a {
    text-decoration: none;
    color: #00aaaa;
  }
  .accepted-values {
    color: #8b969e;
  }
`;

interface Props {
  tests: TestInfo[];
}
const TestDetails: React.FC<Props> = (props) => {
  return (
    <TestDetails_Wrapper>
      {props.tests.map((test) => {
        switch (test.test_type) {
          case "unique":
            return <span key={test.test_type}>Unique</span>;
          case "not_null":
            return <span key={test.test_type}>Not Null</span>;
          case "relationships":
            return (
              <span key={test.test_type}>
                Foreign Key to{" "}
                <Link to={`/${test.target_id}`}>{test.target_name}</Link> on{" "}
                <code>{test.column}</code>
              </span>
            );
          case "accepted_values":
            return (
              <span key={test.test_type} className="accepted-values">
                Accepted Values: {test.values?.join(", ")}
              </span>
            );

          default:
            break;
        }
      })}
    </TestDetails_Wrapper>
  );
};

export default TestDetails;
