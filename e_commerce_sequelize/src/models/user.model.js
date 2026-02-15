const { sequelize } =  require('../configs/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fullname: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        email: {
           type: DataTypes.TEXT,
           allowNull: false,
           unique: true,
           validate: {
            isEmail: true
           }
        },

        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 70],
                    msg: 'Password must be greater than 6'
                }
            }
        },

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }
    },

    {
        tableName: 'users',
        underscored: true,
        timestamptz: true
    }
)

module.exports = User