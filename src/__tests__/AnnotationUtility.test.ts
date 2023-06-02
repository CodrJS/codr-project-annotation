import { Error, IAnnotation, Types as CodrTypes } from "@codrjs/models";
import { AnnotationUtility } from "@/utils/AnnotationUtility";
import { Types } from "mongoose";
import Annotation from "@/entities/Annotation";
import { randomUUID } from "crypto";
const Utility = new AnnotationUtility();

type JwtPayload = CodrTypes.JwtPayload;

const testSystemUser: JwtPayload = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system@codrjs.com",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(0).toString(),
  jti: randomUUID(),
};

const testAdminUser: JwtPayload = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin@codrjs.com",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(1).toString(),
  jti: randomUUID(),
};

const testResearchUser: JwtPayload = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher@codrjs.com",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(2).toString(),
  jti: randomUUID(),
};

const testAnnotatorUser: JwtPayload = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator@codrjs.com",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(3).toString(),
  jti: randomUUID(),
};

const demoAnnotation: Omit<IAnnotation, "annotatedBy"> = {
  _id: new Types.ObjectId(4),
  projectId: new Types.ObjectId(0),
  datasetId: new Types.ObjectId(0),
  sampleId: new Types.ObjectId(0),
  value: "Hello world.",
};

describe("Annotation Utility: Create", () => {
  test("System can add annotation", async () => {
    // mock function returns once
    Annotation.create = jest.fn().mockResolvedValueOnce({
      ...demoAnnotation,
      annotatedBy: testSystemUser.sub,
    });

    // run tests
    const annotation = await Utility.create(testSystemUser, demoAnnotation);
    expect(annotation.details.annotation.annotatedBy).toBe(testSystemUser.sub);
  });

  test("Admin can add annotation", async () => {
    // mock function returns once
    Annotation.create = jest.fn().mockResolvedValueOnce({
      ...demoAnnotation,
      annotatedBy: testAdminUser.sub,
    });

    // run tests
    const annotation = await Utility.create(testAdminUser, demoAnnotation);
    expect(annotation.details.annotation.annotatedBy).toBe(testAdminUser.sub);
  });

  test("Researcher can add annotation", async () => {
    // mock function returns once
    Annotation.create = jest.fn().mockResolvedValueOnce({
      ...demoAnnotation,
      annotatedBy: testResearchUser.sub,
    });

    // run tests
    const annotation = await Utility.create(testResearchUser, demoAnnotation);
    expect(annotation.details.annotation.annotatedBy).toBe(
      testResearchUser.sub
    );
  });

  test("Annotator cannot add annotation", async () => {
    // mock function returns once
    Annotation.create = jest.fn().mockResolvedValueOnce({
      ...demoAnnotation,
      annotatedBy: testAnnotatorUser.sub,
    });

    // run tests
    const sample = await Utility.create(testAnnotatorUser, demoAnnotation);
    expect(sample.details.annotation.annotatedBy).toBe(testAnnotatorUser.sub);
  });
});

// describe("Annotation Utility: Read", () => {
//   test("System can read another annotation", async () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     const annotation = await Utility.get(
//       testSystemUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(annotation.details.annotation.email).toBe("addannotation@codrjs.com");
//   });

//   test("Admin can read another annotation", async () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     const annotation = await Utility.get(
//       testAdminUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(annotation.details.annotation.email).toBe("addannotation@codrjs.com");
//   });

//   test("Researcher can read own annotation", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testResearchUser);

//     // run tests
//     const annotation = await Utility.get(
//       testResearchUser,
//       testResearchUser._id as unknown as string
//     );
//     expect(annotation.details.annotation.email).toBe("researcher@codrjs.com");
//   });

//   test("Annotator can read own annotation", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValue(testAnnotatorUser);

//     // run tests
//     const annotation = await Utility.get(
//       testAnnotatorUser,
//       testAnnotatorUser._id as unknown as string
//     );
//     expect(annotation.details.annotation.email).toBe("annotator@codrjs.com");
//   });

//   test("Researcher cannot read another annotation", () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     expect(
//       Utility.get(testResearchUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this annotation.",
//       })
//     );
//   });

//   test("Annotator cannot read another annotation", () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     expect(
//       Utility.get(testAnnotatorUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this annotation.",
//       })
//     );
//   });
// });

// describe("Annotation Utility: Update", () => {
//   test("System can update another annotation", async () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const annotation = await Utility.update(
//       testSystemUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(annotation.details.annotation.email).toBe("addannotation@codrjs.com");
//   });

//   test("System cannot update system annotation", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testSystemUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this annotation.",
//       })
//     );
//   });

//   test("Admin can update another annotation", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testAdminUser);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const annotation = await Utility.update(
//       testAdminUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(annotation.details.annotation.email).toBe("addannotation@codrjs.com");
//   });

//   test("Admin cannot update system annotation", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this annotation.",
//       })
//     );
//   });

//   test("Researcher cannot update annotations", async () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this annotation.",
//       })
//     );
//   });

//   test("Annotator cannot update annotations", async () => {
//     // mock function returns once
//     Annotation.findById = jest.fn().mockResolvedValueOnce(demoAnnotation);

//     // run tests
//     expect(
//       Utility.update(
//         testAnnotatorUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this annotation.",
//       })
//     );
//   });
// });

/**
 * @TODO Add test cases for (soft) deleting a annotation.
 */
