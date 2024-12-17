import { Room } from "../models/index.js";
import HttpStatus from "../utils/httpStatus.js";
import { deletePlayer } from "./players.js";

// -------------------------------------------------------------------------

async function deleteRoom(roomCode) {
  try {
    const result = await Room.findOneAndDelete({ code: roomCode });
    if (result) {
      return { success: true, message: "Room deleted successfully" };
    } else {
      return { success: false, message: "Couldn't find the room" };
    }
  } catch (error) {
    throw new Error("An error occurred deleting the room: " + error.message);
  }
}

// -------------------------------------------------------------------------

export { deleteRoom };
