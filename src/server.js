import "dotenv/config"; // Inicia o dotenv na aplicação, isso deve ser feito no arquivo mais externo

import http from "http";

import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";

// Mapa para armazenar os jogadores de cada sala - TEMPORARIO
const rooms = {};

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

  socket.on("join-lobby", ({ roomId, playerName }) => {
    // Adiciona o jogador à sala no servidor - temporario
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    if (!rooms[roomId].includes(playerName)) rooms[roomId].push(playerName);

    console.log(`${playerName} entrou na sala ${roomId}`);

    // Adiciona o socket à sala
    socket.join(roomId);

    // Envia para o novo jogador a lista de jogadores da sala
    socket.emit("player-list", rooms[roomId]);

    // Emitir para todos os clientes da sala
    io.to(roomId).emit("player-joined", {
      message: `${playerName} entrou na sala!`,
      players: rooms[roomId],
    });
  });

  socket.on("leave-lobby", ({ roomId, playerName }) => {
    console.log(`${playerName} deixou a sala ${roomId}`);

    if (rooms[roomId]?.includes(playerName)) {
      const i = rooms[roomId].indexOf(playerName);
      rooms[roomId].splice(i, 1);
    }

    // Emitir para todos os clientes da sala
    io.to(roomId).emit("player-left", {
      message: `${playerName} deixou a sala.`,
      players: rooms[roomId],
    });
  });

  socket.on("chat-message-sent", ({ roomId, message }) => {
    io.to(roomId).emit("chat-message-received", message);
  });
});

// Ouve as conexões
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}...`);
});
