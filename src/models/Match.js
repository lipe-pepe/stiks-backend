import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    round: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["choosing", "guessing", "revealing", "results", "end"], // Valores permitidos
      required: true, // Torna o campo obrigatório
      default: "choosing", // Valor padrão
    },
  },
  { versionKey: false }
);

const Match = mongoose.model("matches", matchSchema);

export default Match;
