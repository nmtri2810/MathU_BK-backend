import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomIntegerFromRange } from '../utils';
import { Role } from '../constants/enum';
import { faker } from '@faker-js/faker';
import { tagsSeedData } from '../constants/index';

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

  for (let i = 2; i < 22; i++) {
    const user = await createUser(
      i,
      `test${i}@gmail.com`,
      faker.internet.userName({
        firstName: `test${i}`,
        lastName: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      }),
      'Aa@123456',
      await randomIntegerFromRange(Role.MODERATOR, Role.USER),
    );
    usersData.push(user);
  }

  console.log(usersData);
}

async function seedQuestions() {
  const questionsData = [];

  for (let i = 1; i < 31; i++) {
    const question = await prisma.questions.upsert({
      where: { id: i },
      update: {},
      create: {
        title: faker.lorem.sentence({ min: 5, max: 5 }),
        description: faker.lorem.sentences({ min: 6, max: 6 }),
        user_id: await randomIntegerFromRange(1, 21),
      },
    });
    questionsData.push(question);
  }

  console.log(questionsData);
}

async function seedAnswers() {
  const answersData = [];
  let answerId = 1;
  const questionCount = await prisma.questions.count();

  for (let questionId = 1; questionId <= questionCount; questionId++) {
    const numberOfAnswers = faker.number.int({ min: 0, max: 5 });

    for (let j = 0; j < numberOfAnswers; j++) {
      const answer = await prisma.answers.upsert({
        where: { id: answerId },
        update: {},
        create: {
          id: answerId,
          content: faker.lorem.sentences({ min: 6, max: 6 }),
          question_id: questionId,
          user_id: await randomIntegerFromRange(1, 21),
        },
      });
      answersData.push(answer);
      answerId++;
    }
  }

  console.log(answersData);
}

async function seedTags() {
  const tagsData = [];

  for (const tagData of tagsSeedData) {
    const tag = await prisma.tags.upsert({
      where: { name: tagData.name },
      update: {},
      create: {
        name: tagData.name,
        description: tagData.description,
      },
    });
    tagsData.push(tag);
  }

  console.log(tagsData);
}

async function seedQuestionsTags() {
  const questionsTagsData = [];
  const questionIds = await prisma.questions.findMany({
    select: { id: true },
  });

  for (let questionId = 1; questionId <= questionIds.length; questionId++) {
    const numberOfTags = faker.number.int({ min: 1, max: 5 });

    for (let j = 1; j <= numberOfTags; j++) {
      const questionTag = await prisma.questionsTags.upsert({
        where: {
          question_id_tag_id: {
            question_id: questionId,
            tag_id: j,
          },
        },
        update: {},
        create: {
          question_id: questionId,
          tag_id: j,
        },
      });

      questionsTagsData.push(questionTag);
    }
  }

  console.log(questionsTagsData);
}

async function main() {
  await seedRoles();
  await seedUsers();
  await seedQuestions();
  await seedAnswers();
  await seedTags();
  await seedQuestionsTags();
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
