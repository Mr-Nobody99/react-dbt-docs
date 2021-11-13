import manifestPath from "./../data/manifest.json";
import catalogPath from "./../data/catalog.json";

import { HashRouter as Router } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SideMenu from "./side menu/SideMenu";
import Content from "./content/Content";
import Manifest from "../classes/Manifest";
import GraphManager from "../classes/GraphManager";
import GraphEditor from "./graph editor/GraphEditor";
import GraphLauncher from "./graph editor/components/GraphLauncher";
import MiniGraph from "./graph editor/MiniGraph";

const App_Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
`;

enum GRAPH_MODE {
  CLOSED,
  SMALL,
  FULL,
}

export enum TREE_MODE {
  PROJECT,
  DATABASE,
}

const App: React.FC = () => {
  const [manifest, setManifest] = useState<Manifest>();
  const [treeMode, setTreeMode] = useState(TREE_MODE.PROJECT);

  const [graphManager, setGraphManager] = useState<GraphManager>();
  const [graphMode, setGraphMode] = useState(GRAPH_MODE.CLOSED);
  const [graphFilter, setGraphFilter] = useState<GraphFilter>({
    select: "",
    exclude: "",
    tags: new Set(manifest?.tags),
    packages: new Set(manifest?.packages),
    resources: new Set([
      "model",
      "seed",
      "snapshot",
      "source",
      "test",
      "analysis",
      "exposure",
    ]),
  });

  const [isSearching, setSearching] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<ManifestData[]>([]);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    column: false,
    description: false,
    name: true,
    sql: false,
    tags: false,
  });

  const [currentModel, setCurrentModel] = useState(
    window.location.hash.slice(2)
  );

  window.onhashchange = (e) => {
    const hash = window.location.hash.slice(2);
    hash === "" && clearGraphFilter();
    setCurrentModel(hash);
  };

  const updateGraphFilter = (arg: Partial<GraphFilter>) => {
    const newFilter = { ...graphFilter, ...arg };
    setGraphFilter(newFilter);
    if (graphManager) {
      graphManager.updateFilter(newFilter);
    }
  };
  const applyGraphFilter = () => {
    if (graphManager) {
      graphManager.applyFilter();
    }
  };
  const clearGraphFilter = () => {
    if (graphManager) {
      const f: GraphFilter = {
        select: "",
        exclude: "",
        tags: new Set(manifest?.tags),
        packages: new Set(manifest?.packages),
        resources: new Set([
          "model",
          "seed",
          "snapshot",
          "source",
          "test",
          "analysis",
          "exposure",
        ]),
      };
      setGraphFilter(f);
      updateGraphFilter(f);
      applyGraphFilter();
    }
  };

  useEffect(() => {
    (async () => {
      const raw_manifest = await fetch(`${manifestPath}`).then((res) =>
        res.json()
      );
      const raw_catalog = await fetch(`${catalogPath}`).then((res) =>
        res.json()
      );

      const _manifest = new Manifest(
        raw_manifest as Dbt_Manifest.ManifestSchema,
        raw_catalog as CatalogSchema
      );

      console.log(_manifest);

      const _graphManager = new GraphManager(_manifest);

      setManifest(_manifest);
      setGraphManager(_graphManager);
      updateGraphFilter({
        packages: _manifest.packages,
        tags: _manifest.tags,
      });
    })();
  }, []);

  useEffect(() => {
    if (manifest && searchString) {
      const rgx = new RegExp(searchString, "i");
      setSearchResults(
        [
          ...manifest.Nodes.values(),
          ...manifest.Macros.values(),
          ...manifest.Sources.values(),
          ...manifest.Exposures.values(),
        ].filter(
          (data) =>
            (searchOptions.name && rgx.test(data.name)) ||
            (searchOptions.description &&
              data.description &&
              rgx.test(data.description)) ||
            (searchOptions.tags && data.tags?.some((tag) => rgx.test(tag))) ||
            (searchOptions.sql &&
              "compiled_sql" in data &&
              data.compiled_sql &&
              rgx.test(data.compiled_sql)) ||
            (searchOptions.column &&
              "columns" in data &&
              data.columns &&
              Object.keys(data.columns).some((col) => rgx.test(col)))
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchString, searchOptions]);

  return (
    <Router>
      <App_Wrapper>
        <SideMenu
          manifest={manifest}
          treeMode={treeMode}
          current_model={currentModel}
          setTreeMode={setTreeMode}
        />
        <Content
          manifest={manifest}
          searchResults={searchResults}
          searchOptions={searchOptions}
          setSearchOptions={setSearchOptions}
          isSearching={isSearching}
          setSearching={setSearching}
          searchString={searchString}
          setSearchString={setSearchString}
        />
        {graphMode === GRAPH_MODE.CLOSED ? (
          <GraphLauncher
            click_handler={() => {
              currentModel
                ? setGraphMode(GRAPH_MODE.SMALL)
                : setGraphMode(GRAPH_MODE.FULL);
            }}
          />
        ) : graphMode === GRAPH_MODE.FULL ? (
          <GraphEditor
            manager={graphManager}
            currentModel={currentModel}
            filter={graphFilter}
            updateFilter={updateGraphFilter}
            applyFilter={applyGraphFilter}
            clearFilter={clearGraphFilter}
            tag_list={manifest?.tags ? [...manifest.tags] : []}
            package_list={manifest?.packages ? [...manifest.packages] : []}
            minimize={() => {
              setGraphMode(GRAPH_MODE.SMALL);
            }}
            closeGraph={() => {
              setGraphMode(GRAPH_MODE.CLOSED);
            }}
          />
        ) : (
          <MiniGraph
            manager={graphManager}
            currentModel={currentModel}
            applyFilter={applyGraphFilter}
            updateFilter={updateGraphFilter}
            maxamize={() => {
              setGraphMode(GRAPH_MODE.FULL);
            }}
            closeFunc={() => {
              setGraphMode(GRAPH_MODE.CLOSED);
            }}
          />
        )}
      </App_Wrapper>
    </Router>
  );
};
export default App;
