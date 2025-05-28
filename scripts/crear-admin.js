const { prisma } = require('./prisma')
const { hash } = require('bcryptjs')

async function main() {
  const email = 'superadmin@perkorafy.com'
  const plainPassword = 'admin1234'
  const name = 'Super Admin'

  const existing = await prisma.admin.findUnique({ where: { email } })

  if (existing) {
    console.log('❌ Ya existe un admin con ese email.')
    return
  }

  const hashedPassword = await hash(plainPassword, 10)

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  console.log('✅ Administrador creado correctamente.')
  console.log(`Email: ${email}`)
  console.log(`Contraseña: ${plainPassword}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

