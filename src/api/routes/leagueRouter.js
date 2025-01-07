import express from "express";
import authToken from '../../middlewares.js';
import {addLeague, getUserLeagues, addUserToLeague, getPublicLeagues, addUserToPublicLeague, getLeagueData, addLeagueName} from '../controllers/leagueController.js';

const isAdmin = (req, res, next) => {
  if (res.locals.user.access === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

const leagueRouter = express.Router();

leagueRouter.route("/").post(authToken, addLeague).get(authToken, getUserLeagues);
leagueRouter.route("/public").get(authToken, getPublicLeagues);
leagueRouter.route("/:code").post(authToken, addUserToLeague);
leagueRouter.route("/add/:id").post(authToken, addUserToPublicLeague)
leagueRouter.route("/info/:id").get(authToken, getLeagueData);
leagueRouter.route("/add/name").post(authToken, isAdmin, addLeagueName);


export default leagueRouter;
