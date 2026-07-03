import express  from 'express';
/* require all the routes here */
import authRouter from './routes/auth.routes.js';
import interviewRouter from './routes/interview.routes.js';
import resumeRouter from './routes/resume.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/resume', resumeRouter); // Add this line to include the resume routes

export default app;
