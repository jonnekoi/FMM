import express from "express";
import authToken from '../../middlewares.js';
import {addLeague, getUserLeagues, addUserToLeague, getPublicLeagues, addUserToPublicLeague} from '../controllers/leagueController.js';

const leagueRouter = express.Router();

leagueRouter.route("/").post(authToken, addLeague).get(authToken, getUserLeagues);
leagueRouter.route("/public").get(getPublicLeagues);
leagueRouter.route("/:code").post(authToken, addUserToLeague);
leagueRouter.route("/add/:id").post(authToken, addUserToPublicLeague)


export default leagueRouter;
