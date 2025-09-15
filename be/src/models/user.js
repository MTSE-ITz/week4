'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Favorite, { foreignKey: 'userId', as: 'favorites' });
      this.hasMany(models.RecentView, { foreignKey: 'userId', as: 'recentViews' });
      this.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
      this.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
}