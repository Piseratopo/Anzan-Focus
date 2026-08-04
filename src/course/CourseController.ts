import { Request, Response, Router } from "express";
import { ICourseService } from "./CoursePorts";

export class CourseController {
   private router: Router;

   constructor(private readonly courseService: ICourseService) {
      this.router = Router();
      this.initializeRoutes();
   }

   private initializeRoutes() {
      this.router.post("/", this.createCourse.bind(this));
      this.router.get("/", this.getAllCourses.bind(this));
      this.router.get("/:id", this.getCourseById.bind(this));
      this.router.delete("/:id", this.deleteCourse.bind(this));
      this.router.post("/:id/modules", this.addModule.bind(this));
   }

   public getRouter(): Router {
      return this.router;
   }

   private async createCourse(req: Request, res: Response): Promise<void> {
      try {
         const { title, description } = req.body;
         const course = await this.courseService.createCourse({ title, description });
         res.status(201).json({
            id: course.id,
            title: course.title,
            description: course.description,
            metadata: course.metadata,
         });
      } catch (error: any) {
         res.status(400).json({ error: error.message });
      }
   }

   private async getAllCourses(req: Request, res: Response): Promise<void> {
      try {
         const courses = await this.courseService.getAllCourses();
         const mapped = courses.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            modules: c.modules.map(m => ({ id: m.id, title: m.title, order: m.order })),
         }));
         res.status(200).json(mapped);
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      }
   }

   private async getCourseById(req: Request, res: Response): Promise<void> {
      try {
         const course = await this.courseService.getCourse(req.params.id as string);
         if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
         }
         res.status(200).json({
            id: course.id,
            title: course.title,
            description: course.description,
            modules: course.modules.map(m => ({
               id: m.id,
               title: m.title,
               description: m.description,
               order: m.order,
            })),
         });
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      }
   }

   private async deleteCourse(req: Request, res: Response): Promise<void> {
      try {
         await this.courseService.deleteCourse(req.params.id as string);
         res.status(204).send();
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      }
   }

   private async addModule(req: Request, res: Response): Promise<void> {
      try {
         const { title, description, order } = req.body;
         const course = await this.courseService.addModuleToCourse(req.params.id as string, {
            title,
            description,
            order,
         });
         res.status(200).json({
            id: course.id,
            modules: course.modules.map(m => ({
               id: m.id,
               title: m.title,
               description: m.description,
               order: m.order,
            })),
         });
      } catch (error: any) {
         res.status(400).json({ error: error.message });
      }
   }
}