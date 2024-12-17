import { Room } from "../models/index.js";
import HttpStatus from "../utils/httpStatus.js";
import { deletePlayer } from "./players.js";

async function removePlayerFromRoom(roomCode, playerName) {
  try {
    // Verifica se a sala existe
    const room = await Room.findOne({ code: roomCode }).populate("players");
    if (!room) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Room not found",
      };
    }
    // Verifica se o jogador já está na sala
    const player = room.players.find((player) => player.name === playerName);
    const playerId = player !== null ? player._id : null;
    if (playerId == null) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Player isn't in the room",
        room,
      };
    }

    // Remove o jogador da sala
    const newPlayersArray = room.players.filter(
      (player) => player.name !== playerName
    );
    room.players = newPlayersArray;
    await room.save();

    // Apaga o jogador
    const result = await deletePlayer();
    if (result.NOT_FOUND) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Player wasn't found",
      };
    }
    return { status: HttpStatus.OK, message: "Player removed from room", room };
  } catch (error) {
    throw new Error(
      "An error occurred while removing the player: " + error.message
    );
  }
}

// -------------------------------------------------------------------------

async function deleteRoom(roomCode) {
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

// -------------------------------------------------------------------------

export { removePlayerFromRoom, deleteRoom };
