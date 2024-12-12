import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import routes from "./routes/index.js";

// Cria a conexão com o banco de dados
const connection = await dbConnect();

// * OBS: As strings que são usadas nos eventos da conexão abaixo,
// * como 'error' e 'open', são configurações próprias da lib mongoose,
// * responsável por interfacear o MongoDB com a aplicação.

// Se receber um evento error na conexão, imprimimos no console
connection.on("error", (erro) => {
  console.error("DB connection error: ", error);
});

// Se receber um evento open na conexão, logamos no console
connection.once("open", () => {
  console.log("Database connected");
});

// ==========================================================================================

const app = express();
routes(app); // inicia as rotas

// TODO: Organizar middlewares
// Configura uma origem específica para o cors
app.use(
  cors({
    origin: "http://localhost:3000", // Origem do frontend
  })
);

export default app;
