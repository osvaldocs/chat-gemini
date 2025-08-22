import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 Ruta de chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instrucción: siempre en español y breve
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: `Responde SIEMPRE en español y no mas de 500 caractéres: ${message}` }
          ]
        }
      ]
    });

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 📂 Servir estáticos desde la misma carpeta del server.js
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
