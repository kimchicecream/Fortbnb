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
    await Spot.bulkCreate([
      {
        ownerId: 1,
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
        ownerId: 2,
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
        ownerId: 3,
        address: '1111 Trump Rd',
        city: 'New York City',
        state: 'Manhanttan',
        country: 'United States Of America',
        lat: 66.2324222,
        lng: -150.3333333,
        name: 'Trump Tower',
        description: 'Soda',
        price: 80000
      },
      {
        ownerId: 1,
        address: '5403 N Estate Street',
        city: 'Lavish Lair',
        state: 'The Island',
        country: 'United States Of America',
        lat: 63.2324222,
        lng: -120.3333333,
        name: 'Lavish Mansion Estate',
        description: '1,000,000 vbuck property on The Island. Located at Lavish Lair, north of Restored Reels.',
        price: 1000000
      },
      {
        ownerId: 1,
        address: '752 E Grand Station Street',
        city: 'Reckless Railways',
        state: 'The Island',
        country: 'United States Of America',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Second Floor Apartment',
        description: 'Located right next to the Grand Station, this apartment offers homey vibes for your comfort.',
        price: 2000
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      name: { [Sequelize.Op.en]: null }
    }, {});
  }
};
