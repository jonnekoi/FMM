import express from 'express';
import "dotenv";

import {
  addMatch,
  getMatches,
} from '../controllers/matchController.js';
import authToken from '../../middlewares.js';

const matchRouter = express.Router();

const isAdmin = (req, res, next) => {
  if (res.locals.user.access === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

matchRouter.route('/').get(getMatches).post(authToken, isAdmin, addMatch);

export default matchRouter;
