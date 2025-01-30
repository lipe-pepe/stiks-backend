import Match from "../../models/Match.js";

async function updateMatchTurn(matchId) {
  const match = await Match.findById(matchId);
  console.log("ANTES DE ATUALIZAR TURN:", match);
  if (!match) {
    throw new Error("Match not found");
  }

  match.turn = getNextPlayerId(match.playersData, match.turn);
  await match.save();
}

export default updateMatchTurn;
