import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomIntegerFromRange } from '../utils';
import { Role } from 'src/constants';

const prisma = new PrismaClient();

async function seedRoles() {
  const rolesData = [];

  const admin = await prisma.roles.upsert({
    where: { id: Role.ADMIN },
    update: {},
    create: {
      name: 'Admin',
    },
  });
  rolesData.push(admin);

  const mod = await prisma.roles.upsert({
    where: { id: Role.MODERATOR },
    update: {},
    create: {
      name: 'Moderator',
    },
  });
  rolesData.push(mod);

  const user = await prisma.roles.upsert({
    where: { id: Role.USER },
    update: {},
    create: {
      name: 'User',
    },
  });
  rolesData.push(user);

  console.log(rolesData);
}

async function seedUsers() {
  const usersData = [];

  const admin = await prisma.users.upsert({
    where: { id: Role.ADMIN },
    update: {},
    create: {
      email: `admin@gmail.com`,
      username: `admin`,
      password: await bcrypt.hash('Aa@123456', 10),
      role_id: 1,
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
        role_id: await randomIntegerFromRange(Role.MODERATOR, Role.USER),
      },
    });
    usersData.push(user);
  }

  console.log(usersData);
}

async function main() {
  await seedRoles();
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
