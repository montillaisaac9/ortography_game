import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with games...');

  // Insertar juegos
  await prisma.game.createMany({
    data: [
      {
        id: 1,
        name: 'Completación',
        description: 'El jugador verá una palabra incompleta con espacios en blanco. Debe completar la palabra con las letras correctas. Si acierta, suma puntos. El juego tiene 3 intentos por palabra.',
        rules: 'Se presenta una palabra con letras faltantes, y el jugador debe completarla correctamente. Si acierta, gana puntos. Si no, pierde un intento.',
        createdAt: new Date('2025-01-28T20:27:09.869Z'),
        updatedAt: new Date('2025-01-28T20:27:09.869Z')
      },
      {
        id: 2,
        name: 'Elige la Palabra Correcta',
        description: 'Se presenta una palabra mal escrita con varias opciones de corrección. El jugador debe elegir la opción correcta. Suma puntos por cada respuesta correcta.',
        rules: 'El jugador ve una palabra incorrecta y debe seleccionar la opción correcta entre tres alternativas. Si la respuesta es correcta, gana puntos.',
        createdAt: new Date('2025-01-28T20:27:09.869Z'),
        updatedAt: new Date('2025-01-28T20:27:09.869Z')
      },
      {
        id: 3,
        name: 'Palabra Relacionada',
        description: 'El jugador debe identificar la palabra que se escribe de manera incorrecta entre un conjunto de palabras. Si acierta, gana puntos. Si no, pierde puntos.',
        rules: 'Se presentan cuatro palabras, de las cuales tres son correctas y una está mal escrita. El jugador debe identificar la palabra incorrecta.',
        createdAt: new Date('2025-01-28T20:27:09.869Z'),
        updatedAt: new Date('2025-01-28T20:27:09.869Z')
      },
      {
        id: 4,
        name: 'Ordena las Letras',
        description: 'El jugador debe ordenar las letras desordenadas para formar una palabra correctamente escrita. Se dan 3 intentos para acertar la palabra. Al acertar, el jugador gana puntos.',
        rules: 'El jugador recibe un conjunto de letras desordenadas. Debe ordenar las letras correctamente para formar una palabra válida. Tiene 3 intentos para resolverla.',
        createdAt: new Date('2025-01-28T20:27:09.869Z'),
        updatedAt: new Date('2025-01-28T20:27:09.869Z')
      },
      {
        id: 5,
        name: 'Completa la Frase',
        description: 'El jugador completa una frase con las palabras correctas que se les presenten. Si el jugador elige correctamente, gana puntos; si no, pierde puntos.',
        rules: 'Se presenta una frase incompleta y el jugador debe completar con la palabra correcta. Si acierta, gana puntos, y si se equivoca, pierde puntos.',
        createdAt: new Date('2025-01-28T20:27:09.869Z'),
        updatedAt: new Date('2025-01-28T20:27:09.869Z')
      }
    ],
  });

  console.log('✅ Seeding completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
