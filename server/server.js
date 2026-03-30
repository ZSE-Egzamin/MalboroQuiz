require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/quiz', async (req, res) => {
  const { topic } = req.body; // topic to np. "Aplikacja Webowa", "Aplikacja Konsolowa"
  console.log(`Generowanie arkusza CKE dla: ${topic}`);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Jesteś ekspertem przygotowującym arkusze egzaminacyjne CKE dla kwalifikacji INF.03 i INF.04. 
          Twoim zadaniem jest wygenerowanie treści zadania PRAKTYCZNEGO.
          
          STRUKTURA ZADANIA:
          1. Tytuł: Krótki i techniczny.
          2. Założenia aplikacji: Lista punktów (np. stałe dane, struktura klasy/tablicy).
          3. Funkcjonalność: Co aplikacja wyświetla i jak reaguje na zdarzenia (np. kliknięcie przycisku).
          4. Stylistyka: Krótka informacja o wyglądzie (np. Bootstrap, CSS).
          
          FORMAT ODPOWIEDZI: Wyłącznie czysty JSON:
          {"question": "pełna treść zadania w HTML (użyj <b>, <ul>, <li>)", "expected": "kluczowe słowo/funkcja do walidacji"}`
        },
        {
          role: "user",
          content: `Wygeneruj zadanie egzaminacyjne dla kategorii: ${topic}. 
          
          WYMAGANIA DLA KATEGORII:
          - Webowa: React/Angular, formularze, obsługa zdarzeń, walidacja.
          - Konsolowa: Algorytmy (sortowanie, wyszukiwanie), programowanie obiektowe (C++/C#/Java/Python).
          - Mobilna: Layouty, intencje, przechowywanie prostych danych.
          - Desktopowa: GUI (np. WinForms, WPF, Qt), obsługa plików lub baz danych.
          
          Zadanie musi być na poziomie trudności oficjalnych arkuszy CKE.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { "type": "json_object" }
    });

    const content = chatCompletion.choices[0].message.content;
    res.json(JSON.parse(content));

  } catch (error) {
    console.error("Błąd Groq:", error.message);
    res.status(200).json({
      question: "<b>Zadanie awaryjne:</b> Napisz skrypt w JS, który po kliknięciu w przycisk wypisze w konsoli 'Egzamin INF.03'.",
      expected: "addEventListener"
    });
  }
});

// Endpoint do oceniania kodu
app.post('/api/check', async (req, res) => {
  const { question, userCode, topic } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Jesteś ekspertem programowania i egzaminatorem CKE. 
                    Twoim zadaniem jest szczegółowa analiza kodu i zwrot wyniku wyłącznie jako poprawny obiekt JSON.
                    
                    ZASADY DLA POLA "feedback":
                    1. Używaj HTML: <p>, <ul>, <li> oraz <b>.
                    2. Fragmenty kodu umieszczaj w <code class='err'></code> (błąd) i <code class='fix'></code> (poprawka).
                    3. WAŻNE: Wewnątrz tagów <code> używaj tylko POJEDYNCZYCH cudzysłowów ('), aby nie psuć struktury JSON.
                    4. Nie wklejaj całego poprawnego programu, a jedynie kluczowe, poprawione fragmenty.
                    
                    STRUKTURA JSON:
                    {
                      "passed": true/false,
                      "feedback": "Twoja rozległa analiza w HTML"
                    }`
        },
        {
          role: "user",
          content: `Oceń poniższe zadanie i zwróć format json. 
          TEMAT: ${topic}
          TREŚĆ ZADANIA: ${question}
          KOD UCZNIA: ${userCode}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { "type": "json_object" } // Teraz zadziała, bo "json" jest w prompcie
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error("Błąd oceniania:", error.message);
    res.status(500).json({
      passed: false,
      feedback: "Wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie."
    });
  }
});

app.listen(3000, () => console.log("Backend działa na http://localhost:3000"));