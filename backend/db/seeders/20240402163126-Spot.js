'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States Of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123
      },
      {
        address: '2030 E Hamilton Rd',
        city: 'Phoenix',
        state: 'Arizona',
        country: 'United States Of America',
        lat: 37.2334423,
        lng: -123.234234,
        name: 'Apartment',
        description: 'Home sweet home',
        price: 1500
      },
      {
        address: '1111 Trump Rd',
        city: 'New York City',
        state: 'Manhanttan',
        country: 'United States Of America',
        lat: 66.2324222,
        lng: -333.3333333,
        name: 'Trump Tower',
        description: 'Soda',
        price: 80000
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Apartment', 'Trump Tower'] }
    }, {});
  }
};
