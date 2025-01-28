import HttpStatus from "../utils/httpStatus.js";
import Room from "../models/Room.js";
import Match from "../models/Match.js";

class MatchesController {
  static async getMatch(req, res, next) {
    try {
      const id = req.params.id;
      const match = await Match.findById(id).populate("playersData.player");
      if (match == null) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Match not found" });
      } else {
        res.status(HttpStatus.OK).json({ message: "Match found", match });
      }
    } catch (error) {
      next(error);
    }
  }

  static async createMatch(req, res, next) {
    try {
      const roomCode = req.body.roomCode;

      // Verificar se a sala existe
      const room = await Room.findOne({ code: roomCode });
      if (room == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Couldn't find room ${roomCode}` });
      }

      // Inicializar playersData com os dados dos jogadores da sala
      const playersData = room.players.map((player) => ({
        player: player._id,
        total: 3,
        chosen: null,
        guess: null,
        revealed: false,
      }));

      // Criar a partida com os dados obrigatórios e playersData
      const match = await Match.create({
        playersData, // Passar os dados inicializados dos jogadores
      });

      if (!match) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Couldn't create match" });
      }

      // Associar a partida à sala
      room.match = match._id;
      await room.save();

      // Retornar resposta ao cliente
      res.status(HttpStatus.CREATED).json({ message: "Match created", match });
    } catch (error) {
      // Tratar erros
      next(error);
    }
  }
}

export default MatchesController;
