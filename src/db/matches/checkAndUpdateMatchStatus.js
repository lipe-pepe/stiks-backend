import Match from "../../models/Match.js";
import { updateMatchStatus } from "../matches.js";
import checkAndUpdateRoundWinner from "./checkAndUpdateRoundWinner.js";

async function checkAndUpdateMatchStatus(matchId) {
  const match = await Match.findById(matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  const allPlayersChosen = match.playersData
    .filter((player) => player.position == null)
    .every((player) => player.chosen !== null);

  if (allPlayersChosen && match.status === "choosing") {
    await updateMatchStatus(matchId, "guessing");
    return;
  }

  const allPlayersGuessed = match.playersData
    .filter((player) => player.position == null)
    .every((player) => player.guess !== null);

  if (allPlayersGuessed && match.status === "guessing") {
    await updateMatchStatus(matchId, "revealing");
    return;
  }

  const allPlayersRevealed = match.playersData
    .filter((player) => player.position == null)
    .every((player) => player.revealed == true);

  if (allPlayersRevealed && match.status === "revealing") {
    await updateMatchStatus(matchId, "results");
    return;
  }

  if (match.status === "results") {
    await checkAndUpdateRoundWinner(matchId);
  }
}

export default checkAndUpdateMatchStatus;
