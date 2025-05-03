module.exports = {
  secret: process.env.JWT_SECRET || "fallback_secret",
  expiresIn: process.env.JWT_EXPIRE,
};
