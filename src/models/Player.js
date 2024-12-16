import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nome escolhido pelo player
    avatar: { type: String, required: true }, // Avatar selecionado pelo player
    stik: { type: String }, // Palitinho selecionado pelo player
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // Relacionamento reverso
  },
  { versionKey: false }
);

const Player = mongoose.model("players", playerSchema);

export default Player;
