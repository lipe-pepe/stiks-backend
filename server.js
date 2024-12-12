import "dotenv/config"; // Inicia o dotenv na aplicação, isso deve ser feito no arquivo mais externo
import app from "./src/app.js";

// Porta que será usada na aplicação
const PORT = 3030;

// Ouve as conexões
app.listen(PORT, () => {
  console.log("Servidor escutando...");
});
