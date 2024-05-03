export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    jwt_access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expired: process.env.JWT_ACCESS_EXPIRED,
    },
    jwt_refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expired: process.env.JWT_REFRESH_EXPIRED,
    },
    bcrypt: {
      saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
    },
  },
});
