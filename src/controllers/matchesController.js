import Match from "../models/Match.js";
import Room from "../models/Room.js";
import HttpStatus from "../utils/httpStatus.js";

class MatchesController {
  static async createMatch(req, res, next) {
    try {
      const roomCode = req.body.roomCode;
      const room = await Room.findOne({ code: roomCode }).populate("players");
      if (room == null) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Couldn't find room ${roomCode}` });
      }

      const match = await Match.create({ room }); // Cria a partida com o id da sala
      if (match == null) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Bad request" });
      }

      room.match = match; // Adiciona a partida à sala
      room.players.forEach((player) => {
        player.gameData.total = match.config.playerSticks;
      });
      await room.save();
      res.status(HttpStatus.CREATED).json({ message: "Match created", match });
    } catch (error) {
      next(error);
    }
  }
}

export default MatchesController;
