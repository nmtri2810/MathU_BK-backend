export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expired: process.env.JWT_EXPIRED,
    },
    bcrypt: {
      saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
    },
  },
});
