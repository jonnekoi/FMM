import express from "express";
import { postLogin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.route("/login").post(postLogin);

export default authRouter;
