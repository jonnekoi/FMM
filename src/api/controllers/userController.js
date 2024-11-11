import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  addUser,
  isUsernameAvailable,
  listAllUsers,
} from '../models/userModel.js';

const registerUser = async (req, res) => {
  try {
    const check = await isUsernameAvailable(req.body.username)
    if (!check) {
      return res.status(409).json({ message: "Username is taken!"})
    }
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    req.body.access = "user";
    const username = req.body.username;
    const result = await addUser(req.body);
    if (!result) {
      return res.sendStatus(400);
    }

    try {
      const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      return res.status(201).json({ message: "New user added:", result, token, username });
    } catch (jwtError) {
      console.error(jwtError);
      return res.status(500).json({ message: "Error generating token" });
    }
  } catch (e) {
    console.log(e)
  }
}

const getAllUsers = async (req, res, ) => {
  try {
    res.json(await listAllUsers());
  } catch (error){
    console.log(error);
  }
}

export { registerUser, getAllUsers };
