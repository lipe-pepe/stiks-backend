import Match from "../../models/Match.js";
import { updateMatchStatus } from "../matches.js";

async function checkAndUpdateMatchStatus(matchId) {
  const match = await Match.findById(matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  const allPlayersChosen = match.playersData.every(
    (player) => player.chosen !== null
  );

  if (allPlayersChosen && match.status === "choosing") {
    await updateMatchStatus(matchId, "guessing");
    return;
  }

  const allPlayersGuessed = match.playersData.every(
    (player) => player.guess !== null
  );

  if (allPlayersGuessed && match.status === "guessing") {
    await updateMatchStatus(matchId, "revealing");
    return;
  }
}

export default checkAndUpdateMatchStatus;
