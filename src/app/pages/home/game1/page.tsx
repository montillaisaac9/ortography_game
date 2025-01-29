'use client'

import { useState, useEffect } from "react";

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
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [reglas, setReglas] = useState<string>("");

  useEffect(() => {
    // Obtener detalles del juego desde la API
    fetch('/api/juego/1')
      .then((res) => res.json())
      .then((data) => {
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setReglas(data.reglas);
      })
      .catch((error) => console.error("Error al obtener detalles:", error));

    // Seleccionar una palabra aleatoria
    setIndice(Math.floor(Math.random() * palabras.length));
  }, []);

  if (indice === null) return <div>Cargando...</div>;

  const palabraActual = palabras[indice].palabra;
  const pista = palabras[indice].pista;
  const palabraOculta = palabraActual.replace(/[a-zA-Z]/g, "_");

  const enviarPuntuacion = async (puntos: number) => {
    try {
      await fetch('/api/home/games/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 1, newScore: puntos }),
      });
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };

  const verificarRespuesta = () => {
    if (entrada.toLowerCase() === palabraActual.toLowerCase()) {
      const nuevaPuntuacion = puntuacion + 20;
      setPuntuacion(nuevaPuntuacion);
      setMensaje(`¡Correcto! +20 puntos. Total: ${nuevaPuntuacion} pts`);

      if (nuevaPuntuacion >= 100) {
        enviarPuntuacion(nuevaPuntuacion);
        setMensaje("¡Felicidades! Has alcanzado 100 puntos.");
      } else {
        setTimeout(() => {
          setIndice(Math.floor(Math.random() * palabras.length));
          setIntentos(3);
          setEntrada("");
          setMensaje("");
        }, 1000);
      }
    } else {
      const intentosRestantes = intentos - 1;
      setIntentos(intentosRestantes);
      setMensaje(`Incorrecto. Intentos restantes: ${intentosRestantes}`);

      if (intentosRestantes === 0) {
        enviarPuntuacion(puntuacion);
        setMensaje("Game Over. Puntuación final enviada.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4 p-4">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-lg">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <h2 className="text-xl font-bold">Juego de Completación</h2>
      <p className="text-lg">{pista}</p>
      <p className="text-2xl tracking-wider">{palabraOculta}</p>
      <input
        type="text"
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        className="border p-2 rounded-md"
      />
      <button
        onClick={verificarRespuesta}
        disabled={intentos === 0 || puntuacion >= 100}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Verificar
      </button>
      <p className="text-red-500">{mensaje}</p>
      <p>Puntuación: {puntuacion} / 100</p>
      <p>Intentos restantes: {intentos}</p>
    </div>
  );
}