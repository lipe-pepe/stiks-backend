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

  saveMatchToDatabase(matchModel) {
    // Implementar a lógica para persistir no MongoDB
  }
}

export default new MatchService();
