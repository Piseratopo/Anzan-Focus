// tests/Learning.spec.ts

import { describe, it } from "node:test";
import assert from "node:assert";
import { Enrollment } from "../src/learning/Enrollment";
import { StudySession } from "../src/learning/StudySession";
import { SubmissionContent } from "../src/learning/SubmissionContent";
import { DomainException } from "../src/shared/DomainException";

describe("Learning Domain Unit Tests", () => {
    describe("Enrollment Boundary Checking", () => {
        it("should initialize with ACTIVE status status", () => {
            const enrollment = new Enrollment("e-1", "student-1", "course-1");
            assert.strictEqual(enrollment.status, "ACTIVE");
        });

        it("should transition status to COMPLETED", () => {
            const enrollment = new Enrollment("e-1", "student-1", "course-1");
            enrollment.complete();
            assert.strictEqual(enrollment.status, "COMPLETED");
        });

        it("should block completion when enrollment is already finished", () => {
            const enrollment = new Enrollment("e-1", "student-1", "course-1");
            enrollment.complete();
            assert.throws(() => {
                enrollment.complete();
            }, DomainException);
        });
    });

    describe("StudySession Boundary Checking", () => {
        it("should record study score when completed correctly", () => {
            const session = new StudySession("session-1", "e-1");
            session.complete(90);
            assert.strictEqual(session.score, 90);
            assert.ok(session.completedAt instanceof Date);
        });

        it("should block score updates outside range of 0 to 100", () => {
            const session = new StudySession("session-1", "e-1");
            assert.throws(() => session.complete(-1), DomainException);
            assert.throws(() => session.complete(101), DomainException);
        });
    });

    describe("Submission Content Constraints", () => {
        it("should reject payload parameters consisting of whitespace only", () => {
            assert.throws(() => {
                new SubmissionContent("QUIZ", "   ");
            }, DomainException);
        });
    });
});