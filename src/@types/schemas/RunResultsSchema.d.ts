/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * RunResultsArtifact(metadata: dbt.contracts.util.BaseArtifactMetadata, results: Sequence[dbt.contracts.results.RunResultOutput], elapsed_time: float, args: Dict[str, Any] = <factory>)
 */
 interface RunResultsSchema {
  metadata: BaseArtifactMetadata;
  results: RunResultOutput[];
  elapsed_time: number;
  args?: {
    [k: string]: unknown;
  };
}
/**
 * BaseArtifactMetadata(dbt_schema_version: str, dbt_version: str = '0.20.0rc1', generated_at: datetime.datetime = <factory>, invocation_id: Union[str, NoneType] = <factory>, env: Dict[str, str] = <factory>)
 */
 interface BaseArtifactMetadata {
  dbt_schema_version: string;
  dbt_version?: string;
  generated_at?: string;
  invocation_id?: string | null;
  env?: {
    [k: string]: string;
  };
}
/**
 * RunResultOutput(status: Union[dbt.contracts.results.RunStatus, dbt.contracts.results.TestStatus, dbt.contracts.results.FreshnessStatus], timing: List[dbt.contracts.results.TimingInfo], thread_id: str, execution_time: float, adapter_response: Dict[str, Any], message: Union[str, NoneType], failures: Union[int, NoneType], unique_id: str)
 */
 interface RunResultOutput {
  status:
    | ("success" | "error" | "skipped")
    | ("pass" | "error" | "fail" | "warn")
    | ("pass" | "warn" | "error" | "runtime error");
  timing: TimingInfo[];
  thread_id: string;
  execution_time: number;
  adapter_response: {
    [k: string]: unknown;
  };
  message?: string | null;
  failures?: number | null;
  unique_id: string;
}
/**
 * TimingInfo(name: str, started_at: Union[datetime.datetime, NoneType] = None, completed_at: Union[datetime.datetime, NoneType] = None)
 */
 interface TimingInfo {
  name: string;
  started_at?: string | null;
  completed_at?: string | null;
}