import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Insertando perks de ejemplo...')

  await prisma.perk.createMany({
    data: [
      {
        nombre: 'Día libre',
        descripcion: 'Disfruta de un día libre para ti',
        puntos: 200,
        imagen: '/perks/dia-libre.png',
      },
      {
        nombre: 'Amazon 50€',
        descripcion: 'Vale regalo de Amazon por 50 euros',
        puntos: 500,
        imagen: '/perks/amazon-50.png',
      },
      {
        nombre: 'Entrada cine',
        descripcion: 'Entrada doble para cualquier cine',
        puntos: 150,
        imagen: '/perks/cine.png',
      },
    ],
    skipDuplicates: true, // evita repetir registros si ya existen
  })

  console.log('✅ Perks insertados correctamente')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error al insertar perks:', e)
    prisma.$disconnect()
    process.exit(1)
  })
