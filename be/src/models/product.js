'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define association here
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    releaseDate: {
      type: DataTypes.DATE,
    },
    length: {
      type: DataTypes.FLOAT,
    },
    width: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
    ageRating: {
      type: DataTypes.INTEGER,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  });

  return Product;
};