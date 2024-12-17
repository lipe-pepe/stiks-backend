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

export { createPlayer };
