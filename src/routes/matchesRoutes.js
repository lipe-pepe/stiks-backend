import express from "express";
import MatchesController from "../controllers/matchesController.js";

const routes = express.Router();

routes.post("/matches", MatchesController.createMatch);

export default routes;
