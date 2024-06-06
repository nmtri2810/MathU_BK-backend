export const questionIncludeConfig = {
  tags: {
    include: {
      tag: true,
    },
  },
  answers: true,
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      avatar_url: true,
      reputation: true,
      role_id: true,
    },
  },
  votes: true,
  _count: { select: { votes: true, answers: true, tags: true } },
};
