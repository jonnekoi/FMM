import express from "express";
import authToken from '../../middlewares.js';
import {addLeague, getUserLeagues, addUserToLeague, getPublicLeagues, addUserToPublicLeague, getLeagueData} from '../controllers/leagueController.js';

const leagueRouter = express.Router();

leagueRouter.route("/").post(authToken, addLeague).get(authToken, getUserLeagues);
leagueRouter.route("/public").get(authToken, getPublicLeagues);
leagueRouter.route("/:code").post(authToken, addUserToLeague);
leagueRouter.route("/add/:id").post(authToken, addUserToPublicLeague)
leagueRouter.route("/info/:id").get(authToken, getLeagueData);


export default leagueRouter;
