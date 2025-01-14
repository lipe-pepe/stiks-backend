function gameEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("loaded-game", async ({ roomCode }) => {
    socket.join(roomCode); // Adiciona o socket à sala
  });

  // -------------------------------------------------------------------------------

  socket.on("player-chose", async ({ roomCode, playerId, value }) => {
    io.to(roomCode).emit("player-chose", { playerId, value });
  });
}

export default gameEvents;
