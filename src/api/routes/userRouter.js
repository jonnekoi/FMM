import express from "express";
import {getAllUsers, registerUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers)
userRouter.route("/register").post(registerUser);
export default userRouter;
