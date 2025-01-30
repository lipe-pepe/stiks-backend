import express from "express";
import MatchesController from "../controllers/matchesController.js";

const routes = express.Router();

routes.get("/matches/:id", MatchesController.getMatch);
routes.post("/matches", MatchesController.createMatch);
routes.put(
  "/matches/:id/player/:playerId",
  MatchesController.updateMatchPlayerData
);

export default routes;
