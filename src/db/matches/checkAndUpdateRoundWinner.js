import Match from "../../models/Match.js";
import updateRound from "./updateRound.js";

async function checkAndUpdateRoundWinner(matchId) {
  const match = await Match.findById(matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  // 1. Encontra o vencedor da rodada

  const totalChosen = match.playersData.reduce(
    (sum, p) => sum + (p.chosen ?? 0),
    0
  ); // Soma todos os valores de `chosen`, ignorando `null`

  const winnerIndex = match.playersData.findIndex(
    (p) => p.guess === totalChosen
  ); // Encontra o player que acertou o palpite
  if (winnerIndex === -1) {
    await updateRound(matchId);
    return; // Se ninguém acertou, não faz nada
  }

  // 2. Atualiza o vencedor

  match.playersData[winnerIndex].total--;

  // Atualiza a posição do vencedor, se necessário
  if (match.playersData[winnerIndex].total === 0) {
    const lastPosition = match.playersData.reduce(
      (max, p) => (p.position !== undefined ? Math.max(max, p.position) : max),
      0
    );
    match.playersData[winnerIndex].position = lastPosition + 1;
  }

  // 3. Atualiza fim da partida

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
