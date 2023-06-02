import { IAnnotation } from "@codrjs/models";
import { model, Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type AnnotationDocument = IAnnotation &
  AccessibleFieldsModel<IAnnotation>;
const AnnotationSchema = new Schema<AnnotationDocument>(
  {
    projectId: {
      type: SchemaTypes.ObjectId,
      ref: "Project",
      index: true,
    },
    datasetId: {
      type: SchemaTypes.ObjectId,
      ref: "Dataset",
      index: true,
    },
    sampleId: {
      type: SchemaTypes.ObjectId,
      ref: "Sample",
      index: true,
    },
    annotatedBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      index: true,
    },
    value: {
      type: String,
    },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

// exports Annotation model.
AnnotationSchema.plugin(accessibleFieldsPlugin);
AnnotationSchema.plugin(accessibleRecordsPlugin);
const Annotation = model<IAnnotation, AccessibleModel<AnnotationDocument>>(
  "Annotation",
  AnnotationSchema
);
export default Annotation;
