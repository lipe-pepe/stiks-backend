class RoomsController {
  static createRoom() {
    return generateRoomCode();
  }
}

function generateRoomCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default RoomsController;
