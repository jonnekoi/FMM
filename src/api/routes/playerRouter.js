// src/api/routes/playerRouter.js
import express from "express";
import authToken from '../../middlewares.js';
import { addPlayer, getPlayersForMatch } from '../controllers/playerController.js';

const playerRouter = express.Router();

const isAdmin = (req, res, next) => {
  if (res.locals.user.access === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

playerRouter.route('/').post(authToken, isAdmin, addPlayer);
playerRouter.route('/match/:match_id').get(getPlayersForMatch);

export default playerRouter;
