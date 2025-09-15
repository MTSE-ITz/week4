const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
  }, { sequelize, modelName: 'Comment', tableName: 'comments' });
  return Comment;
};
