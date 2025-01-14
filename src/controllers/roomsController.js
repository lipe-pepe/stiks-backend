import { Room } from "../models/index.js";

import HttpStatus from "../utils/httpStatus.js";

class RoomsController {
  static async getRoom(req, res, next) {
    try {
      const code = req.params.code;
      const roomResult = await Room.findOne({ code: code }).populate("players");
      if (roomResult !== null) {
        res
          .status(HttpStatus.OK)
          .json({ message: "Room found", room: roomResult });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Room not found" });
      }
    } catch (error) {
      next(error);
    }
  }
  static async createRoom(req, res, next) {
    try {
      const roomJson = {
        code: generateRoomCode(),
      };
      const createdRoom = await Room.create(roomJson);
      if (createdRoom != null) {
        res
          .status(HttpStatus.CREATED)
          .json({ message: "Room created", room: createdRoom });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Bad request" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req, res, next) {
    try {
      const roomCode = req.body.code;
      const roomResult = await Room.findOneAndDelete({ code: roomCode });
      if (roomResult !== null) {
        res.status(HttpStatus.OK).send({ message: "Room was deleted" });
      } else {
        res.status(HttpStatus.NOT_FOUND).send({ message: "Room wasn't found" });
      }
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
