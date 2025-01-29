
import { useState } from "react";
import { Button } from "@/app/components/button";

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
];

export default function ChooseCorrectWordGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (option: string) => {  // Definir el tipo del parámetro 'option' como 'string'
    setSelectedOption(option);
    setShowFeedback(true);

    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      alert(`Juego terminado. Puntuación final: ${score}/${questions.length}`);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Elige la Palabra Correcta</h1>
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
        <div className="mt-4">
          <p className={selectedOption === questions[currentQuestion].answer ? "text-green-600" : "text-red-600"}>
            {selectedOption === questions[currentQuestion].answer ? "¡Correcto!" : "Incorrecto. Inténtalo en la siguiente."}
          </p>
          <Button onClick={nextQuestion} className="mt-2 bg-gray-700">Siguiente</Button>
        </div>
      )}
      <p className="mt-4">Puntuación: {score}</p>
    </div>
  );
}
