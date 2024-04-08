'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2050-12-12',
        endDate: '2050-12-13'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2060-12-12',
        endDate: '2060-12-13'
      },
      {
        spotId: 1,
        userId: 1,
        startDate: '2070-12-12',
        endDate: '2070-12-13'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, {
      startDate: { [Sequelize.Op.in]: ['2050-12-12', '2060-12-12', '2070-12-12'] }
    }, {});
  }
};
