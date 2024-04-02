'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId'
      });
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
