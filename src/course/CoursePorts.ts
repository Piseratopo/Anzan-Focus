import { Course } from "./Course";

// --- INBOUND PORT ---
export interface CreateCourseDTO {
   title: string;
   description: string;
}

export interface AddModuleDTO {
   title: string;
   description: string;
   order: number;
}

export interface ICourseService {
   createCourse(dto: CreateCourseDTO): Promise<Course>;
   getCourse(id: string): Promise<Course | null>;
   getAllCourses(): Promise<Course[]>;
   addModuleToCourse(courseId: string, dto: AddModuleDTO): Promise<Course>;
   deleteCourse(id: string): Promise<void>;
}

// --- OUTBOUND PORT ---
export interface ICourseRepository {
   save(course: Course): Promise<void>;
   findById(id: string): Promise<Course | null>;
   findAll(): Promise<Course[]>;
   delete(id: string): Promise<void>;
}