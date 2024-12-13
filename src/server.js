import "dotenv/config"; // Inicia o dotenv na aplicação, isso deve ser feito no arquivo mais externo

import http from "http";

import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import RoomsController from "./controllers/roomsController.js";

// Porta que será usada na aplicação
const PORT = 3030;

// Cria a conexão com o banco de dados
const connection = await dbConnect();

// * OBS: As strings que são usadas nos eventos da conexão abaixo,
// * como 'error' e 'open', são configurações próprias da lib mongoose,
// * responsável por interfacear o MongoDB com a aplicação.

// Se receber um evento error na conexão, imprimimos no console
connection.on("error", (erro) => {
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
  console.log("A user connected");

  socket.on("join-lobby", async ({ roomCode, playerName }) => {
    // Adiciona o jogador à sala no servidor
    const result = await RoomsController.addPlayerToRoom(roomCode, playerName);

    if (result.success) {
      console.log(`${playerName} entrou na sala ${roomCode}`);
      // Adiciona o socket à sala
      socket.join(roomCode);
      console.log("TEM QUE MANDAR");
      // Emitir para todos os clientes da sala
      io.to(roomCode).emit("player-joined", {
        message: `${playerName} entrou na sala!`,
        players: result.room.players,
      });
    }
  });

  socket.on("leave-lobby", async ({ roomCode, playerName }) => {
    // Remove o jogador da sala no servidor
    const result = await RoomsController.removePlayerFromRoom(
      roomCode,
      playerName
    );

    if (result.success) {
      console.log(`${playerName} deixou a sala ${roomCode}`);
      // Emitir para todos os clientes da sala
      io.to(roomCode).emit("player-left", {
        message: `${playerName} deixou a sala.`,
        players: result.room.players,
      });
    }
  });

  socket.on("chat-message-sent", ({ roomCode, message }) => {
    io.to(roomCode).emit("chat-message-received", message);
  });
});

// Ouve as conexões
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}...`);
});
