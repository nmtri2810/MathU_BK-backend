import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomIntegerFromRange } from '../utils';
import { Role } from '../constants/index';

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

async function seedPosts() {
  const postsData = [];

  for (let i = 1; i < 11; i++) {
    const post = await prisma.posts.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Title post ${i}`,
        description: `Desc ${i}`,
        user_id: i,
      },
    });
    postsData.push(post);
  }

  console.log(postsData);
}

async function seedComments() {
  const commentsData = [];

  for (let i = 1; i < 11; i++) {
    const comment = await prisma.comments.upsert({
      where: { id: i },
      update: {},
      create: {
        content: `Comment ${i} for post`,
        post_id: await randomIntegerFromRange(1, 3),
        user_id: await randomIntegerFromRange(1, 3),
      },
    });
    commentsData.push(comment);
  }

  console.log(commentsData);
}

async function main() {
  await seedRoles();
  await seedUsers();
  await seedPosts();
  await seedComments();
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
