const { sequelize } = require('../configs/db');
const {DataTypes} = require('sequelize');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
           min: 0 
        }
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 50]
        }
    },

    category: {
        type: DataTypes.ENUM('electronic', 'food', 'education'),
        allowNull: false
    }
}, {
    tableName: 'products',
    underscored: true,
    timestamps: true
})

module.exports = Product;