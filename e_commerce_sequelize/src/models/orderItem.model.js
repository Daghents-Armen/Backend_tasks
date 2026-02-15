const { sequelize } = require('../configs/db');

const {DataTypes} = require('sequelize');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id'
    },

    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id'
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false 
    }
}, {
    tableName: 'order_items',
    underscored: true,
    timestamps: true
})

module.exports = OrderItem