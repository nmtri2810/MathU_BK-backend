import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomIntegerFromRange } from '../utils';
import { Role } from '../constants/enum';

const prisma = new PrismaClient();

async function seedRoles() {
  async function createRole(name: string, roleId: number) {
    return await prisma.roles.upsert({
      where: { id: roleId },
      update: {},
      create: {
        name: name,
      },
    });
  }

  const rolesData = [];

  const admin = await createRole('Admin', Role.ADMIN);
  const mod = await createRole('Moderator', Role.MODERATOR);
  const user = await createRole('User', Role.USER);

  rolesData.push(admin, mod, user);
  console.log(rolesData);
}

async function seedUsers() {
  async function createUser(
    id: number,
    email: string,
    username: string,
    password: string,
    roleId: number,
  ) {
    return await prisma.users.upsert({
      where: { id: id },
      update: {},
      create: {
        email: email,
        username: username,
        password: await bcrypt.hash(password, 10),
        role_id: roleId,
      },
    });
  }

  const usersData = [];

  const admin = await createUser(
    1,
    'admin@gmail.com',
    'admin',
    'Aa@123456',
    Role.ADMIN,
  );
  usersData.push(admin);

  for (let i = 2; i < 12; i++) {
    const user = await createUser(
      i,
      `test${i}@gmail.com`,
      `test${i}`,
      'Aa@123456',
      await randomIntegerFromRange(Role.MODERATOR, Role.USER),
    );
    usersData.push(user);
  }

  console.log(usersData);
}

async function seedQuestions() {
  const questionsData = [];

  for (let i = 1; i < 11; i++) {
    const question = await prisma.questions.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Title question ${i}`,
        description: `Desc ${i}`,
        user_id: i,
      },
    });
    questionsData.push(question);
  }

  console.log(questionsData);
}

async function seedAnswers() {
  const answersData = [];

  for (let i = 1; i < 11; i++) {
    const answer = await prisma.answers.upsert({
      where: { id: i },
      update: {},
      create: {
        content: `Answer ${i} for question`,
        question_id: await randomIntegerFromRange(1, 3),
        user_id: await randomIntegerFromRange(1, 3),
      },
    });
    answersData.push(answer);
  }

  console.log(answersData);
}

async function main() {
  await seedRoles();
  await seedUsers();
  await seedQuestions();
  await seedAnswers();
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
