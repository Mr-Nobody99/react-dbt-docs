import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SearchResults_Wrapper = styled.div`
  padding-left: 30px;
  padding-right: 30px;

  margin: 0 4vw;

  overflow: auto;

  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 30, 60, 3%), 0 3px 3px -1.5px rgba(0, 0, 0, 3%);

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #c7c7c7;
    :hover {
      background: #888888;
    }
  }

  a {
    text-decoration: none;
    color: #313539;
  }
`;

const ResultItem = styled.div`
  display: block;
  color: inherit;
  text-decoration: none !important;
  padding: 15px 20px;
  margin: 0 -20px;
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 0;
`;

const StyledContent = styled.div`
  flex: 1 1 auto;
`;

const StyledHeader = styled.h4`
  font-size: 1em;
  margin-top: 0;
  margin-bottom: 0;

  span {
    margin-left: 10px;
    margin-right: 10px;
  }
  small {
    font-size: 65%;
    color: #8b969e;
  }
`;

const StyledDesc = styled.div`
  margin-top: 0;
  margin-bottom: 0;
`;

const StyledSqlTags = styled(StyledDesc)`
  color: #1c3c6d;
  font-size: 75%;
`;

const NextButton = styled.div`
  position: absolute;

  height: 1vw;
  margin-top: 10px;
  padding-top: 10px;

  right: 125px;
  bottom: 12px;
  cursor: pointer;
  &:hover {
    background: #edeff2;
  }
`;

const PrevButton = styled.div`
  position: absolute;
  height: 1vw;

  left: 30px;
  bottom: 12px;
  cursor: pointer;
  &:hover {
    background: #edeff2;
  }
`;

interface Props {
  searchString: string;
  searchResults: ManifestData[];
  setSearching: (value: boolean) => void;
}

const SearchResults: React.FC<Props> = ({ ...props }: Props) => {
  const shortenDesc = (desc: string) => {
    if (desc) {
      const rgx = new RegExp(props.searchString);
      const match = desc.search(rgx);
      const len = desc.length;

      const str = desc.slice(
        match - 75 >= 0 ? match - 75 : 0,
        match + 75 <= len ? match + 75 : len
      );

      return desc ? `...${str}...` : null;
    }

    return null;
  };

  const [pageIndex, setPageIndex] = useState(0);
  const maxPerPage = 25;
  let i = pageIndex * maxPerPage;
  const j =
    i + maxPerPage < props.searchResults.length
      ? i + maxPerPage
      : props.searchResults.length;

  return (
    <SearchResults_Wrapper>
      {props.searchResults.slice(i, maxPerPage).map((data) => (
        <Link
          to={`/${data.unique_id}`}
          key={data.unique_id}
          onClick={() => {
            props.setSearching(false);
          }}
        >
          <ResultItem>
            <ContentWrapper>
              <StyledContent>
                <StyledHeader>
                  <span> 🗐 </span> {data.name}{" "}
                  <small> {data.resource_type} </small>
                </StyledHeader>

                <StyledDesc>
                  {shortenDesc(data.description ? data.description : "")}
                </StyledDesc>

                <StyledSqlTags>
                  {shortenDesc("raw_sql" in data ? data.raw_sql : "")}
                </StyledSqlTags>

                <StyledSqlTags>
                  {`tags: ${data.tags?.join(", ")}`}
                </StyledSqlTags>
              </StyledContent>
            </ContentWrapper>
          </ResultItem>
        </Link>
      ))}
      {props.searchResults.length > 25 && pageIndex ? (
        <PrevButton
          onClick={() => {
            setPageIndex(pageIndex - 1);
          }}
        >
          {"<"}
        </PrevButton>
      ) : null}
      {props.searchResults.length > 25 &&
      j !== props.searchResults.length - 1 ? (
        <NextButton
          onClick={() => {
            setPageIndex(pageIndex + 1);
          }}
        >
          {">"}
        </NextButton>
      ) : null}
    </SearchResults_Wrapper>
  );
};

export default SearchResults;
