import { Room } from "../models/index.js";

class RoomsController {
  static async createRoom(req, res, next) {
    try {
      const roomCode = generateRoomCode();
      const roomJson = {
        code: roomCode,
      };
      const createdRoom = await Room.create(roomJson);
      res.status(201).json({ message: "Room created", room: createdRoom });
    } catch (error) {
      next(error);
    }
  }
}

// ================================================================================================

function generateRoomCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default RoomsController;
