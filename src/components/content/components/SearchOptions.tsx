import React from "react";
import styled from "styled-components";

const SearchOptionsWrapper = styled.div`
  margin: 0 10%;
  padding-bottom: 10px;
  /* padding-left: 30px; */
  /* padding-right: 30px; */
`;

const StyledHeader = styled.h1`
  margin: 0;
  font-size: 1.5em;
  span {
    /* margin-left: 10px; */
    margin-right: 10px;
  }
  small {
    font-size: 65%;
    color: #8b969e;
  }
`;

const StyledFilterLabel = styled.label`
  margin-right: 25px;
`;

const StyledFilterInput = styled.input`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 5px;
`;

interface Props {
  count: number;
  searchString: string;
  searchOptions: SearchOption;
  setSearchOptions: (value: SearchOption) => void;
}

const SearchOptions: React.FC<Props> = ({ ...props }: Props) => {
  return (
    <SearchOptionsWrapper>
      <StyledHeader>
        <span> {props.searchString} </span>
        <small>
          <span>{props.count}</span>
          search results
        </small>
      </StyledHeader>

      <StyledFilterLabel>
        Name:
        <StyledFilterInput
          name="name"
          type="checkbox"
          checked={props.searchOptions.name}
          onChange={(e) => {
            props.setSearchOptions({
              ...props.searchOptions,
              name: e.target.checked,
            });
          }}
        />
      </StyledFilterLabel>

      <StyledFilterLabel>
        Description:
        <StyledFilterInput
          type="checkbox"
          name="description"
          checked={props.searchOptions.description}
          onChange={(e) => {
            props.setSearchOptions({
              ...props.searchOptions,
              description: e.target.checked,
            });
          }}
        />
      </StyledFilterLabel>

      <StyledFilterLabel>
        Column:
        <StyledFilterInput
          name="column"
          type="checkbox"
          checked={props.searchOptions.column}
          onChange={(e) => {
            props.setSearchOptions({
              ...props.searchOptions,
              column: e.target.checked,
            });
          }}
        />
      </StyledFilterLabel>
      <StyledFilterLabel>
        SQL:
        <StyledFilterInput
          type="checkbox"
          name="sql"
          checked={props.searchOptions.sql}
          onChange={(e) => {
            props.setSearchOptions({
              ...props.searchOptions,
              sql: e.target.checked,
            });
          }}
        />
      </StyledFilterLabel>
      <StyledFilterLabel>
        Tags:
        <StyledFilterInput
          type="checkbox"
          name="tags"
          checked={props.searchOptions.tags}
          onChange={(e) => {
            props.setSearchOptions({
              ...props.searchOptions,
              tags: e.target.checked,
            });
          }}
        />
      </StyledFilterLabel>
    </SearchOptionsWrapper>
  );
};

export default SearchOptions;
