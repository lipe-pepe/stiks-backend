import express from "express";
import RoomsController from "../controllers/roomsController.js";

const routes = express.Router();

// * OBS: O express trabalha com uma precedência de rotas, ou seja, elas são chamadas na sequência que elas são declaradas.
// * Por isso colocamos as rotas da maior para a menor complexidade.

routes.get("/rooms/:code", RoomsController.getRoom);
routes.post("/rooms", RoomsController.createRoom);
routes.put("/rooms/:code/add", RoomsController.addPlayer);

export default routes;
