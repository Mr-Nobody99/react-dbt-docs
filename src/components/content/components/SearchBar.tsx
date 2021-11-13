import styled from "styled-components";
import React, { useEffect, useState } from "react";

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: x-large;
  margin-left: 10px;
  color: inherit;
`;

const StyledInput = styled.input`
  width: 80%;
  height: 1.8rem;

  line-height: 1.6;

  padding: 0.2rem 1.25rem;

  border: none;
  border-radius: 4px;

  color: #484e53;
  background: rgb(240, 242, 244);

  &:hover {
    background: #e9ebef;
  }

  &:focus {
    outline: none;
    background: #fff;
    border-color: transparent;
    box-shadow: 0 0 0 1px #0bb, 0 15px 15px -7.5px rgb(0 0 0 / 15%);
  }

  transition: all 0.25s cubic-bezier(0.25, 0, 0, 1);
`;

interface Props {
  isSearching: boolean;
  setSearching: (value: boolean) => void;

  searchString: string;
  setSearchString: (value: string) => void;
}

const SearchBar: React.FC<Props> = (props) => {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    if (buffer.length) {
      clearTimeout(timer);
      setTimer(
        window.setTimeout(() => {
          props.setSearchString(buffer.pop() || "");
          setBuffer([]);
        }, 500)
      );
    }
  }, [buffer]);

  return (
    <>
      <StyledInput
        placeholder="Search For Models..."
        value={
          buffer.length === 0 ? props.searchString : buffer.slice(-1).pop()
        }
        onFocus={() => {
          props.setSearching(true);
        }}
        onChange={(e) => {
          setBuffer([...buffer, e.target.value]);
        }}
      />
      {props.isSearching ? (
        <CloseButton
          onClick={() => {
            props.setSearching(false);
          }}
        >
          x
        </CloseButton>
      ) : null}
    </>
  );
};

export default SearchBar;
