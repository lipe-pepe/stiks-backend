/* Esse serviço é um serviço de cache para manter os dados da partida em memória.
Os dados só serão persistidos no banco de dados ao final de rodadas. Isso serve para
otimizar a latência. 
*/

class MatchService {
  constructor() {
    this.matches = new Map();
  }

  getMatch(matchId) {
    console.log("MATCH CACHE: ", this.matches);
    return this.matches.get(matchId) || null;
  }

  createMatch(matchId, matchData) {
    this.matches.set(matchId, matchData);
  }

  updateMatch(matchId, updatedData) {}

  deleteMatch(matchId) {}

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
    return true; // Indica sucesso
  }

  saveMatchToDatabase(matchModel) {
    // Implementar a lógica para persistir no MongoDB
  }
}

export default new MatchService();
