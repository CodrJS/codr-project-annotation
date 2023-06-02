import type { OpenAPIV3_1 } from "openapi-types";

const AnnotationEntitySchema: OpenAPIV3_1.SchemaObject = {
  title: "Annotation Entity Schema",
  allOf: [{ $ref: "#/components/schemas/BaseEntitySchema" }],
  properties: {
    projectId: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    datasetId: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    sampleId: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    annotatedBy: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    value: {
      type: "string",
    },
  },
};

export default AnnotationEntitySchema;
