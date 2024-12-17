// Esse arquivo é o ponto de entrada das rotas, e é ele que o resto do app vai acessar
import express from "express";

import roomsRoutes from "./roomsRoutes.js";
import playersRoutes from "./playersRoutes.js";
import matchesRoutes from "./matchesRoutes.js";

// Essa função centraliza as rotas
const routes = (app) => {
  //   app.route("/").get((req, res) => res.status(200).send(""));

  // .use inclui middlewares na instância do express
  app.use(express.json(), roomsRoutes, playersRoutes, matchesRoutes);
};

export default routes;
