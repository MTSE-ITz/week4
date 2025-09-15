const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  Favorite.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'Favorite', tableName: 'favorites' });
  return Favorite;
};