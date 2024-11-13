import express from "express";
import {getAllUsers, registerUser, modifyUser} from '../controllers/userController.js';
import authToken from '../../middlewares.js';

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers)
userRouter.route("/register").post(registerUser);
userRouter.route("/:id").put(authToken, modifyUser);
export default userRouter;
