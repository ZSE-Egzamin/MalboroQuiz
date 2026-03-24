const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // To pozwoli Twojemu frontendowi (np. z localhost:3001) gadać z tym backendem

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Jesteś ekspertem egzaminów zawodowych INF.03 i INF.04. 
    Wygeneruj 1 pytanie testowe o temacie: ${topic}. 
    Odpowiedz TYLKO czystym JSONem w formacie:
    {"question": "treść", "options": ["A", "B", "C", "D"], "answer": "pełna treść poprawnej opcji"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Usuwanie Markdownu (czasem Gemini dodaje ```json ... ```)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    res.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend działa na http://localhost:${PORT}`));