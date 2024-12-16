import { Room } from "../models/index.js";
import HttpStatus from "../utils/httpStatus.js";

// -------------------------------------------------------------------------

async function addPlayerToRoom(roomCode, { name, avatar }) {
  try {
    console.log(name, avatar);
    // Verifica se a sala existe
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Room not found",
      };
    }

    // Verifica se o jogador já está na sala
    const playerExists = room.players.some((player) => player.name === name);
    if (playerExists) {
      return {
        status: HttpStatus.CONFLICT,
        message: "Player already in the room",
        room,
      };
    }

    // Adiciona o jogador à sala
    room.players.push({ name, avatar });
    await room.save();
    return {
      status: HttpStatus.OK,
      message: "Player added to room",
      room,
    };
  } catch (error) {
    throw new Error(
      "An error occurred while adding the player: " + error.message
    );
  }
}

// -------------------------------------------------------------------------

async function removePlayerFromRoom(roomCode, playerName) {
  try {
    // Verifica se a sala existe
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Room not found",
      };
    }

    // Verifica se o jogador já está na sala
    const playerExists = room.players.some(
      (player) => player.name === playerName
    );
    if (!playerExists) {
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

export { addPlayerToRoom, removePlayerFromRoom, deleteRoom };
