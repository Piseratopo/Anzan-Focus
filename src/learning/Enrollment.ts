import { DomainException } from "../shared/DomainException";

export class Enrollment {
   private _status: "ACTIVE" | "COMPLETED" = "ACTIVE";

   constructor(
      public readonly id: string,
      public readonly studentId: string,
      public readonly courseId: string,
      public readonly enrolledAt: Date = new Date(),
      status: "ACTIVE" | "COMPLETED" = "ACTIVE"
   ) {
      if (!id || id.trim() === "") throw new DomainException("Enrollment ID is required.");
      if (!studentId || studentId.trim() === "") throw new DomainException("Student ID is required.");
      if (!courseId || courseId.trim() === "") throw new DomainException("Course ID is required.");
      this._status = status;
   }

   public get status(): "ACTIVE" | "COMPLETED" {
      return this._status;
   }

   public complete(): void {
      if (this._status === "COMPLETED") {
         throw new DomainException("Enrollment is already completed.");
      }
      this._status = "COMPLETED";
   }
}