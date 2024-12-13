import RoomsController from "../controllers/roomsController.js";

// Esse arquivo registra todos os eventos relacionados ao lobby. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function lobbyEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("join-lobby", async ({ roomCode, playerName }) => {
    // Adiciona o jogador à sala no servidor
    const result = await RoomsController.addPlayerToRoom(roomCode, playerName);

    if (result.success) {
      console.log(`${playerName} entrou na sala ${roomCode}`);
      // Adiciona o socket à sala
      socket.join(roomCode);
      // Emitir para todos os clientes da sala
      io.to(roomCode).emit("player-joined", {
        message: `${playerName} entrou na sala!`,
        players: result.room.players,
      });
    }
  });

  // -------------------------------------------------------------------------------

  socket.on("leave-lobby", async ({ roomCode, playerName }) => {
    // Remove o jogador da sala no servidor
    const result = await RoomsController.removePlayerFromRoom(
      roomCode,
      playerName
    );

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
        const result = await RoomsController.deleteRoom(roomCode);
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
}

export default lobbyEvents;
