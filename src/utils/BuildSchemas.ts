import https from "https";
import { writeFileSync } from "fs";
import { compile } from "json-schema-to-typescript";

https.get("https://schemas.getdbt.com/dbt/manifest/v2.json", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    compile(JSON.parse(data), "ManifestSchema").then((ts) =>
      writeFileSync(
        "./src/@types/ManifestSchemaTest.d.ts",
        `declare namespace Dbt_Manifest {${ts.replace(/export/g, "")}}`
      )
    );
  });
});
https.get("https://schemas.getdbt.com/dbt/catalog/v1.json", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    compile(JSON.parse(data), "CatalogSchema").then((ts) =>
      writeFileSync(
        "./src/@types/CatalogSchema.d.ts",
        ts.replace(/export/g, "")
      )
    );
  });
});
https.get("https://schemas.getdbt.com/dbt/run-results/v2.json", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    compile(JSON.parse(data), "RunResultsSchema").then((ts) =>
      writeFileSync(
        "./src/@types/RunResultsSchema.d.ts",
        ts.replace(/export/g, "")
      )
    );
  });
});
