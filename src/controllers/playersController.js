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
      await room.save();
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Player created", player });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================================

  static async deletePlayer(req, res, next) {
    try {
      const playerId = req.params.id;
      const deletedPlayer = await Player.findByIdAndDelete(playerId);
      if (!deletedPlayer) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Player not found" });
      }
      // Atualizar todas as salas, removendo o ID do jogador do array `players`
      const updateResult = await Room.updateMany(
        { players: playerId }, // Encontra salas que tem o jogador
        { $pull: { players: playerId } } // Remove o ID do jogador do array
      );
      res.status(HttpStatus.OK).json({ message: "Player was deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default PlayersController;
