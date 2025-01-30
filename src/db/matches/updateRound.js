import Match from "../../models/Match.js";
import updateMatchTurn from "./updateMatchTurn.js";

// Passa para a próxima rodada atualizando a rodada resetando os dados necessários
async function updateRound(matchId) {
  const match = await Match.findById(matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  await updateMatchTurn(matchId);

  match.playersData = match.playersData.map((playerData) => ({
    ...playerData,
    chosen: null,
    guess: null,
    revealed: false,
  }));
  match.status = "choosing";
  match.round++;

  await match.save();
}

export default updateRound;
