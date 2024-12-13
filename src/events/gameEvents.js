// Esse arquivo registra todos os eventos relacionados ao jogo. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function gameEvents(socket, io) {
  socket.on("game-started", ({ roomCode }) => {
    // Adiciona o socket à sala
    socket.join(roomCode);
  });

  socket.on("game-chose-sticks", ({ roomCode, playerName, sticksChosen }) => {
    io.to(roomCode).emit("player-chose", { playerName, sticksChosen });
  });

  socket.on("game-guess", ({ roomCode, playerName, guess }) => {
    io.to(roomCode).emit("player-guessed", { playerName, guess });
  });
}

export default gameEvents;
