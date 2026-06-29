/**
 * Servidor Express proyecto2.
 * Sirve múltiples páginas HTML con rutas individuales.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3002;

app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

/* Rutas de cada componente */
const paginas = [
  "index",
  "eventos-click",
  "eventos-teclado",
  "eventos-foco",
  "eventos-raton",
  "eventos-formulario",
];

paginas.forEach((pagina) => {
  app.get(`/${pagina === "index" ? "" : pagina}`, (req, res) => {
    res.sendFile(path.join(__dirname, "pages", `${pagina}.html`));
  });
});

app.listen(PUERTO, () => {
  console.log(`Proyecto 2 corriendo en http://localhost:${PUERTO}`);
});