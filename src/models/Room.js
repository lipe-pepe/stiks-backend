import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "The room code is required"] },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "players" }], // Referência ao modelo Player
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
