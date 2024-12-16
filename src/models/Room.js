import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "The room code is required"] },
    status: {
      type: String,
      enum: ["in_lobby", "in_game"], // Valores permitidos
      required: true, // Torna o campo obrigatório
      default: "lobby", // Valor padrão
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Referência ao modelo Player
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" }, // Referência ao modelo Match
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
