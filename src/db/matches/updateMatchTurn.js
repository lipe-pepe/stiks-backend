import Match from "../../models/Match.js";
import getNextPlayerId from "../../utils/match/getNextPlayerId.js";

async function updateMatchTurn(matchId) {
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error("Match not found");
  }

  match.turn = getNextPlayerId(match.playersData, match.turn);
  await match.save();
}

export default updateMatchTurn;
