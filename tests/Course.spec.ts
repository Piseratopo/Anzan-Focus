import { describe, it } from "node:test";
import assert from "node:assert";
import { Course } from "../src/course/Course";
import { Module } from "../src/course/Module";
import { DomainException } from "../src/shared/DomainException";

describe("Course Domain Unit Tests", () => {
   it("should throw exception if course title is empty", () => {
      assert.throws(() => {
         new Course({ id: "1", title: "", description: "Testing" });
      }, DomainException);
   });

   it("should add and sort modules correctly", () => {
      const course = new Course({ id: "c-1", title: "Engineering", description: "Design principles" });
      const mod2 = new Module({ id: "m-2", title: "Two", description: "Sec-2", order: 2 });
      const mod1 = new Module({ id: "m-1", title: "One", description: "Sec-1", order: 1 });

      course.addModule(mod2);
      course.addModule(mod1);

      // Native strict assertions
      assert.strictEqual(course.modules[0].id, "m-1");
      assert.strictEqual(course.modules[1].id, "m-2");
   });
});