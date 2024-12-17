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

  socket.on("player-left", async ({ roomCode }) => {
    socket.leave(roomCode); // Remove o jogador da sala no socket

    const room = await Room.findOne({ code: roomCode }).populate("players");
    // Emitir para todos os clientes da sala
    io.to(roomCode).emit("player-left", room);
  });

  // -------------------------------------------------------------------------------

  socket.on("chat-message-sent", ({ roomCode, message }) => {
    io.to(roomCode).emit("chat-message-received", message);
  });

  // ---------------------------------------------------  ----------------------------

  socket.on("host-started-game", async ({ roomCode }) => {
    const room = await Room.findOne({ code: roomCode })
      .populate("players")
      .populate("matches");
    io.to(roomCode).emit("host-started-game", room);
  });
}

export default lobbyEvents;
