import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Limpar banco (cuidado em produção!)
  await prisma.queueEntry.deleteMany()
  await prisma.giraMedium.deleteMany()
  await prisma.gira.deleteMany()
  await prisma.user.deleteMany()
  await prisma.function.deleteMany()
  await prisma.giraType.deleteMany()

  // Criar funções
  const functions = await Promise.all([
    prisma.function.create({ data: { name: 'Médium' } }),
    prisma.function.create({ data: { name: 'Cambone' } }),
    prisma.function.create({ data: { name: 'Ogã' } }),
  ])
  console.log('✅ Funções criadas')

  // Criar tipos de gira
  const giraTypes = await Promise.all([
    prisma.giraType.create({ data: { name: 'Preto-Velho' } }),
    prisma.giraType.create({ data: { name: 'Caboclo' } }),
    prisma.giraType.create({ data: { name: 'Exu' } }),
    prisma.giraType.create({ data: { name: 'Pomba-Gira' } }),
  ])
  console.log('✅ Tipos de gira criados')

  // Criar usuário admin
  const adminPassword = await hash('Admin@123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@ogum.local',
      passwordHash: adminPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin criado: admin@ogum.local / Admin@123')

  // Criar alguns usuários de teste
  const userPassword = await hash('User@123', 10)
  await Promise.all([
    prisma.user.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@ogum.local',
        passwordHash: userPassword,
        role: 'user',
        functionId: functions[0].id, // Médium
      },
    }),
    prisma.user.create({
      data: {
        name: 'João Santos',
        email: 'joao@ogum.local',
        passwordHash: userPassword,
        role: 'user',
        functionId: functions[0].id, // Médium
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana@ogum.local',
        passwordHash: userPassword,
        role: 'user',
        functionId: functions[1].id, // Cambone
      },
    }),
  ])
  console.log('✅ Usuários de teste criados (senha: User@123)')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
