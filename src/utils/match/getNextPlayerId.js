function getNextPlayerId(playersData, currentPlayerId) {
  const currentIndex = playersData.findIndex(
    (player) => player.player._id.toString() === currentPlayerId
  );

  if (currentIndex === -1) return null; // Se não encontrou o player atual

  const nextIndex = (currentIndex + 1) % playersData.length; // Ciclo infinito
  return playersData[nextIndex].player._id;
}

export default getNextPlayerId;
