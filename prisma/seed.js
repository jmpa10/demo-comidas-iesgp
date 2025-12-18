require('dotenv/config')

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL
const prisma = connectionString
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
  : new PrismaClient()

async function main() {
  console.log('🌱 Creando usuarios de prueba...')

  // Crear usuario Admin/Profesor
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iesgregorioprieto.es' },
    update: {},
    create: {
      email: 'admin@iesgregorioprieto.es',
      name: 'Profesor Admin',
      role: 'TEACHER',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Usuario Admin creado:', admin.email)

  // Crear usuario Cliente
  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@iesgregorioprieto.es' },
    update: {},
    create: {
      email: 'cliente@iesgregorioprieto.es',
      name: 'Cliente Demo',
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Usuario Cliente creado:', cliente.email)

  // Crear menús de ejemplo (idempotente: solo si no hay menús aún)
  const menusCount = await prisma.menu.count()
  if (menusCount === 0) {
    const menu1 = await prisma.menu.create({
      data: {
        name: 'Menú del Día - Lunes',
        description: 'Menú completo con primero, segundo y postre',
        price: 12.50,
        date: new Date(), // Fecha de hoy
        available: true,
        dishes: {
          create: [
            {
              name: 'Ensalada Mixta',
              description: 'Lechuga, tomate, cebolla y maíz',
              price: 4.50,
              imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            },
            {
              name: 'Pollo Asado con Patatas',
              description: 'Pollo al horno con patatas fritas',
              price: 8.50,
              imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
            },
            {
              name: 'Flan Casero',
              description: 'Flan tradicional con caramelo',
              price: 3.00,
              imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400',
            },
          ],
        },
      },
    })

    console.log('✅ Menú 1 creado:', menu1.name)

    const menu2 = await prisma.menu.create({
      data: {
        name: 'Menú del Día - Miércoles',
        description: 'Especial de pasta italiana',
        price: 11.00,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Mañana
        available: true,
        dishes: {
          create: [
            {
              name: 'Sopa de Verduras',
              description: 'Sopa casera con verduras frescas',
              price: 3.50,
              imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
            },
            {
              name: 'Pasta Carbonara',
              description: 'Espaguetis con salsa carbonara',
              price: 7.00,
              imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
            },
            {
              name: 'Helado',
              description: 'Helado artesanal variado',
              price: 2.50,
              imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
            },
          ],
        },
      },
    })

    console.log('✅ Menú 2 creado:', menu2.name)
  } else {
    console.log(`ℹ️ Ya existen menús (${menusCount}). Omitiendo creación de menús demo.`)
  }

  console.log('\n🎉 ¡Base de datos poblada con éxito!')
  console.log('\n📝 Usuarios de prueba creados:')
  console.log('   Admin: admin@iesgregorioprieto.es')
  console.log('   Cliente: cliente@iesgregorioprieto.es')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
