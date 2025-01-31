import express from 'express';
import "dotenv";

import {
  addMatch,
  getMatches,
  getSingleMatch,
  addGuess,
  getUserGuess,
  getTeamStats, addResult,

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
matchRouter.route('/:id').get(authToken, getSingleMatch);
matchRouter.route('/stats/:id').get(authToken, getTeamStats);
matchRouter.route('/guess/:id').post(authToken, addGuess);
matchRouter.route('/guess/score/:id').get(authToken, getUserGuess);
matchRouter.route('/result/post/:id').post(authToken, isAdmin, addResult);

export default matchRouter;
