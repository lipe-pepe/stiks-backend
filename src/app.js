import express from "express";
import cors from "cors";

import RoomsController from "./controllers/roomsController.js";

// Provisório
let rooms = [];

const app = express();

// TODO: Organizar middlewares
// Configura uma origem específica para o cors
app.use(
  cors({
    origin: "http://localhost:3000", // Origem do frontend
  })
);

app.post("/rooms", (req, res) => {
  const code = RoomsController.createRoom();
  res.status(201).json({ message: `Room created successfully`, code });
});

export default app;
