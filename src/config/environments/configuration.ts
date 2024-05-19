// use for large project
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  clientUrl: process.env.CLIENT_URL,
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
  OAuth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
