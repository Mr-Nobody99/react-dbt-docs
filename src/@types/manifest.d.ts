type TestInfo = {
  column: string;
  test_type: string;
  from?: string;
  target_id?: string;
  target_name?: string;
  values?: string[];
};
interface ColumnInfo extends Dbt_Manifest.ColumnInfo {
  index?: number;
  tests?: TestInfo[];
}

type ColumnsRemoved<T> = Omit<T, "columns">;

type CatalogMerged<T> = ColumnsRemoved<T> & {
  columns?: { [key: string]: ColumnInfo };
  stats?: Map<string, StatsItem>;
  catalog_meta?: TableMetadata;
};

type CompiledAnalysisNode = CatalogMerged<Dbt_Manifest.CompiledAnalysisNode>;
type CompiledDataTestNode = CatalogMerged<Dbt_Manifest.CompiledDataTestNode>;
type CompiledModelNode = CatalogMerged<Dbt_Manifest.CompiledModelNode>;
type CompiledHookNode = CatalogMerged<Dbt_Manifest.CompiledHookNode>;
type CompiledRPCNode = CatalogMerged<Dbt_Manifest.CompiledRPCNode>;
type CompiledSeedNode = CatalogMerged<Dbt_Manifest.CompiledSeedNode>;
type CompiledSnapshotNode = CatalogMerged<Dbt_Manifest.CompiledSnapshotNode>;
type CompiledSchemaTestNode =
  CatalogMerged<Dbt_Manifest.CompiledSchemaTestNode>;

type ParsedAnalysisNode = CatalogMerged<Dbt_Manifest.ParsedAnalysisNode>;
type ParsedDataTestNode = CatalogMerged<Dbt_Manifest.ParsedDataTestNode>;
type ParsedModelNode = CatalogMerged<Dbt_Manifest.ParsedModelNode>;
type ParsedHookNode = CatalogMerged<Dbt_Manifest.ParsedHookNode>;
type ParsedRPCNode = CatalogMerged<Dbt_Manifest.ParsedRPCNode>;
type ParsedSeedNode = CatalogMerged<Dbt_Manifest.ParsedSeedNode>;
type ParsedSnapshotNode = CatalogMerged<Dbt_Manifest.ParsedSnapshotNode>;
type ParsedSchemaTestNode = CatalogMerged<Dbt_Manifest.CompiledSchemaTestNode>;

type ParsedSourceDefinition =
  CatalogMerged<Dbt_Manifest.ParsedSourceDefinition>;

type ManifestNode =
  | CompiledAnalysisNode
  | CompiledDataTestNode
  | CompiledModelNode
  | CompiledHookNode
  | CompiledRPCNode
  | CompiledSchemaTestNode
  | CompiledSeedNode
  | CompiledSnapshotNode
  | ParsedAnalysisNode
  | ParsedDataTestNode
  | ParsedHookNode
  | ParsedModelNode
  | ParsedRPCNode
  | ParsedSchemaTestNode
  | ParsedSeedNode
  | ParsedSnapshotNode;

type ManifestData =
  | ManifestNode
  | ParsedSourceDefinition
  | Dbt_Manifest.ParsedMacro
  | Dbt_Manifest.ParsedExposure;

type TreeData = Tree | ManifestData;

type Tree = Map<string, TreeData>;
type Manifest_Tree = Map<"sources" | "exposures" | "projects", Tree>;
type Database_Tree = Map<string, Map<string, Map<string, ManifestData>>>;

type RawManifestNode = Dbt_Manifest.ManifestSchema["nodes"][0];
type RawManifestSource = Dbt_Manifest.ParsedSourceDefinition;
type MergedNodeOrSource<T extends RawManifestNode | RawManifestSource> =
  T extends RawManifestNode ? ManifestNode : ParsedSourceDefinition;

type MergeCatalogResult<T extends RawManifestNode | RawManifestSource> = Map<
  string,
  MergedNodeOrSource<T>
>;
