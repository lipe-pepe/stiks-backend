import Match from "../models/Match.js";
import getNextPlayerId from "../utils/match/getNextPlayerId.js";

// Retorna uma match no formato que o frontend está preparado para ler
async function getMatch(matchId) {
  return await Match.findById(matchId).populate("playersData.player");
}

async function updateMatchStatus(matchId, status) {
  await Match.updateOne({ _id: matchId }, { $set: { status } });
}

export { getMatch, updateMatchStatus };
