const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RecentView extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  RecentView.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'RecentView', tableName: 'recent_views' });
  return RecentView;
};
