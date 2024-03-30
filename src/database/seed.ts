import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersData = [];
  for (let i = 1; i < 11; i++) {
    const user = await prisma.users.upsert({
      where: { id: i },
      update: {},
      create: {
        email: `test${i}@gmail.com`,
        username: `test${i}`,
      },
    });

    usersData.push(user);
  }

  console.log(usersData);
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
