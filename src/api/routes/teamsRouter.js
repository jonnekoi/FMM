import express from "express";
import {getAllTeams, addTeam} from '../controllers/teamsController.js';
import authToken from '../../middlewares.js';


const teamsRouter = express.Router();

const isAdmin = (req, res, next) => {
  if (res.locals.user.access === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

teamsRouter.route('/').get(getAllTeams).post(authToken, isAdmin, addTeam)
export default teamsRouter;
