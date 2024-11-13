import express from "express";
import "dotenv";
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import matchRouter from './routes/matchRouter.js';

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/matches", matchRouter);

export default router;
