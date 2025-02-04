'use client'

import { useState, useEffect } from "react";
import { Button } from "@/app/components/btn_p";
import axios from 'axios'

const palabrasIncorrectas = [
  {
    incorrecta: "Bicicreta",
    correcta: "Bicicleta",
    opciones: ["Bicicleta", "Bicicreta", "Bizicleta"]
  },
  {
    incorrecta: "Herror",
    correcta: "Error",
    opciones: ["Error", "Herror", "Errór"]
  },
  {
    incorrecta: "Aber",
    correcta: "Haber",
    opciones: ["Haber", "Aber", "Aver"]
  },
  {
    incorrecta: "Desidió",
    correcta: "Decidió",
    opciones: ["Decidió", "Desidió", "Decidio"]
  },
  {
    incorrecta: "Cazería",
    correcta: "Cacería",
    opciones: ["Cacería", "Cazería", "Casería"]
  },
  {
    incorrecta: "Exepción",
    correcta: "Excepción",
    opciones: ["Excepción", "Exepción", "Exección"]
  },
  {
    incorrecta: "Vasosidad",
    correcta: "Vacuosidad",
    opciones: ["Vacuosidad", "Vasosidad", "Vasozidad"]
  },
  {
    incorrecta: "Guevo",
    correcta: "Huevo",
    opciones: ["Huevo", "Guevo", "Huebo"]
  },
  {
    incorrecta: "Nesesario",
    correcta: "Necesario",
    opciones: ["Necesario", "Nesesario", "Necesaro"]
  },
  {
    incorrecta: "Desarroyo",
    correcta: "Desarrollo",
    opciones: ["Desarrollo", "Desarroyo", "Desarollo"]
  }
];

export default function PalabraRelacionadaGame() {
  const [puntuacion, setPuntuacion] = useState(0);
  const [intentos, setIntentos] = useState(3);
  const [palabraActual, setPalabraActual] = useState<typeof palabrasIncorrectas[number] | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [reglas, setReglas] = useState<string>("");
  const [countReload, setCountReolad] = useState<number | null>(null);
  const [palabrasUsadas, setPalabrasUsadas] = useState<string[]>([]); // Nuevo estado para palabras usadas

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      try {
        const res = await axios.get('/api/home/games', { params: { id: 3 } });
        setTitulo(res.data.game.name);
        setDescripcion(res.data.game.description);
        setReglas(res.data.game.rules || "Reglas no disponibles");
        seleccionarNuevaPalabra();
      } catch (error) {
        console.error("Error al obtener detalles:", error);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerDetallesDelJuego();
  }, []);

  const seleccionarNuevaPalabra = () => {
    const palabrasDisponibles = palabrasIncorrectas.filter(
      (palabra) => !palabrasUsadas.includes(palabra.incorrecta)
    );

    if (palabrasDisponibles.length === 0) {
      // Si no hay más palabras disponibles, reinicia el juego
      setMensaje("¡Has completado todas las palabras! 🎉");
      reiniciarJuego(3);
      return;
    }

    const indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
    const nuevaPalabra = palabrasDisponibles[indiceAleatorio];
    setPalabraActual(nuevaPalabra);
    setPalabrasUsadas((prev) => [...prev, nuevaPalabra.incorrecta]); // Añade la palabra a las usadas
  };

  const enviarPuntuacion = async (puntos: number) => {
    try {
      await fetch('/api/home/games/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 3, newScore: puntos }),
      });
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };

  const manejarSeleccion = (opcion: string) => {
    if (!palabraActual) return;

    if (opcion === palabraActual.correcta) {
      const nuevaPuntuacion = puntuacion + 20;
      setPuntuacion(nuevaPuntuacion);
      setMensaje("¡Correcto! +20 puntos 🎉");

      if (nuevaPuntuacion >= 100) {
        setMensaje("¡Has ganado! 🏆");
        enviarPuntuacion(nuevaPuntuacion);
        reiniciarJuego(3);
        return;
      }

      setTimeout(() => {
        seleccionarNuevaPalabra();
        setMensaje("");
      }, 1500);
    } else {
      const nuevosIntentos = intentos - 1;
      setIntentos(nuevosIntentos);
      setMensaje(`Incorrecto ❌. Pierdes 10 puntos. Intentos restantes: ${nuevosIntentos}`);
      setPuntuacion((prev) => Math.max(0, prev - 10));

      if (nuevosIntentos === 0) {
        setMensaje(`Game Over. La respuesta era: ${palabraActual.correcta}`);
        enviarPuntuacion(puntuacion);
        reiniciarJuego(3);
      } else {
        // Si no se han acabado los intentos, selecciona una nueva palabra
        setTimeout(() => {
          seleccionarNuevaPalabra();
          setMensaje("");
        }, 1500);
      }
    }
  };

  const reiniciarJuego = (segundos: number) => {
    setCountReolad(segundos);
    const intervalo = setInterval(() => {
      setCountReolad((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalo);
      setPuntuacion(0);
      setIntentos(3);
      setPalabrasUsadas([]); // Reinicia las palabras usadas
      seleccionarNuevaPalabra();
      setMensaje("");
      setCountReolad(null);
    }, segundos * 1000);
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error || !palabraActual) {
    return (
      <div className="flex flex-col items-center w-screen justify-center min-h-screen gap-4">
        <p className="text-red-500 text-lg font-bold">Error al cargar el juego</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-screen justify-center min-h-screen p-4 gap-6">
      <h1 className="text-3xl font-bold text-blue-600">{titulo}</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Puntuación: {puntuacion}</div>
          <div className="text-lg font-semibold text-red-500">Intentos: {intentos}</div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-4">Selecciona la forma correcta:</h2>
          <p className="text-2xl font-bold text-red-600 mb-4">{palabraActual.incorrecta}</p>

          <div className="space-y-3">
            {palabraActual.opciones.map((opcion) => (
              <Button
                key={opcion}
                onClick={() => manejarSeleccion(opcion)}
                className="w-full py-3 text-lg"
                variant={
                  mensaje.includes("Correcto") && opcion === palabraActual.correcta
                    ? "success"
                    : "default"
                }
                disabled={!!mensaje}
              >
                {opcion}
              </Button>
            ))}
          </div>
        </div>

        {mensaje && (
          <div
            className={`text-center p-4 rounded-lg ${
              mensaje.includes("Correcto") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <p className="font-semibold">{mensaje}</p>
            {countReload !== null && <p className="mt-2">Reiniciando en {countReload} segundos...</p>}
          </div>
        )}

        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(puntuacion / 100) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}