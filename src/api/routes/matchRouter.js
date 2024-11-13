import express from 'express';
import "dotenv";

import {
  getMatches
} from '../controllers/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/').get(getMatches);

export default matchRouter;
