import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nome escolhido pelo player
    role: {
      type: String,
      enum: ["host", "player", "spectator"], // Valores permitidos
      required: true, // Torna o campo obrigatório
      default: "player", // Valor padrão
    },
    avatar: { type: String, required: true }, // Avatar selecionado pelo player
    stik: { type: String }, // Palitinho selecionado pelo player
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // Relacionamento reverso
  },
  { versionKey: false }
);

const Player = mongoose.model("players", playerSchema);

export default Player;
