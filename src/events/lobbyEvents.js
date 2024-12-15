import {
  addPlayerToRoom,
  deleteRoom,
  removePlayerFromRoom,
} from "../db/rooms.js";

// Esse arquivo registra todos os eventos relacionados ao lobby. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function lobbyEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("join-lobby", async ({ roomCode, playerName }) => {
    console.log(`${playerName} entrou na sala ${roomCode}`);
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-joined", {
      message: `${playerName} entrou na sala!`,
      player: playerName,
    });

    // Adiciona o socket à sala
    socket.join(roomCode);
  });

  // -------------------------------------------------------------------------------

  socket.on("leave-lobby", async ({ roomCode, playerName }) => {
    // Remove o jogador da sala no servidor
    const result = await removePlayerFromRoom(roomCode, playerName);

    if (result.success) {
      console.log(`${playerName} deixou a sala ${roomCode}`);
      // Se ainda tem jogadores, emitimos a saída, senão, a sala é deletada.
      if (result.room.players.length > 0) {
        // Emitir para todos os clientes da sala
        io.to(roomCode).emit("player-left", {
          message: `${playerName} deixou a sala.`,
          players: result.room.players,
        });
      } else {
        const result = await deleteRoom(roomCode);
        if (!result.success) {
          console.error(result.message);
        }
      }
    }
  });

  // -------------------------------------------------------------------------------

  socket.on("chat-message-sent", ({ roomCode, message }) => {
    io.to(roomCode).emit("chat-message-received", message);
  });

  // -------------------------------------------------------------------------------

  socket.on("start-game", ({ roomCode }) => {
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("host-started-game");
  });
}

export default lobbyEvents;
