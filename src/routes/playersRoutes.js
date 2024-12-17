import express from "express";
import PlayersController from "../controllers/playersController.js";

const routes = express.Router();

routes.post("/players", PlayersController.createPlayer);

export default routes;
