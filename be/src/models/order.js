const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  }, { sequelize, modelName: 'Order', tableName: 'orders' });
  return Order;
};
