import Player from "../models/Player.js";
import Room from "../models/Room.js";
import HttpStatus from "../utils/httpStatus.js";

class PlayersController {
  static async createPlayer(req, res, next) {
    try {
      const playerData = req.body.player;
      const roomCode = req.body.roomCode;

      const room = await Room.findOne({ code: roomCode });
      if (room == null) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Couldn't find room ${roomCode}` });
      }

      playerData["room"] = room._id; // Adiciona a sala ao jogador
      const player = await Player.create(playerData);
      if (player == null) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Bad request" });
      }

      room.players.push(player); // Adiciona o jogador à sala
      await room.save;
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Player created", player });
    } catch (error) {
      next(error);
    }
  }
}

export default PlayersController;
