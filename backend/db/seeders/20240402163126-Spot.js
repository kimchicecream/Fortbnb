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
        description: 'This manor sits on a small isthmus, connected by a narrow straight which ensures maximum privacy. This beautiful manor has 6 bedrooms, 4 in the main house and 2 in the security home. The beaches around the manor are pistine and kept clean with every visit. You cannot go wrong with a choice like Unmoored Manor.',
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
        description: 'Get this entire villa! Just click that reserve button! This villa sits atop a hill near the south seaside. You cannot go wrong with a giant pool in the middle and up to 4 bedrooms. Perfect for a group of friends or a family! You also get easy beach access with a view of Mount Olympus!',
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
        description: "For just 80,000 vbucks, you can experience a night at the real Mount Olympus. From buildings made of gold, to hedges trimmed to the exact nano-millimeter, you will find the true meaning of perfection. But that is not the it... The view of the statue looms over you as you gaze in awe. Mount Olympus is forbidden to a mortal, but YOU can stay a night for just 80,000 vbucks! Who can honestly say they've been to Mount Olympus? No one! For just 80,000 vbucks, book your night stay! (pls we need the vbucks)",
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
        description: "This castle is no ordinary castle. I sits atop a rock--evidence of a geological disturbance. Hundreds of years ago, the entire North Cliffside slid into the ocean, but amazingly, this castle stood. It has a total of 4 ziplines that give easy access to the island itself. Please note that the host is not responsible if a guest gets injured or dies as a result of falling off the island.",
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
        description: "Located right next to the Grand Station, this apartment offers homey vibes for your comfort. With access to the Grand Station, you can go anywhere! Want to visit the East Seaside? Its only a 10 minute train ride away! The price per night is so low that you'll completely ignore the sound of the train when you sleep, and that's guaranteed.",
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
        description: "Thinking about proposing but don't know where because all the other spots are too popular? Want a peaceful beach experience? Just got married? Honeymoon? Book this place for you and your significant other NOW! This location is the perfect get away location for couples. The home sits on a private beach with two other residents. The residents to the left of you are elderly and quiet so you won't be woken up in the middle of the night to loud music! Absolutely NO parties. Please keep the home and beach clean, as we do our best to provide the best quality service. 20% cleaning fee will be charged upon booking for cleaning services even though we require you to clean. If you dont clean, we'll add another 50% charge. BOOK NOW!",
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
        description: "Book your stay at The Ol' Mill. It is a historic home that we recently started accepting bookings for. Experience what your ancestors did. The Quarter Curve railway wont be heard from the home because it is 1000ft above! Instead, you'll hear the gentle stream from the river as the old wooden mill turns and creaks. And yes! All electricity is generated from the mill, so KEEP CHILDREN AWAY from the mill. Its so old that it could break easily.",
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
        description: "Limited time: 10 vbucks per night. Prices are so low that you can't ignore this listing. Come see our website for all amenities included with your reservation. No the prices aren't low because we recently had a group of hooligans graffiti our inside walls.",
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
        description: "Book this homey apartment in the iconic Snooty Steppes. The view is breath-taking and is especially special because you will be booking the top floor!! Just look at the images. They speak for themselves and at you. 'Come book me' they whisper into your right ear. *gets tingles down your spine* *clicks that reserve button*",
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
        description: "You need to see the Zenith Wall before it all melts! Or better yet, instead of just seeing the wall, come HIKE the Wall! There is a great (unregulated & very dangerous) hiking trail that leds up to the top of the Wall! Disclaimer: hike at your own risk, ice can get very slippery as it turns out.",
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
