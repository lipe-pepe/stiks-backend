import getNextPlayerId from "../utils/match/getNextPlayerId.js";

/* Esse serviço é um serviço de cache para manter os dados da partida em memória.
Os dados só serão persistidos no banco de dados ao final de rodadas. Isso serve para
otimizar a latência. 
*/
class MatchService {
  constructor() {
    this.matches = new Map();
  }

  getMatch(matchId) {
    return this.matches.get(matchId) || null;
  }

  createMatch(matchId, matchData) {
    this.matches.set(matchId, matchData);
  }

  updateMatch(matchId, updatedData) {}

  deleteMatch(matchId) {}

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

  saveMatchToDatabase(matchModel) {
    // Implementar a lógica para persistir no MongoDB
  }
}

export default new MatchService();
