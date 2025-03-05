import HttpStatus from "../utils/httpStatus.js";
import Room from "../models/Room.js";
import Match from "../models/Match.js";
import checkAndUpdateMatchStatus from "../db/matches/checkAndUpdateMatchStatus.js";
import MatchService from "../services/matchService.js";

class MatchesController {
  static async getMatch(req, res, next) {
    try {
      const id = req.params.id;

      // Busca a partida na memória (cache)
      let match = MatchService.getMatch(id);

      if (!match) {
        // Se a partida não estiver na memória, busca no banco e salva na memória
        match = await Match.findById(id).populate("playersData.player");
        if (match) {
          MatchService.createMatch(id, match.toObject());
        }
      }

      if (!match) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Match not found" });
      }

      return res.status(HttpStatus.OK).json({ message: "Match found", match });
    } catch (error) {
      next(error);
    }
  }

  // =============================================================================================

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

      // Verificar mínimo de jogadores na sala
      if (room.players.length < 2) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ error: "minimum_players" });
      }

      // Inicializar playersData com os dados dos jogadores da sala
      const playersData = room.players.map((player) => ({
        player: player._id,
        total: 3,
        chosen: null,
        guess: null,
        revealed: false,
        position: null,
      }));

      // Criar a partida com os dados obrigatórios e playersData
      const match = await Match.create({
        playersData, // Passar os dados inicializados dos jogadores
        turn: room.players[0]._id,
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

  // =============================================================================================

  static async updateMatch(req, res, next) {
    try {
      const id = req.params.id;
      await checkAndUpdateMatchStatus(id);
      res.status(HttpStatus.OK).json({ message: "Match updated" });
    } catch (error) {
      next(error);
    }
  }

  // =============================================================================================

  static async updateMatchPlayerData(req, res, next) {
    try {
      const id = req.params.id;
      const playerId = req.params.playerId;
      const data = req.body.update;

      // Validação: garantir que o corpo da requisição tenha campos para atualizar
      if (!data || Object.keys(data).length === 0) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "No fields were received to update." });
      }

      let result = false;
      // Atualiza a partida na memória
      if (data.chosen) {
        result = MatchService.setMatchPlayerChosen(id, playerId, data.chosen);
      } else if (data.guess) {
        result = MatchService.setMatchPlayerGuess(id, playerId, data.guess);
      }
      if (!result) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Match or Player not found", error: "not_found" });
      }

      // // Se "guess" ou "revealed" foi enviado, atualiza o turno para o próximo jogador
      // if (data.guess !== undefined || data.revealed !== undefined) {
      //   await updateMatchTurn(id);
      // }

      // // Após atualizar o jogador, verifica o status da partida
      // await checkAndUpdateMatchStatus(id);

      return res.status(HttpStatus.OK).json({ message: "Updated" });
    } catch (error) {
      next(error); // TODO: Tratar erros assim com o next
    }
  }
}

export default MatchesController;
