import { ICourseRepository } from "./CoursePorts";
import { Course } from "./Course";
import { pool } from "./db";
import { CourseMapper } from "./CourseMapper";

export class PostgresCourseRepository implements ICourseRepository {
   public async save(course: Course): Promise<void> {
      const client = await pool.connect();
      try {
         await client.query("BEGIN");
         const persisted = CourseMapper.toPersistence(course);
         
         const upsertCourseQuery = `
            INSERT INTO courses (id, title, description, metadata)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, description = EXCLUDED.description, metadata = EXCLUDED.metadata;
         `;
         await client.query(upsertCourseQuery, [
            persisted.id,
            persisted.title,
            persisted.description,
            persisted.metadata,
         ]);

         await client.query("DELETE FROM modules WHERE course_id = $1", [course.id]);
         
         const insertModuleQuery = `
            INSERT INTO modules (id, course_id, title, description, sort_order)
            VALUES ($1, $2, $3, $4, $5);
         `;
         for (const mod of course.modules) {
            await client.query(insertModuleQuery, [
               mod.id,
               course.id,
               mod.title,
               mod.description,
               mod.order,
            ]);
         }
         await client.query("COMMIT");
      } catch (error) {
         await client.query("ROLLBACK");
         throw error;
      } finally {
         client.release();
      }
   }

   public async findById(id: string): Promise<Course | null> {
      const courseRes = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
      if (courseRes.rows.length === 0) return null;

      const modulesRes = await pool.query(
         "SELECT * FROM modules WHERE course_id = $1 ORDER BY sort_order ASC",
         [id]
      );
      return CourseMapper.toDomain(courseRes.rows[0], modulesRes.rows);
   }

   public async findAll(): Promise<Course[]> {
      const coursesRes = await pool.query("SELECT * FROM courses");
      const courses: Course[] = [];

      for (const row of coursesRes.rows) {
         const modulesRes = await pool.query(
            "SELECT * FROM modules WHERE course_id = $1 ORDER BY sort_order ASC",
            [row.id]
         );
         courses.push(CourseMapper.toDomain(row, modulesRes.rows));
      }
      return courses;
   }

   public async delete(id: string): Promise<void> {
      await pool.query("DELETE FROM courses WHERE id = $1", [id]);
   }
}