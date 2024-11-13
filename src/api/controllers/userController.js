import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  addUser,
  isUsernameAvailable,
  listAllUsers,
  updateUser,
  listAllPoints
} from '../models/userModel.js';

const registerUser = async (req, res) => {
  try {
    const check = await isUsernameAvailable(req.body.username)
    if (!check) {
      return res.status(409).json({ message: "Username is taken!"})
    }
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    req.body.access = "user";
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const name = req.body.name;
    const result = await addUser(req.body);
    if (!result) {
      return res.sendStatus(400);
    }

    try {
      const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      const id = result.user_id;
      return res.status(201).json({ message: "New user added:", id, token, username, email, name });
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

const modifyUser = async (req, res) => {
  const username = req.body.username;
  const check = await isUsernameAvailable(username);
  if (!check) {
    return res.status(409).json({ message: "Username is taken!" });
  }

  try {
    const result = await updateUser(req.params.id, req.body, res.locals.user);
    if (!result) res.sendStatus(401);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getAllPoints = async (req, res) => {
  try {
    res.json(await listAllPoints());
  } catch (error){
    console.log(error);
  }
}

export { registerUser, getAllUsers, modifyUser, getAllPoints };
