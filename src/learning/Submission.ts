import { DomainException } from "../shared/DomainException";
import { SubmissionContent } from "./SubmissionContent";

export class Submission {
   private _status: "PENDING" | "GRADED" = "PENDING";
   private _grade?: number;

   constructor(
      public readonly id: string,
      public readonly enrollmentId: string,
      public readonly moduleId: string,
      public readonly content: SubmissionContent,
      public readonly submittedAt: Date = new Date(),
      status: "PENDING" | "GRADED" = "PENDING",
      grade?: number
   ) {
      if (!id || id.trim() === "") throw new DomainException("Submission ID is required.");
      if (!enrollmentId || enrollmentId.trim() === "") throw new DomainException("Enrollment ID is required.");
      if (!moduleId || moduleId.trim() === "") throw new DomainException("Module ID is required.");
      this._status = status;
      this._grade = grade;
   }

   public get status(): "PENDING" | "GRADED" {
      return this._status;
   }

   public get grade(): number | undefined {
      return this._grade;
   }

   public assignGrade(grade: number): void {
      if (grade < 0 || grade > 100) {
         throw new DomainException("Grade must be between 0 and 100.");
      }
      this._grade = grade;
      this._status = "GRADED";
   }
}