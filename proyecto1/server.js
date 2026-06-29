/**
 * Servidor Express proyecto1.
 * Sirve archivos estáticos y páginas HTML.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3001;

/* Archivos estáticos por carpeta */
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/modules", express.static(path.join(__dirname, "modules")));
app.use("/data", express.static(path.join(__dirname, "data")));

/* Ruta principal */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.listen(PUERTO, () => {
  console.log(`Proyecto 1 corriendo en http://localhost:${PUERTO}`);
});