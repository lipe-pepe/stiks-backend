function getNextPlayerId(playersData, currentPlayerId) {
  // Remove os jogadores que já ganharam da lógica
  const filtered = playersData.filter((p) => p.position == null);

  const currentIndex = filtered.findIndex((p) => {
    return p.player._id.toString() === currentPlayerId.toString();
  });

  if (currentIndex === -1) return null; // Se não encontrou o player atual

  const nextIndex = (currentIndex + 1) % filtered.length; // Ciclo infinito
  return filtered[nextIndex].player._id;
}

export default getNextPlayerId;
