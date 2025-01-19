function gameEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("loaded-game", async ({ roomCode }) => {
    socket.join(roomCode); // Adiciona o socket à sala
  });

  // -------------------------------------------------------------------------------

  socket.on("player-chose", async ({ roomCode, playerId, value }) => {
    io.to(roomCode).emit("player-chose", { playerId, value });
  });

  // -------------------------------------------------------------------------------

  socket.on("player-guessed", async ({ roomCode, playerId, value }) => {
    io.to(roomCode).emit("player-guessed", { playerId, value });
  });

  // ---------------------------------------------------------------------------------

  socket.on("player-revealed", async ({ roomCode, playerId }) => {
    io.to(roomCode).emit("player-revealed", { playerId });
  });

  // ---------------------------------------------------------------------------------

  socket.on("next-round", async ({ roomCode, winnerId }) => {
    io.to(roomCode).emit("next-round", { winnerId });
  });
}

export default gameEvents;
