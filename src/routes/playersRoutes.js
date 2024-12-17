import express from "express";
import PlayersController from "../controllers/playersController.js";

const routes = express.Router();

routes.post("/players", PlayersController.createPlayer);
routes.delete("/players/:id", PlayersController.deletePlayer);

export default routes;
