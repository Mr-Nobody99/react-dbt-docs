import styled from "styled-components";
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import Manifest from "../../classes/Manifest";
import Panel from "./components/Panel";
import Overview from "./components/Overview";
import { Switch, Route } from "react-router-dom";
import ModelView from "./components/model view/ModelView";
import SearchOptions from "./components/SearchOptions";
import SearchResults from "./components/SearchResults";

const Content_Header = styled.div`
  height: 3.5vh;
  padding: 20px 30px;
  background: #fff;
  box-shadow: 0 1px 0 rgb(0 0 0 /8%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Content_Body = styled.div<{ width: string }>`
  flex: 1 0;
  min-height: 0px;

  width: ${(props) => props.width};
  margin: auto;

  display: flex;
  flex-direction: column;

  h5 {
    color: #313539;
  }
`;

const Content_Scroll = styled.div`
  overflow: auto;
  padding-bottom: 20px;
`;

const Content_Wrapper = styled.div`
  flex: 1 0 0px;
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

interface Props {
  manifest?: Manifest;

  searchResults: ManifestData[];

  searchOptions: SearchOption;
  setSearchOptions: (value: SearchOption) => void;

  isSearching: boolean;
  setSearching: (value: boolean) => void;

  searchString: string;
  setSearchString: (value: string) => void;
}
const Content: React.FC<Props> = (props) => {
  const find_default_overview = () => {
    if (props.manifest?.Docs) {
      const overviews = [...props.manifest?.Docs.values()].filter(
        (doc) => doc.package_name !== "dbt" && doc.name === "__overview__"
      );

      if (overviews.length) {
        return overviews.pop() as Dbt_Manifest.ParsedDocumentation;
      }
      return props.manifest.Docs.get("dbt.__overview__");
    }
    return undefined;
  };
  const find_macro_refs = (macro: Dbt_Manifest.ParsedMacro): string[] => {
    const results: string[] = [];
    if (props.manifest) {
      [...props.manifest.Nodes.values()].forEach((node) => {
        if (node.depends_on?.macros?.includes(macro.unique_id)) {
          results.push(node.unique_id);
        }
      });
    }
    return results;
  };
  const [defaultOverview, set_default_overview] =
    useState<Dbt_Manifest.ParsedDocumentation>();
  if (defaultOverview === undefined) {
    const overview = find_default_overview();
    overview && set_default_overview(overview);
  }

  return (
    <Content_Wrapper>
      <Content_Header>
        <SearchBar
          isSearching={props.isSearching}
          setSearching={props.setSearching}
          searchString={props.searchString}
          setSearchString={props.setSearchString}
        />
      </Content_Header>
      {props.isSearching ? (
        <SearchOptions
          searchOptions={props.searchOptions}
          setSearchOptions={props.setSearchOptions}
          searchString={props.searchString}
          count={props.searchResults.length}
        />
      ) : null}

      <Content_Scroll>
        {props.isSearching && props.searchResults.length ? (
          <Content_Body width={"95%"}>
            <SearchResults
              searchResults={props.searchResults}
              searchString={props.searchString}
              setSearching={props.setSearching}
            />
          </Content_Body>
        ) : (
          <Switch>
            <Route exact path="/">
              <Content_Body width={"95%"}>
                <Panel>
                  <Overview doc_block={defaultOverview} />
                </Panel>
              </Content_Body>
            </Route>

            {props.manifest
              ? [...props.manifest.Docs.entries()].map(([k, v]) => (
                  <Route key={k} path={`/${v.unique_id}`}>
                    <Content_Body width={"90%"}>
                      <Panel>
                        <Overview doc_block={v} />
                      </Panel>
                    </Content_Body>
                  </Route>
                ))
              : null}

            {props.manifest
              ? [...props.manifest.Sources.values()].map((source) => (
                  <Route key={source.unique_id} path={`/${source.unique_id}`}>
                    <Content_Body width={"80%"}>
                      <ModelView
                        data={source}
                        setSearching={props.setSearching}
                        setSearchString={props.setSearchString}
                        setSearchOptions={props.setSearchOptions}
                        ref_by={props.manifest?.Child_Map?.get(
                          source.unique_id
                        )}
                      />
                    </Content_Body>
                  </Route>
                ))
              : null}

            {props.manifest
              ? [...props.manifest.Nodes.values()].map((node) => (
                  <Route key={node.unique_id} path={`/${node.unique_id}`}>
                    <Content_Body width={"80%"}>
                      <ModelView
                        data={node}
                        setSearching={props.setSearching}
                        setSearchString={props.setSearchString}
                        setSearchOptions={props.setSearchOptions}
                        ref_by={props.manifest?.Child_Map?.get(node.unique_id)}
                      />
                    </Content_Body>
                  </Route>
                ))
              : null}

            {props.manifest
              ? [...props.manifest.Macros.values()].map((macro) => (
                  <Route key={macro.unique_id} path={`/${macro.unique_id}`}>
                    <Content_Body width={"80%"}>
                      <ModelView
                        data={macro}
                        ref_by={find_macro_refs(macro)}
                        setSearching={props.setSearching}
                        setSearchString={props.setSearchString}
                        setSearchOptions={props.setSearchOptions}
                      />
                    </Content_Body>
                  </Route>
                ))
              : null}

            {props.manifest
              ? [...props.manifest.Exposures.values()].map((exposure) => (
                  <Route
                    key={exposure.unique_id}
                    path={`/${exposure.unique_id}`}
                  >
                    <Content_Body width={"80%"}>
                      <ModelView
                        data={exposure}
                        setSearching={props.setSearching}
                        setSearchString={props.setSearchString}
                        setSearchOptions={props.setSearchOptions}
                      />
                    </Content_Body>
                  </Route>
                ))
              : null}
          </Switch>
        )}
      </Content_Scroll>
    </Content_Wrapper>
  );
};

export default Content;
