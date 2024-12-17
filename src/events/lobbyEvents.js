import { removePlayerFromRoom } from "../db/rooms.js";
import Room from "../models/Room.js";

// Esse arquivo registra todos os eventos relacionados ao lobby. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function lobbyEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("player-joined", async ({ roomCode }) => {
    socket.join(roomCode); // Adiciona o socket à sala

    const room = await Room.findOne({ code: roomCode }).populate("players");
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-joined", room);
  });

  // -------------------------------------------------------------------------------

  socket.on("leave-lobby", async ({ roomCode, playerName }) => {
    try {
      // Remove o jogador da sala no servidor
      const result = await removePlayerFromRoom(roomCode, playerName);
      // if (result.status === HttpStatus.OK) {
      //   socket.leave(roomCode);
      //   console.log(`${playerName} deixou a sala ${roomCode}`);
      //   // Se ainda tem jogadores, emitimos a saída, senão, a sala é deletada.
      //   if (result.room.players.length > 0) {
      //     // Emitir para todos os clientes da sala
      //     io.to(roomCode).emit("player-left", {
      //       message: `${playerName} deixou a sala.`,
      //       player: playerName,
      //     });
      //   } else {
      //     const result = await deleteRoom(roomCode);
      //     if (!result.success) {
      //       console.error(result.message);
      //     }
      //   }
      // }
    } catch (error) {
      console.log("Leave-lobby event error: ", error);
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
