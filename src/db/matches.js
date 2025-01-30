import Match from "../models/Match.js";
import getNextPlayerId from "../utils/match/getNextPlayerId.js";

// Retorna uma match no formato que o frontend está preparado para ler
async function getMatch(matchId) {
  return await Match.findById(matchId).populate("playersData.player");
}

async function updateMatchPlayer(matchId, playerId, data) {
  // Monta dinamicamente o objeto para atualização, garantindo que só os campos recebidos sejam atualizados
  const updateFields = Object.entries(data).reduce(
    (acc, [key, value]) => ({ ...acc, [`playersData.$.${key}`]: value }),
    {}
  );

  // Atualiza o documento no MongoDB
  return await Match.updateOne(
    { _id: matchId, "playersData.player": playerId },
    { $set: updateFields }
  );
}

async function updateMatchStatus(matchId, status) {
  await Match.updateOne({ _id: matchId }, { $set: { status } });
}

async function updateMatchTurn(matchId) {
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error("Match not found");
  }

  match.turn = getNextPlayerId(match.playersData, match.turn);
  await match.save();
}

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
  }
}

export {
  getMatch,
  updateMatchPlayer,
  updateMatchTurn,
  checkAndUpdateMatchStatus,
};
