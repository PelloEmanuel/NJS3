/**
 * Servidor Express proyecto4.
 * Gestiona nodos <a> con CRUD y persiste en nodos.txt.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3004;
const RUTA_DATOS = path.join(__dirname, "data", "nodos.txt");

app.use(express.json());
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/modules", express.static(path.join(__dirname, "modules")));

/* Ruta principal */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

/**
 * Lee todos los nodos desde el archivo .txt.
 * Retorna array de objetos { id, etiqueta, href }.
 */
app.get("/api/nodos", (req, res) => {
  if (!fs.existsSync(RUTA_DATOS)) {
    return res.json([]);
  }
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8").trim();
  if (!contenido) return res.json([]);

  const nodos = contenido.split("\n").map((linea) => {
    const [id, etiqueta, href] = linea.split("|");
    return { id, etiqueta, href };
  });
  res.json(nodos);
});

/**
 * Crea un nuevo nodo y lo guarda en el archivo .txt.
 */
app.post("/api/nodos", (req, res) => {
  const { id, etiqueta, href } = req.body;

  if (!id || !etiqueta || !href) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const linea = `${id}|${etiqueta}|${href}\n`;
  fs.appendFileSync(RUTA_DATOS, linea, "utf-8");
  res.json({ ok: true, mensaje: "Nodo creado correctamente." });
});

/**
 * Modifica un nodo existente por su ID en el archivo .txt.
 */
app.put("/api/nodos/:id", (req, res) => {
  const { id } = req.params;
  const { etiqueta, href } = req.body;

  if (!fs.existsSync(RUTA_DATOS)) {
    return res.status(404).json({ error: "No existen nodos." });
  }

  const lineas = fs.readFileSync(RUTA_DATOS, "utf-8").split("\n").filter(Boolean);
  const nuevasLineas = lineas.map((linea) => {
    const partes = linea.split("|");
    if (partes[0] === id) {
      return `${id}|${etiqueta}|${href}`;
    }
    return linea;
  });

  fs.writeFileSync(RUTA_DATOS, nuevasLineas.join("\n") + "\n", "utf-8");
  res.json({ ok: true, mensaje: "Nodo modificado correctamente." });
});

/**
 * Elimina un nodo por su ID del archivo .txt.
 */
app.delete("/api/nodos/:id", (req, res) => {
  const { id } = req.params;

  if (!fs.existsSync(RUTA_DATOS)) {
    return res.status(404).json({ error: "No existen nodos." });
  }

  const lineas = fs.readFileSync(RUTA_DATOS, "utf-8").split("\n").filter(Boolean);
  const nuevasLineas = lineas.filter((linea) => linea.split("|")[0] !== id);
  fs.writeFileSync(RUTA_DATOS, nuevasLineas.join("\n") + (nuevasLineas.length ? "\n" : ""), "utf-8");
  res.json({ ok: true, mensaje: "Nodo eliminado correctamente." });
});

app.listen(PUERTO, () => {
  console.log(`Proyecto 4 corriendo en http://localhost:${PUERTO}`);
});