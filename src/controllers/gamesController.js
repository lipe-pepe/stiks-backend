import { Room, Game } from "../models/index.js";

class GamesController {
  static async createGame(req, res, next) {
    try {
      const roomCode = req.body.roomCode;
      const roomResult = await Room.findOne({ code: roomCode });

      if (roomResult == null) {
        res.status(404).json({ message: "Game room wasn't found" });
      } else {
        // A ordem dos jogadores está sendo embaralhada
        const gamePlayers = shuffleArray(roomResult.players).map((player) => {
          return { name: player.name, sticks: 3 };
        });
        const gameJson = {
          roomCode: roomCode,
          players: gamePlayers,
          turnPlayer: gamePlayers[0].name,
        };
        const createdGame = await Game.create(gameJson);
        res.status(201).json({ message: "Game created", game: createdGame });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
  return array;
}

export default GamesController;
