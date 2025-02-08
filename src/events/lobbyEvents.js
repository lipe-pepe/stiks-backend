import Room from "../models/Room.js";

// Esse arquivo registra todos os eventos relacionados ao lobby. Ele é depois usado no server para
// registrar os eventos. Fazemos isso por questão de organização do código.

function lobbyEvents(socket, io) {
  // -------------------------------------------------------------------------------

  socket.on("player-joined", async ({ roomCode, playerId }) => {
    socket.join(roomCode); // Adiciona o socket à sala

    const room = await Room.findOne({ code: roomCode }).populate("players");
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-joined", room, playerId);
  });

  // -------------------------------------------------------------------------------

  socket.on("player-left", async ({ roomCode, playerId }) => {
    socket.leave(roomCode); // Remove o jogador da sala no socket

    const room = await Room.findOne({ code: roomCode }).populate("players");
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-left", room, playerId);
  });

  // -------------------------------------------------------------------------------

  socket.on("chat-message-sent", ({ roomCode, player, message }) => {
    io.to(roomCode).emit("chat-message-received", { player, message });
  });

  // ---------------------------------------------------  ----------------------------

  socket.on("host-started-game", async ({ roomCode }) => {
    const room = await Room.findOne({ code: roomCode }).populate("players");
    io.to(roomCode).emit("host-started-game", room);
  });
}

export default lobbyEvents;
