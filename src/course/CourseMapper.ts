import { Course } from "./Course";
import { Module } from "./Module";

// Define strict interfaces representing database schemas
export interface CourseDbRow {
   id: string;
   title: string;
   description: string | null;
   metadata: any;
}

export interface ModuleDbRow {
   id: string;
   course_id: string;
   title: string;
   description: string | null;
   sort_order: number;
}

export class CourseMapper {
   /**
    * Translates raw database rows into rich Domain Entities.
    */
   public static toDomain(courseRow: CourseDbRow, moduleRows: ModuleDbRow[] = []): Course {
      const modules = moduleRows.map(
         (m) =>
            new Module({
               id: m.id,
               title: m.title,
               description: m.description || "",
               order: m.sort_order,
            })
      );

      // Gracefully handle JSONB parsing variations based on driver configurations
      let parsedMetadata: Record<string, any> = {};
      if (courseRow.metadata) {
         if (typeof courseRow.metadata === "string") {
            try {
               parsedMetadata = JSON.parse(courseRow.metadata);
            } catch {
               parsedMetadata = {};
            }
         } else if (typeof courseRow.metadata === "object") {
            parsedMetadata = courseRow.metadata;
         }
      }

      return new Course({
         id: courseRow.id,
         title: courseRow.title,
         description: courseRow.description || "",
         metadata: parsedMetadata,
         modules: modules,
      });
   }

   /**
    * Translates rich Domain Entities into flat database-ready parameters.
    */
   public static toPersistence(course: Course) {
      return {
         id: course.id,
         title: course.title,
         description: course.description,
         // The pg driver accepts standard JS objects and converts them to JSONB automatically
         metadata: course.metadata, 
      };
   }
}