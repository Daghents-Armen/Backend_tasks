const { User } = require('../models');

const getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']]
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  return user;
};

module.exports = {
  getAllUsers,
  getUserById
};
