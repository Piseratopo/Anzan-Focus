import express from "express";
import { PostgresCourseRepository } from "./adapters/outbound/PostgresCourseRepository";
import { CourseService } from "./application/CourseService";
import { CourseController } from "./adapters/inbound/rest/CourseController";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 1. Instantiate Outbound Adapter
const courseRepository = new PostgresCourseRepository();

// 2. Instantiate Application Core, injecting the Outbound Adapter
const courseService = new CourseService(courseRepository);

// 3. Instantiate Inbound Adapter, injecting the Service
const courseController = new CourseController(courseService);

// 4. Mount API Routes
app.use("/api/courses", courseController.getRouter());

// Simple healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(port, () => {
  console.log(`Course Service running on port ${port}`);
});