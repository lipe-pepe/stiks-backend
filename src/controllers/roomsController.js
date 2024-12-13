import { Room } from "../models/index.js";

class RoomsController {
  static async createRoom(req, res, next) {
    try {
      console.log(req.body);
      // const playerName =req.body
      const roomCode = generateRoomCode();
      const roomJson = {
        code: roomCode,
        host: req.body.hostName,
      };
      const createdRoom = await Room.create(roomJson);
      res.status(201).json({ message: "Room created", room: createdRoom });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req, res, next) {
    try {
      const roomCode = req.body.code;
      const roomResult = await Room.findOneAndDelete({ code: roomCode });
      if (roomResult !== null) {
        res.status(200).send({ message: "Room was deleted" });
      } else {
        res.status(404).send({ message: "Room wasn't found" });
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
