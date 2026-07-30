// src/index.ts
import { Course } from "./domain/models/Course";
import { Module } from "./domain/models/Module";

try {
   const course = new Course({
      id: "course-101",
      title: "Introduction to Hexagonal Architecture",
      description: "Learn how to build decoupled systems"
   });

   course.addModule(new Module({
      id: "mod-1",
      title: "Theoretical Background",
      description: "History of Ports & Adapters",
      order: 1
   }));

   console.log(`Initialized Course: "${course.title}" with ${course.modules.length} module(s).`);
} catch (error: any) {
   console.error("Domain Error:", error.message);
}