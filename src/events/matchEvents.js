import { getMatch } from "../db/matches.js";

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

  // ----------------------------------------------------------------------------------

  socket.on("match-update", async ({ roomCode, matchId }) => {
    const match = await getMatch(matchId);
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("match-update", match);
  });
}

export default gameEvents;
