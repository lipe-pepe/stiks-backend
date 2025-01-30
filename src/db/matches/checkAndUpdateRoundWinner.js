import Match from "../../models/Match.js";
import updateRound from "./updateRound.js";

async function checkAndUpdateRoundWinner(matchId) {
  const match = await Match.findById(matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  // Soma todos os valores de `chosen`, ignorando `null`
  const totalChosen = match.playersData.reduce(
    (sum, p) => sum + (p.chosen ?? 0),
    0
  );

  // Encontra o player que acertou o palpite
  const winnerIndex = match.playersData.findIndex(
    (p) => p.guess === totalChosen
  );
  if (winnerIndex === -1) {
    await updateRound(matchId);
    return; // Se ninguém acertou, não faz nada
  }

  // Decrementa o total do vencedor
  match.playersData[winnerIndex].total--;

  // Verifica quantos jogadores têm total > 0
  const playersWithPoints = match.playersData.filter((p) => p.total > 0);

  // Se sobrou só um player, atualiza o status para "end", senão começa uma nova rodada
  if (playersWithPoints.length === 1) {
    match.status = "end";
  } else {
    await updateRound(matchId);
  }

  await match.save();
}

export default checkAndUpdateRoundWinner;
