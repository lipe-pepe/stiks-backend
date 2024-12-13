import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "The room code is required"] },
    host: { type: String },
    players: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
