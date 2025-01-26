import HttpStatus from "../utils/httpStatus.js";
import Room from "../models/Room.js";
import Match from "../models/Match.js";

class MatchesController {
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

      // Criar a partida com valores obrigatórios
      const match = await Match.create({});

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
