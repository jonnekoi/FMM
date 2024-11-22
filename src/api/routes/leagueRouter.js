import express from "express";
import authToken from '../../middlewares.js';
import {addLeague, getUserLeagues, addUserToLeague, getPublicLeagues} from '../controllers/leagueController.js';

const leagueRouter = express.Router();

leagueRouter.route("/").post(authToken, addLeague).get(authToken, getUserLeagues);
leagueRouter.route("/public").get(getPublicLeagues);
leagueRouter.route("/:code").post(authToken, addUserToLeague);


export default leagueRouter;
