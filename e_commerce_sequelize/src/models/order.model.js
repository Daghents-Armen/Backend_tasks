const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },

  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  status: {
    type: DataTypes.ENUM(
      'pending',
      'paid',
      'shipped',
      'cancelled'
    ),
    allowNull: false,
    defaultValue: 'pending'
  }

}, {
  tableName: 'orders',
  underscored: true,
  timestamps: true
});

module.exports = Order;
