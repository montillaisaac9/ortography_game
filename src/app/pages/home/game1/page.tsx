'use client'

import { useState, useEffect } from "react";
import { set } from "zod";

// Definición de las palabras
const palabras = [
  { palabra: "gato", pista: "Animal doméstico que maulla" },
  { palabra: "casa", pista: "Lugar donde vives" },
  { palabra: "sol", pista: "Brilla en el cielo y da calor" },
  { palabra: "luna", pista: "El satélite natural de la Tierra" },
  { palabra: "perro", pista: "Animal doméstico que ladra" },
  { palabra: "flor", pista: "Planta que tiene colores brillantes" },
  { palabra: "manzana", pista: "Fruta roja, verde o amarilla" },
  { palabra: "agua", pista: "Líquido vital para los seres vivos" },
  { palabra: "pelota", pista: "Objeto redondo utilizado para jugar" },
  { palabra: "libro", pista: "Objeto que contiene información escrita" },
  { palabra: "carro", pista: "Medio de transporte sobre ruedas" },
  { palabra: "fruta", pista: "Alimento natural comestible que viene de plantas" },
  { palabra: "luz", pista: "Lo que permite ver en la oscuridad" },
  { palabra: "lago", pista: "Gran masa de agua rodeada de tierra" },
  { palabra: "montaña", pista: "Gran elevación natural de la Tierra" },
  { palabra: "estrella", pista: "Cuerpo celeste brillante" },
  { palabra: "guitarra", pista: "Instrumento musical con cuerdas" },
  { palabra: "piano", pista: "Instrumento musical de teclas blancas y negras" },
  { palabra: "plaza", pista: "Espacio público abierto, a menudo con bancos" },
  { palabra: "avión", pista: "Medio de transporte que vuela" },
  { palabra: "tren", pista: "Medio de transporte que circula sobre rieles" },
  { palabra: "reina", pista: "Monarca femenina" },
  { palabra: "rey", pista: "Monarca masculino" },
  { palabra: "ciudad", pista: "Lugar con muchas viviendas y edificios" },
  { palabra: "piscina", pista: "Recipiente con agua para nadar" },
  { palabra: "pluma", pista: "Parte del cuerpo de un ave" },
  { palabra: "dientes", pista: "Partes duras de la boca utilizadas para masticar" },
  { palabra: "nariz", pista: "Órgano para oler y respirar" },
  { palabra: "ojos", pista: "Órganos de la vista" },
  { palabra: "viento", pista: "Movimiento del aire" },
  { palabra: "ratón", pista: "Animal pequeño que suele vivir en casas" },
  { palabra: "cielo", pista: "Espacio que está por encima de nosotros" },
  { palabra: "rojo", pista: "Color de la pasión y el peligro" },
  { palabra: "verde", pista: "Color asociado con la naturaleza" },
  { palabra: "azul", pista: "Color del cielo y el mar" },
  { palabra: "rosa", pista: "Color asociado con el amor y las flores" },
  { palabra: "madera", pista: "Material proveniente de los árboles" },
  { palabra: "huevo", pista: "Producto que pone el ave" },
  { palabra: "piedra", pista: "Material duro encontrado en la naturaleza" },
  { palabra: "arena", pista: "Partículas pequeñas de roca, común en las playas" },
  { palabra: "aire", pista: "Gas que rodea la Tierra y es necesario para respirar" },
  { palabra: "puerta", pista: "Acceso cerrado o abierto para entrar o salir" },
  { palabra: "ventana", pista: "Abertura en una pared para ver hacia afuera" },
  { palabra: "nieve", pista: "Agua congelada que cae del cielo en invierno" },
  { palabra: "chocolate", pista: "Dulce hecho a base de cacao" },
  { palabra: "zapato", pista: "Prenda de vestir para los pies" },
  { palabra: "ropa", pista: "Conjunto de prendas para vestir" },
];


export default function CompletacionGame() {
  const [entrada, setEntrada] = useState("");
  const [intentos, setIntentos] = useState(3);
  const [puntuacion, setPuntuacion] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [indice, setIndice] = useState<number | null>(null);
  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [reglas, setReglas] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setcountReolad] = useState<number | null >(null);

  useEffect(() => {
    setIndice(Math.floor(Math.random() * palabras.length));
  }, []);

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      setError(false);
      
      try {
        const res = await fetch('/api/home/games?id=1');
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
    setIndice(Math.floor(Math.random() * palabras.length));
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
        body: JSON.stringify({ gameId: 1, newScore: puntos }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };

  if (indice === null) return <div>Cargando...</div>;

  const palabraActual = palabras[indice].palabra;
  const pista = palabras[indice].pista;
  const palabraOculta = palabraActual.replace(/[a-zA-Z]/g, "_");

  const verificarRespuesta = () => {
    if (entrada.toLowerCase() === palabraActual.toLowerCase()) {
    const nuevaPuntuacion = puntuacion + 20
    setPuntuacion(nuevaPuntuacion);
    if (nuevaPuntuacion >= 100) {
    setMensaje(`🎉 ¡Felicidades! ¡Has completado el juego!`);
    setIntentos(0)
    return enviarPuntuacion(nuevaPuntuacion); // Enviar puntuación cuando llega a 100
    }  
    setPuntuacion(nuevaPuntuacion);
      setMensaje(`✅ ¡Correcto! +20 puntos.`);
      setTimeout(() => {
        setIndice(Math.floor(Math.random() * palabras.length));
        setIntentos(3);
        setEntrada("");
        setMensaje("");
      }, 1000);
    } else {
      const intentosRestantes = intentos - 1;
      setIntentos(intentosRestantes);
      setMensaje(`❌ Incorrecto. Intentos restantes: ${intentosRestantes}`);
  
      if (intentosRestantes === 0) {
        setMostrarPalabra(true);
        setMensaje(`❌ Game Over. La palabra era: ${palabraActual}`);
        enviarPuntuacion(puntuacion)
        // Iniciar cuenta regresiva de 3 segundos antes de reiniciar el juego
        setcountReolad(3);
        const countdown = setInterval(() => {
          setcountReolad((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
        }, 1000);
  
        setTimeout(() => {
          clearInterval(countdown); // Detener el intervalo
          setIndice(Math.floor(Math.random() * palabras.length));
          setIntentos(3);
          setEntrada("");
          setMensaje("");
          setMostrarPalabra(false);
          setPuntuacion(0);
          setcountReolad(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4 p-4">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-lg">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <h2 className="text-xl font-bold">Pista</h2>
      <p className="text-lg">{pista}</p>
      <p className="text-2xl tracking-wider">
        {mostrarPalabra ? palabraActual : palabraOculta}
      </p>

      <input
        type="text"
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        className="border p-2 rounded-md text-center"
      />

      <button
        onClick={verificarRespuesta}
        disabled={intentos === 0 || puntuacion >= 100}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Verificar
      </button>

      <p className={mensaje.includes("❌") ? "text-red-500" : "text-green-500"}>{mensaje}</p>

      {/* Barra de progreso */}
      <div className="w-full max-w-md bg-gray-300 rounded-lg h-6 mt-4">
        <div
          className="bg-green-500 h-6 rounded-lg transition-all duration-500"
          style={{ width: `${(puntuacion / 100) * 100}%` }}
        ></div>
      </div>

      <p>Puntuación: {puntuacion} / 100</p>
      <p>Intentos restantes: {intentos}</p>
      {countReload !== null && <p>Reiniciando en {countReload}...</p>}
    </div>
  );
}