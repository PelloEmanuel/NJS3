/**
 * Servidor Express proyecto5.
 * Gestiona elementos HTML via innerHTML con persistencia en .txt.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3005;
const RUTA_DATOS = path.join(__dirname, "data", "elementos.txt");

app.use(express.json());
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

/**
 * Lee los elementos guardados en el .txt.
 */
app.get("/api/elementos", (req, res) => {
  if (!fs.existsSync(RUTA_DATOS)) return res.json([]);
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8").trim();
  if (!contenido) return res.json([]);

  const elementos = contenido.split("\n---\n").filter(Boolean).map((bloque) => {
    const lineas = bloque.split("\n");
    const id = lineas[0].replace("ID:", "").trim();
    const tipo = lineas[1].replace("TIPO:", "").trim();
    const contenidoHtml = lineas.slice(2).join("\n").replace("HTML:", "").trim();
    return { id, tipo, contenidoHtml };
  });
  res.json(elementos);
});

/**
 * Guarda un nuevo elemento en el .txt.
 */
app.post("/api/elementos", (req, res) => {
  const { id, tipo, contenidoHtml } = req.body;
  if (!id || !tipo || !contenidoHtml) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  const bloque = `ID:${id}\nTIPO:${tipo}\nHTML:${contenidoHtml}\n---\n`;
  fs.appendFileSync(RUTA_DATOS, bloque, "utf-8");
  res.json({ ok: true });
});

/**
 * Modifica un elemento existente en el .txt.
 */
app.put("/api/elementos/:id", (req, res) => {
  const { id } = req.params;
  const { tipo, contenidoHtml } = req.body;

  if (!fs.existsSync(RUTA_DATOS)) return res.status(404).json({ error: "No hay datos." });

  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8");
  const bloques = contenido.split("\n---\n").filter(Boolean);
  const nuevosBloques = bloques.map((bloque) => {
    const lineas = bloque.split("\n");
    if (lineas[0] === `ID:${id}`) {
      return `ID:${id}\nTIPO:${tipo}\nHTML:${contenidoHtml}`;
    }
    return bloque;
  });

  fs.writeFileSync(RUTA_DATOS, nuevosBloques.join("\n---\n") + "\n---\n", "utf-8");
  res.json({ ok: true });
});

/**
 * Elimina un elemento del .txt por su ID.
 */
app.delete("/api/elementos/:id", (req, res) => {
  const { id } = req.params;
  if (!fs.existsSync(RUTA_DATOS)) return res.status(404).json({ error: "No hay datos." });

  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8");
  const bloques = contenido.split("\n---\n").filter(Boolean);
  const filtrados = bloques.filter((b) => !b.startsWith(`ID:${id}`));
  fs.writeFileSync(
    RUTA_DATOS,
    filtrados.length ? filtrados.join("\n---\n") + "\n---\n" : "",
    "utf-8"
  );
  res.json({ ok: true });
});

app.listen(PUERTO, () => {
  console.log(`Proyecto 5 corriendo en http://localhost:${PUERTO}`);
});