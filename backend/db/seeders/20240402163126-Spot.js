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
      // Unmoored Manor spotId 1
      {
        ownerId: 2,
        address: '123 Unmoored Isle',
        city: 'South Seaside Gulf',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'Unmoored Manor',
        description: 'Come visit this Manor!',
        price: 5000
      },
      // Seaside Villa spotId 2
      {
        ownerId: 3,
        address: '2030 S Seaside St',
        city: 'South Seaside',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 37.2334423,
        lng: -123.234234,
        name: 'Seaside Villa',
        description: 'Get this entire villa! Just click that reserve button!',
        price: 2400
      },
      // Mount Olympus spotId 3
      {
        ownerId: 4,
        address: '1111 Olympus Lane',
        city: 'Mount Olympus',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 66.2324222,
        lng: -150.3333333,
        name: 'Entire Palace at Mt. Olympus',
        description: "For just 80,000 vbucks, you can experience a night at the real Mount Olympus.",
        price: 80000
      },
      // Cloistered Castle spotId 4
      {
        ownerId: 5,
        address: '5403 N Cliffside Isle',
        city: 'North Cliffside',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 63.2324222,
        lng: -120.3333333,
        name: 'Cloistered Castle',
        description: "This castle is no ordinary castle. I sits atop a rock--evidence of a geological disturbance.",
        price: 250
      },
      // Apt in Reckless Railways spotId 5
      {
        ownerId: 6,
        address: '752 E Grand Station Street',
        city: 'Reckless Railways',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Two-story apt in Reckless Railways',
        description: "Located right next to the Grand Station, this apartment offers homey vibes for your comfort.",
        price: 60
      },
      // Beachside Lodge spotId 6
      {
        ownerId: 7,
        address: '4040 W Beachside Rd',
        city: 'Southwest Beachside',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Beachside Lodge (Yellow)',
        description: "The home sits on a private beach with two other residents.",
        price: 130
      },
      // The Ol' Mill spotId 7
      {
        ownerId: 8,
        address: '1 N Quarter Curve Rd',
        city: '1/4 Curve Railway',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: "The Ol' Mill",
        description: "Book your stay at The Ol' Mill. It is a historic home that we recently started accepting bookings for.",
        price: 90
      },
      // Single Room at Grand Glacier Hotel spotId 8
      {
        ownerId: 9,
        address: '40 E Grand Rd',
        city: 'Grand Glacier',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Single Room at The Grand Glacier Hotel',
        description: "Limited time: 10 vbucks per night. Prices are so low that you can't ignore this listing.",
        price: 10
      },
      // Apt in Snooty Steppes spotId 9
      {
        ownerId: 10,
        address: '5050 S Snooty Rd',
        city: 'Snooty Steppes',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Top-floor Apartment in Snooty Steppes',
        description: "Book this homey apartment in the iconic Snooty Steppes.",
        price: 230
      },
      // Cabin Near The Zenith Wall spotId 10
      {
        ownerId: 11,
        address: '671 E Zenith Wall',
        city: 'East of Reckless Railways',
        state: 'The Island',
        country: 'Fortnite Universe',
        lat: 62.2324222,
        lng: -119.3333333,
        name: 'Small cabin outlooking the Zenith Wall',
        description: "You need to see the Zenith Wall before it all melts!",
        price: 150
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      name: { [Sequelize.Op.en]: null }
    }, {});
  }
};
