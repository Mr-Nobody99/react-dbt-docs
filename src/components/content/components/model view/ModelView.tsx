import React from "react";
import Sql from "./components/Sql";
import Title from "./components/Title";
import Columns from "./components/columns table/Columns";
import Details from "./components/details/Details";
import Description from "./components/Description";
import ReferencedBy from "./components/ReferencedBy";
import DependsOn from "./components/DependsOn";
import Arguments from "./components/Arguments";
interface Props {
  data: ManifestData;
  ref_by?: string[];

  setSearching: (value: boolean) => void;
  setSearchString: (value: string) => void;
  setSearchOptions: (value: SearchOption) => void;
}
const ModelView: React.FC<Props> = (props) => {
  const descriptionRef = React.createRef<HTMLDivElement>();
  const detailsRef = React.createRef<HTMLDivElement>();
  const columnsRef = React.createRef<HTMLDivElement>();
  const refByRef = React.createRef<HTMLDivElement>();
  const depsRef = React.createRef<HTMLDivElement>();
  const argsRef = React.createRef<HTMLDivElement>();
  const sqlRef = React.createRef<HTMLDivElement>();

  return (
    <>
      <Title
        data={props.data}
        exposure_url={
          "url" in props.data && props.data.url ? props.data.url : undefined
        }
        detailsRef={detailsRef}
        descriptionRef={descriptionRef}
        columnsRef={columnsRef}
        refByRef={props.ref_by?.length ? refByRef : undefined}
        depsRef={
          "depends_on" in props.data && props.data.depends_on
            ? depsRef
            : undefined
        }
        argsRef={argsRef}
        sqlRef={sqlRef}
      />
      {props.data.resource_type !== "macro" &&
      props.data.resource_type !== "test" &&
      props.data.resource_type !== "analysis" ? (
        <Details
          ref={detailsRef}
          data={props.data}
          setSearching={props.setSearching}
          setSearchString={props.setSearchString}
          setSearchOptions={props.setSearchOptions}
        />
      ) : null}

      <Description ref={descriptionRef} model={props.data} docs_block={null} />

      {"columns" in props.data &&
      props.data.columns &&
      Object.values(props.data.columns).length ? (
        <Columns ref={columnsRef} columns={props.data.columns} />
      ) : "arguments" in props.data && props.data.arguments ? (
        <Arguments ref={argsRef} args={props.data.arguments} />
      ) : null}

      {props.ref_by?.length ? (
        <ReferencedBy ref={refByRef} ref_by={props.ref_by} />
      ) : null}

      {"depends_on" in props.data &&
      props.data.depends_on &&
      "nodes" in props.data.depends_on &&
      (props.data.depends_on.nodes?.length ||
        props.data.depends_on.macros?.length) ? (
        <DependsOn ref={depsRef} deps={props.data.depends_on as Deps} />
      ) : null}

      {"raw_sql" in props.data &&
      props.data.raw_sql &&
      "compiled_sql" in props.data &&
      props.data.compiled_sql ? (
        <Sql
          ref={sqlRef}
          raw_sql={props.data.raw_sql}
          compiled_sql={props.data.compiled_sql}
        />
      ) : "macro_sql" in props.data ? (
        <Sql ref={sqlRef} macro_sql={props.data.macro_sql} />
      ) : null}
    </>
  );
};

export default ModelView;
