'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
    
      fullname: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
    
      password: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
    
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
    
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('users');
    
  }
};
