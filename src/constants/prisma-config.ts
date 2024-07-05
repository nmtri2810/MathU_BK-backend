const userConfig = {
  select: {
    id: true,
    email: true,
    username: true,
    avatar_url: true,
    reputation: true,
    role_id: true,
  },
};

export const answerIncludeConfig = {
  children: {
    include: {
      user: userConfig,
    },
  },
  user: userConfig,
  votes: true,
};

export const questionIncludeConfig = {
  tags: {
    include: {
      tag: true,
    },
  },
  answers: {
    include: answerIncludeConfig,
    where: { parent_id: null },
  },
  user: userConfig,
  votes: true,
  _count: {
    select: {
      votes: true,
      answers: {
        where: { parent_id: null },
      },
      tags: true,
    },
  },
};
