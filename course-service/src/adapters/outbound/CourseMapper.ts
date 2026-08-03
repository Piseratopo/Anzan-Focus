import { Course } from "../../domain/models/Course";
import { Module } from "../../domain/models/Module";

export class CourseMapper {
   public static toDomain(courseRow: any, moduleRows: any[] = []): Course {
      const modules = moduleRows.map(
         (m) =>
         new Module({
            id: m.id,
            title: m.title,
            description: m.description,
            order: m.sort_order,
         })
      );

      return new Course({
         id: courseRow.id,
         title: courseRow.title,
         description: courseRow.description,
         metadata: courseRow.metadata,
         modules: modules,
      });
   }

   public static toPersistence(course: Course) {
      return {
         id: course.id,
         title: course.title,
         description: course.description,
         metadata: JSON.stringify(course.metadata),
      };
   }
}