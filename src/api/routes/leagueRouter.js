import express from "express";
import authToken from '../../middlewares.js';
import {addLeague, getUserLeagues, addUserToLeague} from '../controllers/leagueController.js';

const leagueRouter = express.Router();

leagueRouter.route("/").post(authToken, addLeague).get(authToken, getUserLeagues);
leagueRouter.route("/:code").post(authToken, addUserToLeague);


export default leagueRouter;
