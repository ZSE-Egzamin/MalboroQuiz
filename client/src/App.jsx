import { useState, useEffect, useRef } from "react";

// ==========================================
// IMPORT GRAFIK - WPISZ TU SWOJE ŚCIEŻKI
// ==========================================
// Logo Marlboro na górę strony
import MarlboroLogo from "./assets/marlboro-logo.png";
// Grafika frontu paczki, która przykrywa papierosy
import PackFrontImg from "./assets/pack-front.png";
// Grafika pojedynczego papierosa, który pojawia się po spaleniu
import SingleCigaretteImg from "./assets/cigarette-stick.png";

// Grafiki papierosów z napisami (Ty je edytujesz)
import CigWebImg from "./assets/cig-web.png";
import CigDesktopImg from "./assets/cig-desktop.png";
import CigConsoleImg from "./assets/cig-console.png";
import CigMobileImg from "./assets/cig-mobile.png";

// Sztywne 4 kategorie pytań
const questionsData = [
  {
    id: 1,
    category: "Web App",
    label: "WEB",
    img: CigWebImg,
    expected: "function",
  },
  {
    id: 2,
    category: "Desktop App",
    label: "DESKTOP",
    img: CigDesktopImg,
    expected: "class",
  },
  {
    id: 3,
    category: "Console App",
    label: "CONSOLE",
    img: CigConsoleImg,
    expected: "printf",
  },
  {
    id: 4,
    category: "Mobile App",
    label: "MOBILE",
    img: CigMobileImg,
    expected: "build",
  },
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionText, setQuestionText] = useState(
    "Wybierz papierosa z paczki, aby wylosować pytanie z bazy AI...",
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stan timera
  const [inputMinutes, setInputMinutes] = useState(15); // Domyślnie 15 min
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0); // Do paska postępu
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [examFinished, setExamFinished] = useState(false);

  const timerRef = useRef(null);

  // POPRAWKA LOGIKI TIMERA (current zamiast useRef)
  useEffect(() => {
    if (isTimerRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setExamFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, time]);

  const startExam = () => {
    playLighter(); // Pstryk!
    const seconds = inputMinutes * 60;
    setTime(seconds);
    setInitialTime(seconds);
    setIsTimerRunning(true);
    setExamFinished(false);
    setQuestionText("Wybierz papierosa z paczki, aby wylosować pytanie...");
  };

  // FUNKCJA DŹWIĘKU (załóż plik lighter.mp3 w assets)
  const playLighter = () => {
    const audio = new Audio("/src/assets/lighter.mp3");
    audio.volume = 0.5;
    audio
      .play()
      .catch((e) => console.log("Czekam na interakcję z userem dla dźwięku"));
  };

  const checkAnswer = async () => {
    if (!currentQuestion || !answer.trim() || examFinished || isLoading) return;

    setIsLoading(true); // Używamy tego samego loadera co przy pytaniu
    setFeedback({ text: "Egzaminator sprawdza Twój kod...", correct: null });

    try {
      const response = await fetch("http://localhost:3000/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText, // Przesyłamy treść zadania
          userCode: answer, // Przesyłamy wpisany kod
          topic: currentQuestion.category,
        }),
      });

      const data = await response.json();

      setFeedback({
        correct: data.passed,
        text: data.passed
          ? `ZALICZONE! ${data.feedback}`
          : `NIEZALICZONE. ${data.feedback}`,
      });
    } catch (error) {
      setFeedback({
        correct: false,
        text: "Błąd połączenia podczas sprawdzania kodu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const fetchQuiz = async (category) => {
    setIsLoading(true);
    setQuestionText("Generuję zadanie przez AI... Zaciągnij się chwilę.");
    setFeedback(null);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:3000/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: category }),
      });

      const data = await response.json();

      if (data.question) {
        setQuestionText(data.question);
        // Tworzymy obiekt pytania z danymi z backendu
        setCurrentQuestion({
          category: category,
          expected: data.expected.toLowerCase(),
        });
      }
    } catch (error) {
      setQuestionText(
        "Błąd połączenia z serwerem. Czy backend działa na porcie 3000?",
      );
      console.error("Błąd Fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obliczanie szerokości paska postępu (żółty filtr)
  const progressWidth = initialTime > 0 ? (time / initialTime) * 100 : 0;

  return (
    // Główny kontener - Białe tło, czarny tekst, czerwone akcenty
    <div className="min-h-screen bg-white text-black flex flex-col font-serif select-none overflow-hidden">
      {/* --- HEADER --- */}
      <header className="w-full border-b-2 border-black p-4 flex flex-col items-center relative">
        {/* Czerwony "daszek" Marlboro na górze */}
        <div className="absolute top-0 left-0 w-full h-4 bg-marlboro-red"></div>

        {/* Miejsce na logo */}
        <img
          src={MarlboroLogo}
          alt="Marlboro Logo"
          className="h-16 mt-4 mb-2 object-contain"
        />

        {/* Stylizowany napis ostrzegawczy */}
        <div className="border-2 border-black px-4 py-1 text-sm font-bold uppercase tracking-tight">
          Ministerstwo Edukacji ostrzega: Egzamin zawodowy powoduje stres.
        </div>
      </header>

      {/* --- GŁÓWNA ZAWARTOŚĆ --- */}
      <div className="flex flex-1 relative">
        {/* LEWA STRONA - QUIZ */}
        <main className="flex-1 p-8 md:p-12 border-r-2 border-black w-3/4">
          {/* POPRAWIONY PRZYCISK START */}
          {!isTimerRunning && (
            <div className="mb-8 p-6 bg-gray-50 border-2 border-black shadow-[4px_4px_0px_black] inline-block animate-pulse-slow">
              <label className="font-bold mr-4 uppercase text-xs">
                Ustaw czas (min):
              </label>
              <input
                type="number"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(Math.max(1, e.target.value))}
                className="w-16 p-2 border-2 border-black mr-6 text-center font-bold bg-white"
              />
              <button
                onClick={startExam}
                className="bg-black text-white px-10 py-3 font-black hover:bg-marlboro-red transition-all duration-300 uppercase text-base tracking-[0.2em] shadow-lg"
              >
                🔥 OPALAJ (START)
              </button>
            </div>
          )}

          {/* --- POPRAWIONY TIMER: PEŁNY PAPIEROS NA START --- */}
          <div className="relative w-full max-w-2xl h-32 mb-12 flex items-center">
            {/* 1. WARSTWA POPIOŁU (Pod spodem, zawsze cała) */}
            <div className="absolute left-0 w-full h-8 bg-gray-200 rounded-sm shadow-inner opacity-50">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, black 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              ></div>
            </div>

            {/* 2. KONTENER PAPIEROSA (Skraca się) */}
            <div
              className="relative h-12 flex items-center transition-all duration-1000 ease-linear z-10 overflow-hidden shadow-sm"
              style={{
                // Jeśli timer nie chodzi i egzamin nie skończony -> 100% szerokości
                // Jeśli chodzi -> używamy obliczonego postępu (min. 20% żeby został filtr)
                width:
                  !isTimerRunning && !examFinished
                    ? "100%"
                    : `${Math.max(20, progressWidth)}%`,
              }}
            >
              <img
                src={SingleCigaretteImg}
                alt="Cigarette"
                className="h-full object-left object-cover shrink-0"
                style={{ width: "672px" }}
              />

              {/* TIMER NA FILTRZE */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xl font-black text-black mix-blend-multiply opacity-80">
                {isTimerRunning ? formatTime() : inputMinutes + ":00"}
              </div>
            </div>

            {/* 3. ŻAR I DYM (Osobny kontener poza overflow-hidden!) */}
            {isTimerRunning && (
              <div
                className="absolute h-12 z-20 transition-all duration-1000 ease-linear pointer-events-none"
                style={{ left: `${Math.max(20, progressWidth)}%` }}
              >
                {/* Żar na styku */}
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2">
                  <div className="w-3 h-10 bg-gradient-to-r from-orange-600 to-transparent blur-[2px] animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-8 bg-yellow-500 blur-md animate-ping"></div>
                </div>

                {/* CIEMNY DYM (Teraz będzie widoczny!) */}
                <div className="absolute -top-32 -left-4 flex flex-col items-center">
                  <div className="w-6 h-20 bg-gray-800/40 rounded-full blur-2xl animate-smoke-heavy"></div>
                  <div className="w-8 h-24 bg-gray-600/30 rounded-full blur-3xl animate-smoke-heavy delay-150 -mt-16"></div>
                  <div className="w-4 h-12 bg-gray-900/40 rounded-full blur-xl animate-smoke-heavy delay-300 -mt-20"></div>
                </div>
              </div>
            )}

            {/* Komunikat startowy */}
            {!isTimerRunning && !examFinished && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-gray-400 text-[10px] tracking-[0.3em] uppercase">
                Gotowy do odpalenia
              </div>
            )}
          </div>

          {/* Blok pytania - skaluje się do treści */}
          <div className="border-2 border-black p-6 mb-6 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h2 className="text-sm font-bold uppercase text-marlboro-red mb-2 tracking-widest">
              {currentQuestion
                ? `Kategoria: ${currentQuestion.category}`
                : "Status"}
            </h2>
            <div
              className="cke-task text-lg leading-normal font-sans" // Klasa do stylizowania listy
              dangerouslySetInnerHTML={{ __html: questionText }}
            />
          </div>

          {/* Edytor kodu (Textarea) - Styl VS Code Dark */}
          <div className="mb-4 relative">
            <div className="absolute top-2 right-3 text-xs font-mono text-gray-500 z-10">
              wazny_kod.js
            </div>
            <textarea
              className="w-full p-4 font-mono text-sm rounded-md shadow-lg min-h-[250px] outline-none border-2 border-black
                         bg-[#1e1e1e] text-[#d4d4d4] caret-white focus:border-marlboro-red transition-colors"
              placeholder="// Wpisz swój kod tutaj...&#10;function rozwiazanie() {&#10;  // twoja logika&#10;}"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={examFinished || !isTimerRunning}
            />
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={checkAnswer}
              disabled={examFinished || !isTimerRunning || !currentQuestion}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 font-bold transition uppercase tracking-wider disabled:bg-gray-300"
            >
              Zaciągnij się (Sprawdź)
            </button>

            {/* Feedback block */}
            {feedback && (
              <div
                className={`mt-4 p-6 border-2 font-sans cke-feedback-container ${
                  feedback.correct
                    ? "border-green-600 bg-green-50"
                    : "border-marlboro-red bg-red-50"
                }`}
              >
                <h3 className="font-black uppercase mb-2">
                  {feedback.correct
                    ? "✅ Wynik Pozytywny"
                    : "❌ Wynik Negatywny"}
                </h3>
                <div dangerouslySetInnerHTML={{ __html: feedback.text }} />
              </div>
            )}
          </div>
        </main>

        {/* --- PRAWY PANEL - PACZKA (Nawigacja Profesjonalna) --- */}
        <aside className="w-64 p-4 pt-12 flex flex-col items-center relative overflow-visible bg-gray-50 border-l border-black">
          <h3 className="font-bold uppercase mb-2 text-center text-sm tracking-widest relative z-30">
            Smaki (Kategorie):
          </h3>

          {/* KONTENER NA PACZKĘ (Zwiększony margines mt-48) */}
          <div className="relative w-48 h-80 mt-48">
            {/* Papierosy */}
            {questionsData.map((q, index) => {
              const isLocked = !isTimerRunning || examFinished || isLoading;

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    if (isLocked) return;
                    fetchQuiz(q.category); // WYWOŁANIE API
                  }}
                  // ZMIANY:
                  // 1. translate-y-[-16px] (ujemne) wysuwa filtry MOCNIEJ do góry (wystaje ok. 4-5 cm)
                  // 2. border pojawia się tylko przy hoverze, żeby w spoczynku nie było szarych ramek
                  className={`absolute bottom-0 w-10 h-64 transition-all duration-500 ease-out z-10
                              rounded-t-sm border-gray-300
                              ${
                                isLocked
                                  ? "translate-y-[-16px] opacity-60 grayscale cursor-not-allowed border-none" // Filtry wystają, ale zablokowane
                                  : "translate-y-[-16px] cursor-pointer group hover:-translate-y-48 hover:z-30 hover:border hover:shadow-md"
                              }`} // Aktywne i wysuwane
                  style={{
                    backgroundImage: `url(${q.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    left: `${index * 42 + 8}px`,
                  }}
                >
                  {/* Etykieta nad papierosem */}
                  {!isLocked && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg border border-white uppercase tracking-tighter">
                        {q.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* --- ZABUDOWANE TŁO POD PACZKĄ --- */}
            {/* Ten element ma kolor tła panelu i jest pozycjonowany na samym dole,
                  tam gdzie papierosy wystają spod paczki. Ponieważ papierosy mają tło tła,
                  ich białe końcówki stają się niewidoczne, a paczka Marlboro pozostaje nienaruszona. */}
            <div className="absolute -bottom-2 left-0 w-full h-10 bg-gray-50 z-20 pointer-events-none rounded-b-md"></div>

            {/* Front paczki - z-25 (musi być NAD zabudowanym tłem, żeby paczka była cała) */}
            <div
              className="absolute bottom-0 left-0 w-full h-48 bg-marlboro-red z-25 border-2 border-black rounded-b-md shadow-2xl pointer-events-none"
              style={{
                backgroundImage: `url(${PackFrontImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute top-4 left-0 w-full text-center">
                <span className="text-white text-[8px] font-bold tracking-[0.5em] opacity-30 uppercase">
                  Original Quality
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-16 text-center px-4 leading-tight italic uppercase font-black tracking-widest">
            {isTimerRunning
              ? "* Chwyć smak, aby zacząć seans"
              : "* Najpierw odpal stoper"}
          </p>
        </aside>
      </div>

      {/* --- EKRAN KOŃCOWY (ANIMACJA SPALANIA) --- */}
      {examFinished && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-10 animate-fadeIn">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-bold text-marlboro-red mb-4">
              RAK JĄDRA
            </h1>
            <p className="text-white text-2xl font-bold border-2 border-white px-4 py-2 inline-block">
              znacy... KONIEC EGZAMINU.
            </p>
          </div>

          {/* Kontener na animowanego papierosa */}
          <div className="relative w-full max-w-xl h-24 flex items-center justify-center">
            {/* Grafika papierosa z nałożoną animacją burn (zdefiniowaną w tailwind.config) */}
            <img
              src={SingleCigaretteImg}
              alt="Burning Cigarette"
              className="h-full object-contain animate-burn"
            />
            {/* Efekt żarzenia (opcjonalny, prosty div) */}
            <div className="absolute right-[0] w-10 h-15 bg-orange-500 rounded-full blur-sm animate-pulse animate-burn"></div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-16 bg-white text-black px-8 py-2 font-bold uppercase hover:bg-gray-200 transition"
          >
            Spróbuj rzucić (Reset)
          </button>
        </div>
      )}
    </div>
  );
}
