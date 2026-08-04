import { ICourseService, CreateCourseDTO, AddModuleDTO } from "./CoursePorts";
import { ICourseRepository } from "./CoursePorts";
import { Course } from "./Course";
import { Module } from "./Module";
import { v4 as uuidv4 } from "uuid";

export class CourseService implements ICourseService {
   constructor(private readonly courseRepository: ICourseRepository) {}

   public async createCourse(dto: CreateCourseDTO): Promise<Course> {
      const newCourse = new Course({
         id: uuidv4(),
         title: dto.title,
         description: dto.description,
      });
      await this.courseRepository.save(newCourse);
      return newCourse;
   }

   public async getCourse(id: string): Promise<Course | null> {
      return await this.courseRepository.findById(id);
   }

   public async getAllCourses(): Promise<Course[]> {
      return await this.courseRepository.findAll();
   }

   public async addModuleToCourse(courseId: string, dto: AddModuleDTO): Promise<Course> {
      const course = await this.courseRepository.findById(courseId);
      if (!course) throw new Error("Course not found");

      const module = new Module({
         id: uuidv4(),
         title: dto.title,
         description: dto.description,
         order: dto.order,
      });

      course.addModule(module);
      await this.courseRepository.save(course);
      return course;
   }

   public async deleteCourse(id: string): Promise<void> {
      await this.courseRepository.delete(id);
   }
}