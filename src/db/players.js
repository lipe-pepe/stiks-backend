import Player from "../models/Player.js";
import HttpStatus from "../utils/httpStatus.js";

async function createPlayer({ name, avatar, stik, role }) {
  try {
    const player = await Player.create({ name, avatar, stik, role });
    if (player != null) {
      return {
        status: HttpStatus.CREATED,
        message: "Player created",
        player,
      };
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  } catch (error) {
    throw new Error(
      "An error occurred while creating the player: " + error.message
    );
  }
}

// async function deletePlayer({playerId}) {
//     try {
//       const playerId = req.params.id;
//       const deletedPlayer = await Player.findByIdAndDelete(playerId);
//       if (!deletedPlayer) {
//         res.status(HttpStatus.NOT_FOUND).json({ message: "Player not found" });
//       }
//       // Atualizar todas as salas, removendo o ID do jogador do array `players`
//       const updateResult = await Room.updateMany(
//         { players: playerId }, // Encontra salas que tem o jogador
//         { $pull: { players: playerId } } // Remove o ID do jogador do array
//       );
//       res.status(HttpStatus.OK).json({ message: "Player was deleted" });
//     } catch (error) {
//       next(error);
//     }
//   }

export { createPlayer };
