import Match from "../models/Match.js";

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

export { getMatch, updateMatchPlayer };
