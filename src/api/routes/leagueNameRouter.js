import express from "express";
import authToken from '../../middlewares.js';
import {addLeagueName, getAllLeagueNames} from '../controllers/leagueController.js';

const isAdmin = (req, res, next) => {
  if (res.locals.user.access === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

const leagueNameRouter = express.Router();

leagueNameRouter.route("/add/name").post(authToken, isAdmin, addLeagueName);
leagueNameRouter.route('/').get(getAllLeagueNames);


export default leagueNameRouter;
