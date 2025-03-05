import getNextPlayerId from "../utils/match/getNextPlayerId.js";

/* Esse serviço é um serviço de cache para manter os dados da partida em memória.
Os dados só serão persistidos no banco de dados ao final de rodadas. Isso serve para
otimizar a latência. 
*/
class MatchService {
  constructor() {
    this.matches = new Map();
  }

  // Método público para chamar a persistência do jogo
  async persistMatch(matchId) {
    await this.#saveMatchToDatabase(matchId);
  }

  getMatch(matchId) {
    return this.matches.get(matchId) || null;
  }

  createMatch(matchId, matchData) {
    this.matches.set(matchId, matchData);
  }

  // ========================================================================

  setMatchPlayerChosen(matchId, playerId, value) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return false;
    }

    const playerData = match.playersData.find(
      (p) => p.player._id.toString() === playerId
    );

    if (!playerData) {
      console.error(`Player ${playerId} not found in match ${matchId}.`);
      return false;
    }

    playerData.chosen = value;

    this.#checkChoosingStatus(matchId);
    return true; // Indica sucesso
  }

  // ========================================================================

  setMatchPlayerGuess(matchId, playerId, value) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return false;
    }

    const playerData = match.playersData.find(
      (p) => p.player._id.toString() === playerId
    );

    if (!playerData) {
      console.error(`Player ${playerId} not found in match ${matchId}.`);
      return false;
    }

    playerData.guess = value;
    match.turn = getNextPlayerId(match.playersData, match.turn);

    this.#checkGuessingStatus(matchId);
    return true;
  }

  // ========================================================================

  setMatchPlayerRevealed(matchId, playerId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return false;
    }

    const playerData = match.playersData.find(
      (p) => p.player._id.toString() === playerId
    );

    if (!playerData) {
      console.error(`Player ${playerId} not found in match ${matchId}.`);
      return false;
    }

    playerData.revealed = true;
    match.turn = getNextPlayerId(match.playersData, match.turn);

    this.#checkRevealingStatus(matchId);
    return true;
  }

  // ========================================================================

  nextRound(matchId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return false;
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
      match.turn = getNextPlayerId(match.playersData, match.turn);
      match.status = "choosing";

      return; // Se ninguém acertou, não faz nada
    }

    // 2. Atualiza o vencedor
    match.playersData[winnerIndex].total--;

    // Atualiza a posição do vencedor, se necessário
    if (match.playersData[winnerIndex].total === 0) {
      const lastPosition = match.playersData.reduce(
        (max, p) =>
          p.position !== undefined ? Math.max(max, p.position) : max,
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
      match.turn = getNextPlayerId(match.playersData, match.turn);
      match.playersData = match.playersData.map((playerData) => ({
        ...playerData,
        chosen: null,
        guess: null,
        revealed: false,
      }));
      match.status = "choosing";
      match.round++;
    }

    // Persiste os dados no banco:
    this.#saveMatchToDatabase(match);
  }

  // ========================================================================

  #checkChoosingStatus(matchId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return;
    }

    const allPlayersChosen = match.playersData
      .filter((player) => player.position == null)
      .every((player) => player.chosen !== null);

    if (allPlayersChosen && match.status === "choosing") {
      match.status = "guessing";
    }
  }

  // ========================================================================

  #checkGuessingStatus(matchId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return;
    }

    const allPlayersGuessed = match.playersData
      .filter((player) => player.position == null)
      .every((player) => player.guess !== null);

    if (allPlayersGuessed && match.status === "guessing") {
      match.status = "revealing";
    }
  }

  // ========================================================================

  #checkRevealingStatus(matchId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return;
    }

    const allPlayersRevealed = match.playersData
      .filter((player) => player.position == null)
      .every((player) => player.revealed == true);

    if (allPlayersRevealed && match.status === "revealing") {
      match.status = "results";
    }
  }

  // ========================================================================

  async #saveMatchToDatabase(matchId) {
    const match = this.matches.get(matchId);

    if (!match) {
      console.error(`Match ${matchId} not found in memory.`);
      return;
    }

    try {
      // Atualiza o documento no banco com os dados da memória
      await Match.findByIdAndUpdate(matchId, match, {
        new: true,
        upsert: true,
      });

      console.log(`Match ${matchId} saved to database.`);
    } catch (error) {
      console.error(`Error saving match ${matchId} to database:`, error);
    }
  }
}

export default new MatchService();
