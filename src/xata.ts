// Generated by Xata Codegen 0.28.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "transplant_data",
    columns: [
      { name: "region", type: "string" },
      { name: "blood_type", type: "string" },
      { name: "empty", type: "string" },
      { name: "heart_status_1A", type: "int" },
      { name: "all_types", type: "int" },
      { name: "heart_status_1B", type: "int" },
      { name: "heart_status_2", type: "int" },
      { name: "heart_status_7_inactive", type: "int" },
      { name: "report_date", type: "string" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type TransplantData = InferredTypes["transplant_data"];
export type TransplantDataRecord = TransplantData & XataRecord;

export type DatabaseSchema = {
  transplant_data: TransplantDataRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Dan-Reale-s-workspace-3m1pjh.us-east-1.xata.sh/db/transplant",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
