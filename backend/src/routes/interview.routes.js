import express from "express";
import upload from "../middlewares/file.middleware.js";
import authUser from "../middlewares/auth.middleware.js";
// ✅ Fix:
import {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
} from "../controllers/interview.controller.js";
const interviewRouter = express.Router();

interviewRouter.post(
    "/",
    authUser,
    upload.single("resume"),
    generateInterViewReportController
);


interviewRouter.get(
    "/:interviewId",
    authUser,
    generateInterViewReportController
);

export default interviewRouter;