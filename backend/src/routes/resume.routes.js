import express from "express";
import upload from "../middlewares/file.middleware.js";
import authUser from "../middlewares/auth.middleware.js";
import { generateResumeController } from "../controllers/resume.controller.js";

const ResumeRouter = express.Router();

ResumeRouter.post(
  "/",
  authUser,
  upload.single("resume"),
  generateResumeController
);

export default ResumeRouter;