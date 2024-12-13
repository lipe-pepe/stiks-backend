import { Room } from "../models/index.js";

class RoomsController {
  static async getRoom(req, res, next) {
    try {
      const code = req.params.code;
      const roomResult = await Room.findOne({ code: code });
      if (roomResult !== null) {
        res.status(200).json({ message: "Room found", room: roomResult });
      } else {
        res.status(404).json({ message: "Room not found" });
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

  // -------------------------------------------------------------------------

  static async addPlayerToRoom(roomCode, playerName) {
    try {
      // Verifica se a sala existe
      const room = await Room.findOne({ code: roomCode });
      if (!room) {
        return { success: false, message: "Room not found" };
      }

      // Verifica se o jogador já está na sala
      const playerExists = room.players.some(
        (player) => player.name === playerName
      );
      if (playerExists) {
        return { success: false, message: "Player already in the room" };
      }

      // Adiciona o jogador à sala
      room.players.push({ name: playerName });
      await room.save();
      return { success: true, message: "Player added to room", room };
    } catch (error) {
      throw new Error(
        "An error occurred while adding the player: " + error.message
      );
    }
  }

  static async removePlayerFromRoom(roomCode, playerName) {
    try {
      // Verifica se a sala existe
      const room = await Room.findOne({ code: roomCode });
      if (!room) {
        return { success: false, message: "Room not found" };
      }

      // Verifica se o jogador já está na sala
      const playerExists = room.players.some(
        (player) => player.name === playerName
      );
      if (!playerExists) {
        return { success: false, message: "Player isn't in the room" };
      }

      // Remove o jogador da sala
      const newPlayersArray = room.players.filter(
        (player) => player.name !== playerName
      );
      room.players = newPlayersArray;
      await room.save();
      return { success: true, message: "Player removed from room", room };
    } catch (error) {
      throw new Error(
        "An error occurred while removing the player: " + error.message
      );
    }
  }

  static async deleteRoom(roomCode) {
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
