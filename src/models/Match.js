import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    round: { type: Number },
    status: {
      type: String,
      enum: ["choosing", "guessing", "revealing"], // Valores permitidos
      required: true, // Torna o campo obrigatório
      default: "choosing", // Valor padrão
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // Relacionamento reverso
  },
  { versionKey: false }
);

const Match = mongoose.model("matches", matchSchema);

export default Match;
