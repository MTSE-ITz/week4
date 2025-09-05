'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      releaseDate: {
        type: Sequelize.DATE,
      },
      length: {
        type: Sequelize.FLOAT,
      },
      width: {
        type: Sequelize.FLOAT,
      },
      height: {
        type: Sequelize.FLOAT,
      },
      ageRating: {
        type: Sequelize.INTEGER,
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
