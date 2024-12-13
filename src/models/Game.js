// Esse modelo guarda o estado do jogo.
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    room: { type: mongoose.ObjectId },
    state: {
      type: String,
      enum: ["choosing", "guessing", "revealing"], // Define os valores permitidos para o campo
      required: true,
      default: "choosing",
    },
    players: [
      {
        name: { type: String, required: true },
        sticks: { type: Number },
        chosen: { type: Number },
        guess: { type: Number },
      },
    ],
    turnPlayer: { type: String },
  },
  { versionKey: false }
);

const Game = mongoose.model("games", gameSchema);

export default Game;
