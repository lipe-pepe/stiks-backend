import { addPlayerToRoom } from "../db/rooms.js";
import { Room } from "../models/index.js";

import HttpStatus from "../utils/httpStatus.js";

class RoomsController {
  static async getRoom(req, res, next) {
    try {
      const code = req.params.code;
      const roomResult = await Room.findOne({ code: code });
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
      const roomCode = generateRoomCode();

      const hostName = req.body.hostName;
      const roomJson = {
        code: roomCode,
        host: hostName,
        players: [{ name: hostName, avatar: req.body.avatar }],
      };
      const createdRoom = await Room.create(roomJson);
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Room created", room: createdRoom });
    } catch (error) {
      next(error);
    }
  }

  static async addPlayer(req, res, next) {
    try {
      const roomCode = req.params.code;
      const result = await addPlayerToRoom(roomCode, req.body);
      if (result.status === HttpStatus.CONFLICT) {
        res
          .status(HttpStatus.CONFLICT)
          .json({ message: "Já tem um jogador na sala com esse nome!" });
      } else {
        res.status(result.status).json({ message: result.message });
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
