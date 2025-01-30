import { getMatch } from "../db/matches.js";

function gameEvents(socket, io) {
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
    const match = await getMatch(matchId);
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("match-update", match);
  });
}

export default gameEvents;
