import Room from "../models/Room.js";

// Esse arquivo registra todos os eventos relacionados ao lobby. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function matchEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("loaded-game", async ({ roomCode }) => {
    socket.join(roomCode); // Adiciona o socket à sala
  });
  // -------------------------------------------------------------------------------

  socket.on("player-chose", async ({ roomCode, playerId, value }) => {
    io.to(roomCode).emit("player-chose", { playerId, value });
  });
}

export default matchEvents;
