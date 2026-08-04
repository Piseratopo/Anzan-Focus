import express from "express";
import { PostgresCourseRepository } from "./course/PostgresCourseRepository";
import { CourseService } from "./course/CourseService";
import { CourseController } from "./course/CourseController";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const courseRepository = new PostgresCourseRepository();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

app.use("/api/courses", courseController.getRouter());

app.get("/health", (req, res) => {
   res.status(200).json({ status: "UP" });
});

app.listen(port, () => {
   console.log(`Platform Service running on port ${port}`);
});