import marked from "marked";

class Manifest {
  private _Docs: Map<string, Dbt_Manifest.ParsedDocumentation>;
  public get Docs(): Map<string, Dbt_Manifest.ParsedDocumentation> {
    return this._Docs;
  }
  private _Tree: Manifest_Tree = new Map();
  public get Tree(): Manifest_Tree {
    return this._Tree;
  }

  private _DbTree: Database_Tree = new Map();
  public get DbTree(): Database_Tree {
    return this._DbTree;
  }

  private _packages = new Set<string>();
  public get packages(): Set<string> {
    return this._packages;
  }

  private _tags = new Set<string>();
  public get tags(): Set<string> {
    return this._tags;
  }

  private _Nodes: Map<string, ManifestNode>;
  public get Nodes(): Map<string, ManifestNode> {
    return this._Nodes;
  }

  private _Sources: Map<string, ParsedSourceDefinition>;
  public get Sources(): Map<string, ParsedSourceDefinition> {
    return this._Sources;
  }

  private _Macros: Map<string, Dbt_Manifest.ParsedMacro>;
  public get Macros(): Map<string, Dbt_Manifest.ParsedMacro> {
    return this._Macros;
  }

  private _Exposures: Map<string, Dbt_Manifest.ParsedExposure>;
  public get Exposures(): Map<string, Dbt_Manifest.ParsedExposure> {
    return this._Exposures;
  }

  private _Parent_Map?: Map<string, string[]>;
  public get Parent_Map(): Map<string, string[]> | undefined {
    return this._Parent_Map;
  }

  private _Child_Map?: Map<string, string[]>;
  public get Child_Map(): Map<string, string[]> | undefined {
    return this._Child_Map;
  }

