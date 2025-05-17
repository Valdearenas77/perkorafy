import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'admin@perkorafy.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  })

  console.log('Usuario creado:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
