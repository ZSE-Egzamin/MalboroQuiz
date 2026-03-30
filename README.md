🎓 MalboroQuiz - System Egzaminacyjny INF.04
Aplikacja webowa wspierająca naukę programowania i przygotowanie do egzaminu zawodowego INF.04 (Projektowanie, programowanie i testowanie aplikacji). System pozwala na rozwiązywanie zadań praktycznych z zakresu Console App (C#) oraz Web App (React/Angular), oferując natychmiastowy, inteligentny feedback od sztucznej inteligencji.

🚀 Główne Funkcjonalności
Inteligentny Egzaminator: Automatyczna ocena kodu przy użyciu modelu Llama 3.3 (Groq API), która analizuje zgodność z arkuszem CKE.

Szczegółowy Feedback: System nie tylko ocenia "zaliczone/niezaliczone", ale wskazuje konkretne błędy w kodzie i sugeruje poprawki.

Obsługa Wielu Kategorii:

Console App: Zadania z algorytmiki, sortowania i wyszukiwania w C#.

Web App: Tworzenie komponentów w React/Angular z wykorzystaniem Bootstrapa.

Dynamiczny Edytor: Wbudowane środowisko do pisania kodu bezpośrednio w przeglądarce.

🛠 Technologia
Frontend
React + Vite: Szybkie i nowoczesne środowisko deweloperskie.

Tailwind CSS: Nowoczesna stylizacja UI.

Bootstrap: Wykorzystywany w zadaniach egzaminacyjnych zgodnie z wytycznymi CKE.

Backend
Node.js + Express: Serwer pośredniczący w komunikacji z API.

Groq SDK: Integracja z szybkim modelem Llama 3.3 do analizy kodu.

JSON Response Format: Zapewnia stabilną strukturę danych przesyłanych do frontendu.

📦 Struktura Projektu
Plaintext
MalboroQuiz/
├── client/                # Aplikacja React (Vite)
│   ├── src/
│   │   ├── App.jsx        # Główna logika i UI
│   │   └── index.css      # Style, w tym klasy .err i .fix dla feedbacku
│   └── public/            # Zasoby statyczne (ikony, grafiki)
├── server/                # Serwer Express.js
│   ├── server.js          # Endpoint /api/check i logika promptów AI
│   └── .env               # Klucze API (GROQ_API_KEY)
└── README.md
⚙️ Instalacja i Uruchomienie
Sklonuj repozytorium:

Bash
git clone https://github.com/twoj-user/MalboroQuiz.git
Skonfiguruj serwer:

Przejdź do folderu server/.

Zainstaluj zależności: npm install.

Stwórz plik .env i dodaj swój klucz: GROQ_API_KEY=twoj_klucz_tutaj.

Uruchom serwer: node server.js.

Uruchom aplikację kliencką:

Przejdź do folderu client/.

Zainstaluj zależności: npm install.

Uruchom projekt: npm run dev.
------------------------------------------------------------------

Autorzy: Kamil Nowakowski, Mateusz Wiewióra, Jakub Wrzesień

Status Projektu: Wstępnie ukończony (Wersja 1.0)