  constructor(
    raw_manifest: Dbt_Manifest.ManifestSchema,
    raw_catalog: CatalogSchema
  ) {
    // Function used to recursivly construct file tree from file path
    const recurse_path = (
      node: ManifestNode | Dbt_Manifest.ParsedMacro,
      tree: Tree,
      path: string[],
      dir_index = 0
    ): void => {
      const dir = path[dir_index];

      if (dir_index < path.length - 1) {
        !tree.has(dir) && tree.set(dir, new Map());
        const nextTree = tree.get(dir) as Tree;

        recurse_path(node, nextTree, path, dir_index + 1);
      } else {
        tree.set(node.unique_id, node);
      }
    };

    const merge_catalog_data = <T extends RawManifestNode | RawManifestSource>(
      target: "nodes" | "sources",
      itemsToMerge: Map<string, T>
    ) => {
      // Function used to extract stats
      const add_stats = (data: T & { stats?: Map<string, StatsItem> }) => {
        const catalog_data = raw_catalog[target][data.unique_id];
        if (catalog_data) {
          const has_stats = catalog_data.stats["has_stats"];
          if (has_stats && has_stats.value) {
            data.stats = new Map(
              Object.entries(catalog_data.stats).filter(
                ([k, _]) => k !== "has_stats"
              )
            );
          }
        }
      };
      // Function used to extract schema tests
      const add_schema_tests = (data: T) => {
        if (raw_manifest.child_map) {
          raw_manifest.child_map[data.unique_id].forEach((id) => {
            if (id in raw_manifest.nodes) {
              const node = raw_manifest.nodes[id];
              if (
                node.resource_type === "test" &&
                node.tags?.includes("schema")
              ) {
                const test = node as ParsedSchemaTestNode;
                const testType = test.test_metadata.name;
                const testColumn = test.column_name;

                if (data.columns) {
                  for (const [key, column] of Object.entries(data.columns)) {
                    if (column.name === testColumn) {
                      let skip = false;
                      const testData: TestInfo = {
                        column: testColumn,
                        test_type: testType,
                      };
                      switch (testType) {
                        case "relationships":
                          {
                            testData.from = node.unique_id;
                            if (test.test_metadata.kwargs) {
                              const match = (
                                test.test_metadata.kwargs["to"] as string
                              ).match(/ref\('(\w+)'\)/);

                              if (match) {
                                const target = match[1];
                                if (target !== data.name) {
                                  Object.entries(raw_manifest.nodes).forEach(
                                    ([key, node]) => {
                                      if (node.name === target) {
                                        testData.target_name = target;
                                        testData.target_id = key;
                                      }
                                    }
                                  );
                                } else {
                                  skip = true;
                                }
                              }
                            }
                          }
                          break;

                        case "accepted_values":
                          if (test.test_metadata.kwargs) {
                            const values = test.test_metadata.kwargs[
                              "values"
                            ] as string[];
                            if (values) {
                              testData.values = values;
                            }
                          }

                        default:
                          break;
                      }
                      if (!skip) {
                        if (data.columns[key].tests === undefined) {
                          data.columns[key].tests = [];
                        }
                        (data.columns[key] as ColumnInfo).tests?.push(testData);
                      }
                    }
                  }
                }
              }
            }
          });
        }
      };
      // Function used to merge column data from manifest and catalog
      const merge_column_data = (data: T) => {
        if (data.columns && data.unique_id in raw_catalog[target]) {
          const data_columns = data.columns;
          const catalog_columns = raw_catalog[target][data.unique_id].columns;
          const merged_columns: Map<string, ColumnInfo> = new Map(
            Object.entries(catalog_columns).map(([key, column]) => {
              const column_id = key.toLowerCase();
              switch (column_id in data_columns) {
                case true: {
                  const catalog_column = catalog_columns[key];
                  return [
                    column_id,
                    {
                      ...data_columns[column_id],
                      data_type: catalog_column.type,
                      index: catalog_column.index,
                    } as ColumnInfo,
                  ];
                }
                case false:
                  return [
                    column_id,
                    {
                      name: column.name.toLowerCase(),
                      data_type: column.type,
                      tags: ["untagged"],
                      index: column.index,
                    },
                  ];
              }
            })
          );
          const merge_results: { [key: string]: ColumnInfo } = {};
          merged_columns.forEach(
            (column, key) => (merge_results[key] = column)
          );
          (data as MergedNodeOrSource<T>).columns = merge_results;
        }
      };
      // Function used to merge catalog meta and manifest meta
      const merge_metadata = (data: T) => {
        const catalog_data = raw_catalog[target][data.unique_id];
        if (catalog_data) {
          const catalog_meta = catalog_data.metadata;
          (data as MergedNodeOrSource<T>).catalog_meta = catalog_meta;
          //   const merged_metadata = {
          //     ...data.meta,
          //     ...catalog_meta,
          // };
          //   data.meta = merged_metadata;
        }
      };

      itemsToMerge.forEach((item) => {
        merge_metadata(item);
        merge_column_data(item);
        add_schema_tests(item);
        add_stats(item);
      });

      return itemsToMerge as MergeCatalogResult<T>;
    };

    /* ---------------------------- Extract Docs ------------------------------*/
    this._Docs = new Map(
      Object.entries(raw_manifest.docs).map(([k, v]) => [
        k,
        { ...v, block_contents: marked(v.block_contents) },
      ])
    );

    /* ---------------------------- Extract Nodes ------------------------------*/
    this._Nodes = merge_catalog_data(
      "nodes",
      new Map(Object.entries(raw_manifest.nodes))
    );

    /* ---------------------------- Extract Sources ------------------------------*/
    this._Sources = merge_catalog_data(
      "sources",
      new Map(Object.entries(raw_manifest.sources))
    );

    /* ---------------------------- Extract Macros ------------------------------*/
    this._Macros = new Map(
      Object.entries(raw_manifest.macros).filter(
        ([k, v]) => !v.package_name.includes("dbt")
      )
    );

    /* ---------------------------- Extract Exposures ----------------------------*/
    this._Exposures = new Map(Object.entries(raw_manifest.exposures));

    /* ---------------------------- Extract Childmap -----------------------------*/
    this._Child_Map = raw_manifest.child_map
      ? new Map(Object.entries(raw_manifest.child_map))
      : undefined;

    /* ---------------------------- Extract Parentmap -----------------------------*/
    this._Parent_Map = raw_manifest.parent_map
      ? new Map(Object.entries(raw_manifest.parent_map))
      : undefined;

    /* ---------------------------- Extract Tags -----------------------------*/
    this._tags = new Set([...this._tags].sort());

    /* ---------------------------- Extract Packages -----------------------------*/
    this._packages = new Set([...this._packages].sort());

    /* ------------------------------ Build Tree ------------------------------------*/
    // Initalize Maps for each tree section
    const source_tree = new Map() as Tree;
    const project_tree = new Map() as Tree;
    const exposure_tree = new Map() as Tree;

    // Extracting nodes (Both nodes and macros belong in the project section)
    [
      ...[...this._Nodes.values()].filter(
        (node) =>
          node.docs?.show &&
          (node.resource_type !== "test" || !node.tags?.includes("schema"))
      ),
      ...Object.values(raw_manifest.macros).filter(
        (macro) => !macro.package_name.includes("dbt")
      ),
    ].forEach((item) => {
      this._packages.add(item.package_name);
      if (item.tags?.length === 0) {
        item.tags = ["untagged"];
      }

      item.tags?.forEach((tag) => this.tags.add(tag));

      !project_tree.has(item.package_name) &&
        project_tree.set(item.package_name, new Map());

      recurse_path(
        item,
        project_tree.get(item.package_name) as Tree,
        item.original_file_path.split("/")
      );
    });

    // Extracting sources
    this._Sources.forEach((source) => {
      this._packages.add(source.package_name);
      if (source.tags?.length === 0) {
        source.tags = ["untagged"];
      }
      source.tags?.forEach((tag) => this.tags.add(tag));

      !source_tree.has(source.source_name) &&
        source_tree.set(source.source_name, new Map());

      (source_tree.get(source.source_name) as Tree).set(
        source.unique_id,
        source
      );
    });

    // Extracting exposures
    this.Exposures.forEach((exposure) => {
      this._packages.add(exposure.package_name);
      if (!exposure.tags || exposure.tags.length === 0) {
        exposure.tags = ["untagged"];
      }
      exposure.tags?.forEach((tag) => this.tags.add(tag));

      !exposure_tree.has(exposure.type) &&
        exposure_tree.set(exposure.type, new Map());

      (exposure_tree.get(exposure.type) as Tree).set(
        exposure.unique_id,
        exposure
      );
    });

    // Assign Maps to respective Tree sections
    this._Tree.set("sources", source_tree);
    this._Tree.set("projects", project_tree);
    this._Tree.set("exposures", exposure_tree);

    /* ---------------------------- Build Database Tree ------------------------------*/
    [
      ...[...this._Nodes.values()].filter(
        (node) => node.docs?.show && node.resource_type === "model"
      ),
      ...this._Sources.values(),
    ].forEach((data) => {
      const db_name = data?.database;
      if (db_name) {
        !this._DbTree.has(db_name) && this._DbTree.set(db_name, new Map());
        const db = this._DbTree.get(db_name);
        if (db) {
          const schema_name = data?.schema;
          if (schema_name) {
            !db.has(schema_name) && db.set(schema_name, new Map());
            const schema = db.get(schema_name);
            schema && schema.set(data.unique_id, data);
          }
        }
      }
    });
  }
}

export default Manifest;
