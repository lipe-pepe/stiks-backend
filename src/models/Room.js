import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "The room code is required"] },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "players" }], // Referência ao modelo Player
    match: { type: mongoose.Schema.Types.ObjectId, ref: "matches" }, // Referência ao modelo Match
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
