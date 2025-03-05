import MatchService from "../services/matchService.js"; // Importando o serviço de cache

function matchEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("loaded-game", async ({ roomCode }) => {
    socket.join(roomCode); // Adiciona o socket à sala
  });

  // ---------------------------------------------------------------------------------

  socket.on("next-round", async ({ roomCode, winnerId }) => {
    io.to(roomCode).emit("next-round", { winnerId });
  });

  // ----------------------------------------------------------------------------------

  socket.on("match-update", async ({ roomCode, matchId }) => {
    const match = MatchService.getMatch(matchId);
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("match-update", match);
  });

  // ----------------------------------------------------------------------------------

  socket.on("player-chose", async ({ roomCode, matchId, playerId }) => {
    const match = MatchService.getMatch(matchId);

    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-chose", match, playerId);
  });

  socket.on("player-guessed", async ({ roomCode, matchId, playerId }) => {
    const match = MatchService.getMatch(matchId);

    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-guessed", match, playerId);
  });

  socket.on("player-revealed", async ({ roomCode, matchId, playerId }) => {
    const match = MatchService.getMatch(matchId);

    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-revealed", match, playerId);
  });
}

export default matchEvents;
