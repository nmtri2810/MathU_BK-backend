import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  const usersData = [];

  const admin = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: `admin@gmail.com`,
      username: `admin`,
      password: await bcrypt.hash('Aa@123456', 10),
      is_admin: true,
    },
  });
  usersData.push(admin);

  for (let i = 2; i < 12; i++) {
    const user = await prisma.users.upsert({
      where: { id: i },
      update: {},
      create: {
        email: `test${i}@gmail.com`,
        username: `test${i}`,
        password: await bcrypt.hash('Aa@123456', 10),
      },
    });
    usersData.push(user);
  }

  console.log(usersData);
}

async function main() {
  await seedUsers();
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
