const bcrypt = require('bcrypt');
const prisma = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 12;

const register = async (email, password, role = 'USER') => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw { statusCode: 400, message: 'Email already registered' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

const refresh = async (token) => {
  const decoded = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user || user.refreshToken !== token) {
    throw { statusCode: 403, message: 'Invalid refresh token' };
  }

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

module.exports = { register, login, refresh, logout };
