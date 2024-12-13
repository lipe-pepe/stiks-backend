import express from "express";
import GamesController from "../controllers/gamesController.js";

const routes = express.Router();

routes.post("/games", GamesController.createGame);

export default routes;
