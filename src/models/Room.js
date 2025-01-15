import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "The room code is required"] },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "players" }], // Referência ao modelo Player
    round: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["choosing", "guessing", "revealing", "results"], // Valores permitidos
      required: true, // Torna o campo obrigatório
      default: "choosing", // Valor padrão
    },
    first_turn: { type: mongoose.Schema.Types.ObjectId, ref: "player" }, // Jogador que será o primeiro a jogar
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
