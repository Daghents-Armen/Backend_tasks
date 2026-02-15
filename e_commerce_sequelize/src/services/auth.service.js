const bcrypt = require('bcrypt');
const { User } = require('../models');

const registerUser = async ({ fullname, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword
  });

  return user;
};

const validateUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};

module.exports = {
  registerUser,
  validateUser
};
