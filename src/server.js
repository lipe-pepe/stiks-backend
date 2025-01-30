import "dotenv/config"; // Inicia o dotenv na aplicação, isso deve ser feito no arquivo mais externo

import http from "http";

import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import lobbyEvents from "./events/lobbyEvents.js";
import matchEvents from "./events/matchEvents.js";
import Room from "./models/Room.js";

// Porta que será usada na aplicação
const PORT = 3030;

// Cria a conexão com o banco de dados
const connection = await dbConnect();

// * OBS: As strings que são usadas nos eventos da conexão abaixo,
// * como 'error' e 'open', são configurações próprias da lib mongoose,
// * responsável por interfacear o MongoDB com a aplicação.

// Se receber um evento error na conexão, imprimimos no console
connection.on("error", (error) => {
  console.error("DB connection error: ", error);
});

// Se receber um evento open na conexão, logamos no console
connection.once("open", () => {
  console.log("Database connected");
});

// ==========================================================================================

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
}); // Cria um servidor com métodos do Socket.Io incluídos

routes(app); // inicia as rotas

// TODO: Organizar middlewares
// Configura uma origem específica para o cors
app.use(
  cors({
    origin: process.env.FRONTEND_HOST, // Origem do frontend
  })
);

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  lobbyEvents(socket, io);
  matchEvents(socket, io);

  socket.on("disconnecting", () => {
    // Captura as salas antes de o socket ser removido
    socket.rooms.forEach(async (room) => {
      // Exclui a sala padrão que é o próprio socket.id
      if (room !== socket.id) {
        const foundRoom = await Room.findOne({ code: room }).populate(
          "players"
        );
        // Emitir para todos os clientes da sala
        io.to(room).emit("player-left", foundRoom);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Ouve as conexões
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}...`);
});
