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
        url: 'https://i.postimg.cc/Z5CbFC29/Bunker-Hut-1.webp',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/Z5CbFC29/Bunker-Hut-1.webp',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/Z5CbFC29/Bunker-Hut-1.webp',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      url: { [Sequelize.Op.ne]: null }
    }, {});
  }
};
