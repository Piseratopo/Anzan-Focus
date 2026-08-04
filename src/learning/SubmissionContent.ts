import { DomainException } from "../shared/DomainException";

export class SubmissionContent {
   constructor(
      public readonly type: "QUIZ" | "FILE",
      public readonly payload: Record<string, any> | string
   ) {
      if (!type) {
         throw new DomainException("Submission type is required.");
      }
      if (!payload || (typeof payload === "string" && payload.trim() === "")) {
         throw new DomainException("Submission payload cannot be empty.");
      }
   }
}