import { Course } from "../../src/domain/models/Course";
import { Module } from "../../src/domain/models/Module";
import { DomainException } from "../../src/domain/exceptions/DomainException";

describe("Course & Module Domain Invariants", () => {
   it("should fail to create a course without a title", () => {
      expect(() => {
         new Course({ id: "1", title: "", description: "test" });
      }).toThrow(DomainException);
   });

   it("should successfully add a module and sort by order", () => {
      const course = new Course({ id: "c-1", title: "Software Arch", description: "Learn Hexagonal" });

      const module2 = new Module({ id: "m-2", title: "Adapters", description: "Infra layer", order: 2 });
      const module1 = new Module({ id: "m-1", title: "Domain", description: "Core layer", order: 1 });

      course.addModule(module2);
      course.addModule(module1);

      const modules = course.modules;
      expect(modules.length).toBe(2);
      expect(modules[0].id).toBe("m-1"); // First module (order 1)
      expect(modules[1].id).toBe("m-2"); // Second module (order 2)
   });

   it("should block adding a module with a duplicate ID", () => {
      const course = new Course({ id: "c-1", title: "Software Arch", description: "Learn Hexagonal" });
      const module = new Module({ id: "m-1", title: "Domain", description: "Core layer", order: 1 });

      course.addModule(module);

      expect(() => {
         course.addModule(module);
      }).toThrow(DomainException);
   });
});