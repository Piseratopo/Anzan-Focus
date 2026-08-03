import { Course } from "../../domain/models/Course";

export interface ICourseRepository {
  save(course: Course): Promise<void>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  delete(id: string): Promise<void>;
}