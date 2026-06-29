/**
 * Servidor Express proyecto6.
 * Persiste registros de personas en registros.txt.
 * Expone API CRUD completa.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3006;
const RUTA_DATOS = path.join(__dirname, "data", "registros.txt");

app.use(express.json());
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

/**
 * Lee todos los registros del archivo .txt.
 * Cada registro es un bloque JSON separado por "---".
 */
app.get("/api/registros", (req, res) => {
  if (!fs.existsSync(RUTA_DATOS)) return res.json([]);
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8").trim();
  if (!contenido) return res.json([]);

  const registros = contenido
    .split("\n---\n")
    .filter(Boolean)
    .map((bloque) => {
      try { return JSON.parse(bloque); }
      catch { return null; }
    })
    .filter(Boolean);

  res.json(registros);
});

/**
 * Crea un nuevo registro de persona.
 */
app.post("/api/registros", (req, res) => {
  const datos = req.body;
  if (!datos.id || !datos.nombre) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  const bloque = JSON.stringify(datos) + "\n---\n";
  fs.appendFileSync(RUTA_DATOS, bloque, "utf-8");
  res.json({ ok: true });
});

/**
 * Modifica un registro existente por su ID.
 */
app.put("/api/registros/:id", (req, res) => {
  const { id } = req.params;
  const nuevosDatos = req.body;

  if (!fs.existsSync(RUTA_DATOS)) return res.status(404).json({ error: "No hay datos." });

  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8").trim();
  const bloques = contenido.split("\n---\n").filter(Boolean);
  const actualizados = bloques.map((bloque) => {
    try {
      const obj = JSON.parse(bloque);
      if (obj.id === id) return JSON.stringify({ ...obj, ...nuevosDatos });
      return bloque;
    } catch { return bloque; }
  });

  fs.writeFileSync(RUTA_DATOS, actualizados.join("\n---\n") + "\n---\n", "utf-8");
  res.json({ ok: true });
});

/**
 * Elimina un registro por su ID.
 */
app.delete("/api/registros/:id", (req, res) => {
  const { id } = req.params;
  if (!fs.existsSync(RUTA_DATOS)) return res.status(404).json({ error: "No hay datos." });

  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8").trim();
  const bloques = contenido.split("\n---\n").filter(Boolean);
  const filtrados = bloques.filter((bloque) => {
    try { return JSON.parse(bloque).id !== id; }
    catch { return true; }
  });

  fs.writeFileSync(
    RUTA_DATOS,
    filtrados.length ? filtrados.join("\n---\n") + "\n---\n" : "",
    "utf-8"
  );
  res.json({ ok: true });
});

/**
 * Descarga el archivo .txt completo de registros.
 */
app.get("/api/descargar", (req, res) => {
  if (!fs.existsSync(RUTA_DATOS)) {
    return res.status(404).json({ error: "No hay registros." });
  }
  res.download(RUTA_DATOS, "registros.txt");
});

app.listen(PUERTO, () => {
  console.log(`Proyecto 6 corriendo en http://localhost:${PUERTO}`);
});