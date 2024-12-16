import { createPlayer } from "../db/players.js";
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
      const playerJson = req.body;
      const result = await createPlayer(playerJson);
      if (result.player != null) {
        const roomJson = {
          code: roomCode,
          status: "in_lobby",
          players: [result.player],
        };
        const createdRoom = await Room.create(roomJson);
        res
          .status(HttpStatus.CREATED)
          .json({ message: "Room created", room: createdRoom });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal server error" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async addPlayer(req, res, next) {
    try {
      const roomCode = req.params.code;
      const player = req.body;
      const result = await addPlayerToRoom(roomCode, player);
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
