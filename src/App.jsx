import React, { useState, useEffect, useRef } from "react";
import { Volume2, Settings, Award, Play, RotateCcw } from "lucide-react";

const MathTrainerApp = () => {
  const [settings, setSettings] = useState({
    operation: "+",
    difficulty: "medium",
    feedbackStyle: "encouraging",
    voiceURI: "",
    speechRate: 0.9,
    autoPlayNext: false,
    showEquation: true,
    kopfrechnenMode: false,
  });

  const [mode, setMode] = useState("menu"); // menu, practice, quiz, results
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const inputRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const germanVoices = voices.filter((voice) =>
        voice.lang.startsWith("de")
      );
      setAvailableVoices(germanVoices);

      // Set default voice if not set
      if (!settings.voiceURI && germanVoices.length > 0) {
        setSettings((prev) => ({
          ...prev,
          voiceURI: germanVoices[0].voiceURI,
        }));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const difficultyRanges = {
    "+": {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 20 },
      hard: { min: 10, max: 50 },
    },
    "-": {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 20 },
      hard: { min: 10, max: 50 },
    },
    "*": {
      easy: { min: 1, max: 5 },
      medium: { min: 1, max: 10 },
      hard: { min: 1, max: 12 },
    },
    "/": {
      easy: { min: 1, max: 5 },
      medium: { min: 1, max: 10 },
      hard: { min: 1, max: 12 },
    },
  };

  const feedbackMessages = {
    encouraging: {
      correct: [
        "Super gemacht! 🌟",
        "Fantastisch! Das war richtig! 🎉",
        "Toll! Du bist ein Mathe-Star! ⭐",
        "Perfekt! Weiter so! 💪",
      ],
      incorrect: [
        "Fast! Versuch es nochmal! 💪",
        "Nicht ganz, aber du schaffst das! 🌈",
        "Ups! Probier es noch einmal! 😊",
        "Das war knapp! Nochmal versuchen! 🎯",
      ],
    },
    simple: {
      correct: ["Richtig! ✓", "Korrekt! ✓", "Ja, das stimmt! ✓", "Genau! ✓"],
      incorrect: [
        "Leider falsch. ✗",
        "Das ist nicht richtig. ✗",
        "Falsch. ✗",
        "Nein, das stimmt nicht. ✗",
      ],
    },
    playful: {
      correct: [
        "Wow! Du bist ein Rechenkönig! 👑",
        "Yippie! Das war super! 🎈",
        "Hurra! Richtig gerechnet! 🎊",
        "Juhu! Du kannst das toll! 🚀",
      ],
      incorrect: [
        "Hoppla! Das war nicht ganz richtig! 🐰",
        "Oh nein! Versuch es nochmal! 🐸",
        "Autsch! Fast geschafft! 🦊",
        "Uups! Noch ein Versuch! 🐻",
      ],
    },
    teacher: {
      correct: [
        "Sehr gut! Das hast du richtig gelöst! 📚",
        "Ausgezeichnet! Weiter so! 📝",
        "Prima! Das war korrekt! ✏️",
        "Gut gemacht! Die Lösung stimmt! 📖",
      ],
      incorrect: [
        "Das ist noch nicht richtig. Überlege nochmal! 🤔",
        "Leider falsch. Versuche es erneut! 📐",
        "Nicht korrekt. Rechne nochmal nach! 🔢",
        "Das stimmt nicht. Probier es nochmal! 📏",
      ],
    },
  };

  const generateProblem = () => {
    const { operation, difficulty } = settings;
    const range = difficultyRanges[operation][difficulty];

    let num1, num2, answer;

    if (operation === "/") {
      // For division, ensure whole number results
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const multiplier =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num1 = num2 * multiplier;
      answer = multiplier;
    } else if (operation === "-") {
      // For subtraction, ensure positive results
      num1 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
    } else if (operation === "*") {
      num1 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 * num2;
    } else {
      // addition
      num1 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 + num2;
    }

    return { num1, num2, operation, answer };
  };

  const speakProblem = (problem, inputRef) => {
    if ("speechSynthesis" in window) {
      const operationWords = {
        "+": "plus",
        "-": "minus",
        "*": "mal",
        "/": "geteilt durch",
      };

      const text = `Was ist ${problem.num1} ${
        operationWords[problem.operation]
      } ${problem.num2}?`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = settings.speechRate;

      // Set selected voice
      if (settings.voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(
          (v) => v.voiceURI === settings.voiceURI
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Focus input field after speech ends
      utterance.onend = () => {
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakFeedback = (text, isCorrect) => {
    if ("speechSynthesis" in window) {
      const cleanText = text.replace(
        /[🌟🎉⭐💪🌈😊🎯✓✗👑🎈🎊🚀🐰🐸🦊🐻📚📝✏️📖🤔📐🔢📏]/g,
        ""
      );
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "de-DE";
      utterance.rate = settings.speechRate;

      // Set selected voice
      if (settings.voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(
          (v) => v.voiceURI === settings.voiceURI
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Add emotion through pitch variation
      utterance.pitch = isCorrect ? 1.2 : 0.9;

      // Auto-advance to next question after feedback if enabled
      if (settings.autoPlayNext) {
        utterance.onend = () => {
          setTimeout(() => {
            nextQuestion();
          }, 1500);
        };
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const startPractice = () => {
    const problem = generateProblem();
    setCurrentProblem(problem);
    setMode("practice");
    setUserAnswer("");
    setFeedback(null);
    setTimeout(() => speakProblem(problem, inputRef), 300);
  };

  const startQuiz = () => {
    const questions = Array.from({ length: 10 }, () => generateProblem());
    setQuizQuestions(questions);
    setQuizIndex(0);
    setCurrentProblem(questions[0]);
    setMode("quiz");
    setScore({ correct: 0, total: 0 });
    setUserAnswer("");
    setFeedback(null);
    setTimeout(() => speakProblem(questions[0], inputRef), 300);
  };

  const checkAnswer = () => {
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    const messages =
      feedbackMessages[settings.feedbackStyle][
        isCorrect ? "correct" : "incorrect"
      ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    setFeedback({
      isCorrect,
      message,
      correctAnswer: currentProblem.answer,
    });

    speakFeedback(message, isCorrect);

    if (mode === "practice") {
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    } else if (mode === "quiz") {
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    }
  };

  const nextQuestion = () => {
    if (mode === "practice") {
      const problem = generateProblem();
      setCurrentProblem(problem);
      setUserAnswer("");
      setFeedback(null);
      setTimeout(() => speakProblem(problem, inputRef), 300);
    } else if (mode === "quiz") {
      if (quizIndex < quizQuestions.length - 1) {
        const nextIdx = quizIndex + 1;
        setQuizIndex(nextIdx);
        setCurrentProblem(quizQuestions[nextIdx]);
        setUserAnswer("");
        setFeedback(null);
        setTimeout(() => speakProblem(quizQuestions[nextIdx], inputRef), 300);
      } else {
        setMode("results");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userAnswer && !feedback) {
      checkAnswer();
    }
  };

  const operationSymbols = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
  };

  if (mode === "menu") {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-3xl shadow-2xl p-8'>
            <h1 className='text-4xl font-bold text-center mb-2 text-purple-600'>
              Kopfrechnen Trainer
            </h1>
            <p className='text-center text-gray-600 mb-8'>
              Übe Mathe mit Spaß! 🎓
            </p>

            {showSettings ? (
              <div className='space-y-6 mb-8'>
                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      Aufgabe anzeigen
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.showEquation}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          showEquation: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    Wenn ausgeschaltet, nur zuhören (reines Kopfrechnen)
                  </p>
                </div>

                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      Kopfrechnen-Modus
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.kopfrechnenMode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          kopfrechnenMode: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    Zeigt "Kopfrechnen" statt der Rechenaufgabe
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Rechenart
                  </label>
                  <div className='grid grid-cols-4 gap-2'>
                    {["+", "-", "*", "/"].map((op) => (
                      <button
                        key={op}
                        onClick={() =>
                          setSettings({ ...settings, operation: op })
                        }
                        className={`py-3 px-4 rounded-lg text-2xl font-bold transition ${
                          settings.operation === op
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {operationSymbols[op]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Schwierigkeit
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    {["easy", "medium", "hard"].map((diff) => (
                      <button
                        key={diff}
                        onClick={() =>
                          setSettings({ ...settings, difficulty: diff })
                        }
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          settings.difficulty === diff
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {diff === "easy"
                          ? "Leicht"
                          : diff === "medium"
                          ? "Mittel"
                          : "Schwer"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Stimme
                  </label>
                  <select
                    value={settings.voiceURI}
                    onChange={(e) =>
                      setSettings({ ...settings, voiceURI: e.target.value })
                    }
                    className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500'
                  >
                    {availableVoices.length === 0 ? (
                      <option>Laden...</option>
                    ) : (
                      availableVoices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(
                        "Hallo! Das ist meine Stimme."
                      );
                      utterance.lang = "de-DE";
                      utterance.rate = settings.speechRate;
                      if (settings.voiceURI) {
                        const voices = window.speechSynthesis.getVoices();
                        const selectedVoice = voices.find(
                          (v) => v.voiceURI === settings.voiceURI
                        );
                        if (selectedVoice) utterance.voice = selectedVoice;
                      }
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(utterance);
                    }}
                    className='mt-2 w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition text-sm font-semibold'
                  >
                    🔊 Stimme testen
                  </button>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Sprechgeschwindigkeit: {settings.speechRate.toFixed(1)}x
                  </label>
                  <input
                    type='range'
                    min='0.5'
                    max='1.5'
                    step='0.1'
                    value={settings.speechRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        speechRate: parseFloat(e.target.value),
                      })
                    }
                    className='w-full'
                  />
                  <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>Langsam</span>
                    <span>Normal</span>
                    <span>Schnell</span>
                  </div>
                </div>

                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      Automatisch zur nächsten Frage
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.autoPlayNext}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoPlayNext: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    Nach dem Feedback geht es automatisch weiter
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    Feedback-Stil
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {[
                      { key: "encouraging", label: "Ermutigend" },
                      { key: "simple", label: "Einfach" },
                      { key: "playful", label: "Spielerisch" },
                      { key: "teacher", label: "Lehrer" },
                    ].map((style) => (
                      <button
                        key={style.key}
                        onClick={() =>
                          setSettings({ ...settings, feedbackStyle: style.key })
                        }
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          settings.feedbackStyle === style.key
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className='flex justify-center mb-6'>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition'
              >
                <Settings size={20} />
                {showSettings
                  ? "Einstellungen verstecken"
                  : "Einstellungen anzeigen"}
              </button>
            </div>

            <div className='space-y-4'>
              <button
                onClick={startPractice}
                className='w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg'
              >
                <Play size={24} />
                Übungsmodus starten
              </button>

              <button
                onClick={startQuiz}
                className='w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg'
              >
                <Award size={24} />
                Quiz starten (10 Fragen)
              </button>
            </div>

            {score.total > 0 && (
              <div className='mt-8 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200'>
                <p className='text-center text-lg font-semibold text-gray-700'>
                  Bisherige Statistik: {score.correct} von {score.total} richtig
                  ({Math.round((score.correct / score.total) * 100)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "results") {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center'>
          <h2 className='text-3xl font-bold mb-4 text-purple-600'>
            Quiz beendet! 🎉
          </h2>
          <div className='mb-6'>
            <div className='text-6xl font-bold text-blue-600 mb-2'>
              {percentage}%
            </div>
            <p className='text-xl text-gray-700'>
              {score.correct} von {score.total} richtig
            </p>
          </div>

          <div className='mb-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl'>
            <p className='text-lg font-semibold'>
              {percentage >= 90
                ? "🌟 Hervorragend! Du bist ein Mathe-Champion!"
                : percentage >= 70
                ? "⭐ Sehr gut! Weiter so!"
                : percentage >= 50
                ? "👍 Gut gemacht! Übung macht den Meister!"
                : "💪 Nicht aufgeben! Versuche es nochmal!"}
            </p>
          </div>

          <button
            onClick={() => {
              setMode("menu");
              setScore({ correct: 0, total: 0 });
            }}
            className='w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition'
          >
            Zurück zum Menü
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-2xl p-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-purple-600'>
              {mode === "practice"
                ? "Übungsmodus"
                : `Quiz: Frage ${quizIndex + 1}/10`}
            </h2>
            <button
              onClick={() => setMode("menu")}
              className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition'
            >
              Zurück
            </button>
          </div>

          {mode === "quiz" && (
            <div className='mb-4'>
              <div className='flex gap-1'>
                {quizQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded ${
                      idx < quizIndex
                        ? "bg-green-500"
                        : idx === quizIndex
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className='mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl'>
            <div className='flex items-center justify-center gap-4 mb-4'>
              <button
                onClick={() => speakProblem(currentProblem, inputRef)}
                className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition'
                title='Aufgabe vorlesen'
              >
                <Volume2 size={24} />
              </button>
              {settings.kopfrechnenMode ? (
                <div className='text-5xl font-bold text-purple-600'>
                  Kopfrechnen
                </div>
              ) : settings.showEquation ? (
                <div className='text-5xl font-bold text-gray-800'>
                  {currentProblem.num1}{" "}
                  {operationSymbols[currentProblem.operation]}{" "}
                  {currentProblem.num2} = ?
                </div>
              ) : (
                <div className='text-3xl font-bold text-gray-500 italic'>
                  Gut zuhören! 👂
                </div>
              )}
            </div>
          </div>

          <div className='mb-6'>
            <input
              ref={inputRef}
              type='number'
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Deine Antwort...'
              disabled={feedback !== null}
              className='w-full p-4 text-3xl text-center border-4 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-100'
            />
          </div>

          {!feedback ? (
            <button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className='w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-bold text-xl transition shadow-lg disabled:cursor-not-allowed'
            >
              Antwort prüfen
            </button>
          ) : (
            <div className='space-y-4'>
              <div
                className={`p-6 rounded-xl text-center ${
                  feedback.isCorrect
                    ? "bg-gradient-to-r from-green-100 to-green-200 border-4 border-green-400"
                    : "bg-gradient-to-r from-red-100 to-red-200 border-4 border-red-400"
                }`}
              >
                <p className='text-2xl font-bold mb-2'>{feedback.message}</p>
                {!feedback.isCorrect && (
                  <p className='text-lg'>
                    Die richtige Antwort ist:{" "}
                    <span className='font-bold text-2xl'>
                      {feedback.correctAnswer}
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className='w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-xl transition shadow-lg flex items-center justify-center gap-2'
              >
                {mode === "quiz" && quizIndex === quizQuestions.length - 1 ? (
                  <>Ergebnisse anzeigen</>
                ) : settings.autoPlayNext ? (
                  <>
                    <RotateCcw size={24} />
                    Wird automatisch geladen...
                  </>
                ) : (
                  <>
                    <RotateCcw size={24} />
                    Nächste Aufgabe
                  </>
                )}
              </button>
            </div>
          )}

          <div className='mt-6 p-4 bg-gray-50 rounded-xl'>
            <p className='text-center text-gray-600'>
              Richtig: {score.correct} | Gesamt: {score.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTrainerApp;
