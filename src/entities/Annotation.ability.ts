import { Types } from "@codrjs/models";
import { AnnotationDocument } from "./Annotation";

/**
 * Assume that the JwtPayload has been verified.
 * Using the Jwt, grant permission to accessing the database documents.
 */

const permissions: Types.Permissions<AnnotationDocument, "Annotation"> = {
  "codr:system": (_token, { can }) => {
    can("manage", "Annotation");
  },
  "codr:admin": (_token, { can }) => {
    can("manage", "Annotation");
  },
  "codr:researcher": (token, { can }) => {
    // can only manage it's own annotations and read public annotations.
    can("read", "Annotation", { "flags.isPrivate": { $eq: false } });
    can("manage", "Annotation", { createdBy: token.sub });
  },
  "codr:annotator": (token, { can }) => {
    // can only read public annotations
    can("read", "Annotation", { "flags.isPrivate": { $eq: false } });
    can("create", "Annotation");
    can("update", "Annotation", { createdBy: token.sub });
  },
};

const AnnotationAbility = (token: Types.JwtPayload) =>
  Types.DefineAbility(token, permissions);
export default AnnotationAbility;
