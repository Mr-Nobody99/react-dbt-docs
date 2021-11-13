import React from "react";

interface TagsProps {
  tags: string[];
  setSearching: (value: boolean) => void;
  setSearchString: (value: string) => void;
  setSearchOptions: (value: SearchOption) => void;
}
const Tag_Links: React.FC<TagsProps> = (props) => {
  return (
    <>
      {props.tags.map((tag, i) => (
        <span
          key={tag}
          className="tag"
          onClick={() => {
            props.setSearchString(tag);
            props.setSearching(true);
            props.setSearchOptions({
              column: false,
              description: false,
              name: false,
              sql: false,
              tags: true,
            });
          }}
        >
          {" "}
          {tag}
          {i < props.tags.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
};

export default Tag_Links;
