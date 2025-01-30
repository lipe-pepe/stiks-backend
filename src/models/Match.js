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
    playersData: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "players",
          required: true,
        }, // Referência ao jogador
        total: { type: Number, default: 3 }, // O número total de palitos na mão do jogador
        chosen: { type: Number }, // O número de palitos escolhidos na rodada
        guess: { type: Number }, // O número de palitos palpitado
        revealed: { type: Boolean, default: false },
      },
    ],
    turn: { type: mongoose.Schema.Types.ObjectId }, // Id do jogador da vez atual
  },
  { versionKey: false }
);

const Match = mongoose.model("matches", matchSchema);

export default Match;
