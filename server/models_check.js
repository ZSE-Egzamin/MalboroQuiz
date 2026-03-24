require('dotenv').config();

async function listMyModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Dostępne modele dla Twojego klucza:");
    data.models.forEach(m => console.log(`- ${m.name}`));
  } catch (err) {
    console.error("Błąd podczas pobierania listy:", err);
  }
}

listMyModels();