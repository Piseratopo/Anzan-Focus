import { DomainException } from "../shared/DomainException";

export class StudySession {
   private _completedAt?: Date;
   private _score?: number;

   constructor(
      public readonly id: string,
      public readonly enrollmentId: string,
      public readonly startedAt: Date = new Date(),
      completedAt?: Date,
      score?: number
   ) {
      if (!id || id.trim() === "") throw new DomainException("StudySession ID is required.");
      if (!enrollmentId || enrollmentId.trim() === "") throw new DomainException("Enrollment ID is required.");
      this._completedAt = completedAt;
      this._score = score;
   }

   public get completedAt(): Date | undefined {
      return this._completedAt;
   }

   public get score(): number | undefined {
      return this._score;
   }

   public complete(score: number): void {
      if (this._completedAt) {
         throw new DomainException("Study session is already completed.");
      }
      if (score < 0 || score > 100) {
         throw new DomainException("Score must be between 0 and 100.");
      }
      this._score = score;
      this._completedAt = new Date();
   }
}