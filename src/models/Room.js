import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    code: { type: String, required: [true, "The room code is required"] },
  },
  { versionKey: false }
);

const Room = mongoose.model("rooms", roomSchema);

export default Room;
