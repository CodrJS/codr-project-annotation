import { subject } from "@casl/ability";
import {
  Annotation,
  IAnnotation,
  Utility,
  Error,
  Response,
  Types,
} from "@codrjs/models";
import MongoAnnotation, { AnnotationDocument } from "../entities/Annotation";
import AnnotationAbility from "../entities/Annotation.ability";

type JwtPayload = Types.JwtPayload;

export class AnnotationUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await MongoAnnotation.findById(id)) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching annotation",
        details: {
          annotationId: id,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired annotation document
    const annotation = await this._getDocument<AnnotationDocument>(id);

    // if user and read the document, send it, else throw error
    if (AnnotationAbility(token).can("read", subject("Annotation", annotation))) {
      return new Response({
        message: "OK",
        details: {
          annotation: new Annotation(annotation),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this annotation.",
      });
    }
  }

  async create(token: JwtPayload, obj: Omit<IAnnotation, "annotatedBy">) {
    // if annotation can create annotations
    if (AnnotationAbility(token).can("create", "Annotation")) {
      try {
        // create annotation
        const annotation = await MongoAnnotation.create({
          ...obj,
          createdBy: token.sub,
        });
        return new Response({
          message: "OK",
          details: {
            annotation: new Annotation(annotation),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a annotation.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating annotations.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<IAnnotation>) {
    // get desired annotation document
    const annotation = await this._getDocument<AnnotationDocument>(id);

    // check permissions
    if (AnnotationAbility(token).can("update", subject("Annotation", annotation))) {
      try {
        // update annotation.
        const annotation = (await MongoAnnotation.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as AnnotationDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            annotation: new Annotation(annotation),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a annotation.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this annotation.",
      });
    }
  }

  /**
   * @todo Hard or soft delete annotations?
   */
  async delete(_token: JwtPayload, _id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        annotation: undefined,
      },
    });
  }
}
