'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'www.url1.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.url2.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.url3.com',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      url: { [Sequelize.Op.in]: ['www.url1.com', 'www.url2.com', 'www.url3.com'] }
    }, {});
  }
};
