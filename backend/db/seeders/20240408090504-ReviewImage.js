'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'www.google.com'
      },
      {
        reviewId: 2,
        url: 'www.fortnite.com'
      },
      {
        reviewId: 3,
        url: 'godaddy.com'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
      url: { [Sequelize.Op.in]: ['www.google.com', 'www.fortnite.com', 'godaddy.com'] }
    }, {});
  }
};
