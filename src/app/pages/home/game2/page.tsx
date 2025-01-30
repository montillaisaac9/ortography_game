'use client'

import { useState, useEffect } from "react";
import { Button } from "@/app/components/button";
import { set } from "zod";
import next from "next";

const questions = [
  {
    word: "Bicicreta",
    options: ["Bicicleta", "Bicicreta", "Bizicleta"],
    answer: "Bicicleta",
  },
  {
    word: "Herror",
    options: ["Error", "Herror", "Errór"],
    answer: "Error",
  },
  {
    word: "Aber",
    options: ["Haber", "Aber", "Aver"],
    answer: "Haber",
  },
  {
    word: "Ballanse",
    options: ["Vallanse", "Ballanse", "Váyanse"],
    answer: "Váyanse",
  },
  {
    word: "Desidió",
    options: ["Decidió", "Desidió", "Decidio"],
    answer: "Decidió",
  },
  {
    word: "Imbito",
    options: ["Invito", "Imbito", "Envito"],
    answer: "Invito",
  },
  {
    word: "Cazería",
    options: ["Cacería", "Cazería", "Casería"],
    answer: "Cacería",
  },
  {
    word: "Exepción",
    options: ["Excepción", "Exepción", "Exección"],
    answer: "Excepción",
  },
  {
    word: "Espresarse",
    options: ["Expresarse", "Espresarse", "Esprersarse"],
    answer: "Expresarse",
  },
  {
    word: "Hojear",
    options: ["Ojear", "Hojear", "Ojeár"],
    answer: "Hojear",
  },
  {
    word: "Vasosidad",
    options: ["Vacuosidad", "Vasosidad", "Vasozidad"],
    answer: "Vacuosidad",
  },
  {
    word: "Hacerte",
    options: ["Acerte", "Hacerte", "Acerté"],
    answer: "Hacerte",
  },
  {
    word: "Asia",
    options: ["Asia", "Hacia", "Acia"],
    answer: "Hacia",
  },
  {
    word: "Cocer",
    options: ["Cocer", "Coser", "Cozer"],
    answer: "Cocer",
  },
  {
    word: "Desarroyo",
    options: ["Desarrollo", "Desarroyo", "Desarollo"],
    answer: "Desarrollo",
  },
  {
    word: "Guevo",
    options: ["Huevo", "Guevo", "Huebo"],
    answer: "Huevo",
  },
  {
    word: "Averiguar",
    options: ["Averiguar", "Aberiguar", "Aveeriguar"],
    answer: "Averiguar",
  },
  {
    word: "Baya",
    options: ["Vaya", "Baya", "Balla"],
    answer: "Vaya",
  },
  {
    word: "Nesesario",
    options: ["Necesario", "Nesesario", "Necesaro"],
    answer: "Necesario",
  },
  {
    word: "Hasme",
    options: ["Hazme", "Hasme", "Asme"],
    answer: "Hazme",
  }
];


export default function ChooseCorrectWordGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [reglas, setReglas] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setCountReolad] = useState<number | null >(null);
  const [countQuestons, setCountQuestons] = useState(0)
  const [mensaje, setMensaje] = useState("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  

    useEffect(() => {
      const obtenerDetallesDelJuego = async () => {
        setCargando(true);
        setError(false);
        try {
          const res = await fetch('/api/home/games?id=2');
          if (!res.ok) throw new Error("Error al obtener los detalles del juego");
  
          const data = await res.json();
          console.log(data)
          setTitulo(data.game.name || "Título no disponible");
          setDescripcion(data.game.description || "Descripción no disponible");
          setReglas(data.game.rules || "Reglas no disponibles");
        } catch (error) {
          console.error("Error al obtener detalles:", error);
          setError(true);
        } finally {
          setCargando(false);
        }
      };
  
      obtenerDetallesDelJuego();
    }, []);
  

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4">
        <p className="text-red-500 text-lg font-bold">Error al cargar el juego</p>
        <button
          onClick={() => location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const enviarPuntuacion = async (puntos: number): Promise<void> => {
    try {
      const response = await fetch('/api/home/games/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 2, newScore: puntos }),
      });
      if (!response.ok) {
        console.log(response)
        throw new Error(`Error en la petición: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };
  
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
    const newUsedWords = [...usedWords, questions[currentQuestion].word];
    setUsedWords(newUsedWords);
    console.log(usedWords)

    if (option === questions[currentQuestion].answer) {
      setScore(score + 20);
      setCountQuestons(countQuestons + 1)
      setMensaje(`✅ ¡Correcto! +20 puntos.`);
      if (score >= 100) {
        setMensaje(`🎉 ¡Felicidades! ¡Has completado el juego!`);
        setScore(0);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
      } if (usedWords.length >= 5) {
        setMensaje(`Game Over.`);
        setScore(0);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
      }
    } else {
      setMensaje(`❌ Incorrecto. fallaste te quedan ${5 - usedWords.length} intentos y  la palabra era: ${questions[currentQuestion].answer}`);
      setCountQuestons(countQuestons + 1)
      if (usedWords.length >= 5) {
        setMensaje(`Game Over. La palabra era: ${questions[currentQuestion].answer}`);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
    }
  };
}

  const nextQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length); // Generar un índice aleatorio
    if (!usedWords.includes(questions[randomIndex].word)) {
    setCurrentQuestion(randomIndex);
    setSelectedOption(null);
    setShowFeedback(false);
    } else nextQuestion();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4 p-4">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-lg">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <h2 className="text-xl font-bold">Elige la Palabra Correcta</h2>
      <p className="text-lg">Palabra incorrecta: <strong>{questions[currentQuestion].word}</strong></p>
      <div className="space-y-2">
        {questions[currentQuestion].options.map((option) => (
          <Button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`w-full ${selectedOption === option ? (option === questions[currentQuestion].answer ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'}`}
            disabled={showFeedback}
          >
            {option}
          </Button>
        ))}
      </div>
      {showFeedback && (
        <div className="mt-4  flex flex-col items-center justify-center">
          <Button onClick={nextQuestion} className="mt-2 mb-10 bg-gray-700">Siguiente</Button>
          <p className={mensaje.includes("❌") ? "text-red-500" : "text-green-500"}>{mensaje}</p>
        </div>
      )}

       {/* Barra de progreso */}
       <div className="w-full max-w-md bg-gray-300 rounded-lg h-6 mt-4">
        <div
          className="bg-green-500 h-6 rounded-lg transition-all duration-500"
          style={{ width: `${(score / 100) * 100}%` }}
        ></div>
      </div>

      <p className="mt-4">Puntuación: {score}</p>
      
      
      {countReload !== null && <p>Reiniciando en {countReload}...</p>}
    </div>
  );
}
