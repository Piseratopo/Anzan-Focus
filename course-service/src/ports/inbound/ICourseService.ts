import { Course } from "../../domain/models/Course";

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