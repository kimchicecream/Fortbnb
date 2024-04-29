'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      // USER 2
      {
        userId: 2,
        spotId: 2,
        review: 'Came here with family for a weekend. Truly a privilege to be able to book a place like this.',
        stars: 5
      },
      {
        userId: 2,
        spotId: 4,
        review: "Don't know how to feel about my stay. I felt in danger of tipping over with the castle right into the ocean.. But otherwise great view.",
        stars: 3
      },
      {
        userId: 2,
        spotId: 5,
        review: "If I owned this apartment, I woudln't even list it on Fortbnb.. The trains are just too loud!",
        stars: 2
      },
      {
        userId: 2,
        spotId: 6,
        review: 'Absolutely gorgeous and clean beach. Neighbors were nice enough to let me have some lighter fluid for the grill! That cleaning fee, though..',
        stars: 4
      },
      {
        userId: 2,
        spotId: 7,
        review: 'Place creaks so much it scared my kids. Otherwise, it was a great stay.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 8,
        review: "All I'm going to say is: You get what you pay for. ",
        stars: 1
      },
      {
        userId: 2,
        spotId: 9,
        review: "Amazing stay at Mason's. I've always wanted to stay at a place like this. Imagine a raceway through the street!",
        stars: 5
      },
      {
        userId: 2,
        spotId: 10,
        review: "Cabin was cozy, but the heater would constantly turn off for an hour, then come back on for only half. Almost froze through the night. The wall was pretty cool though.",
        stars: 4
      },
      // USER 3
      {
        userId: 3,
        spotId: 1,
        review: "The loot sucks, but cozy.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 4,
        review: "The inside of the castle is too crammed together.",
        stars: 2
      },
      {
        userId: 3,
        spotId: 5,
        review: "Train station is too loud. This was the only fortbnb available there at the time so I had no choice.",
        stars: 1
      },
      {
        userId: 3,
        spotId: 6,
        review: "Its too quiet... Almost like I cant even hear the ocean or wind",
        stars: 3
      },
      {
        userId: 3,
        spotId: 7,
        review: "This mill is basically a creaky cabin. Spend your hard-earned vbucks elsewhere",
        stars: 2
      },
      {
        userId: 3,
        spotId: 8,
        review: "The listing images are misleading... The wallpapers are falling off and there's graffiti everywhere",
        stars: 1
      },
      {
        userId: 3,
        spotId: 9,
        review: "This place was too loud. I can hear everyone talking on the streets. Why do most places not have closable windows??",
        stars: 2
      },
      {
        userId: 3,
        spotId: 10,
        review: "The wall was shorter than I thought. I would say the images are misleading, but a second look made it seem smaller.",
        stars: 2
      },
      {
        userId: 5,
        spotId: 5,
        review: "The place was very homey and I had everything I needed. I knew the trains were gonna be loud, so I just bought some earplugs from the nearby store.",
        stars: 4
      },
      {
        userId: 5,
        spotId: 6,
        review: "My fiancee proposed to me here. It was absolutely magical!",
        stars: 5
      },
      {
        userId: 5,
        spotId: 7,
        review: "Came here with friends. It was very nice and homey!",
        stars: 5
      },
      {
        userId: 5,
        spotId: 8,
        review: "Although everything seemed run down, the staff seemed to really want to accomodate me. For that, I'll give a generous 3 stars",
        stars: 3
      },
      {
        userId: 5,
        spotId: 9,
        review: "Came here with my girlies! We had so much fun. There was so much to do in such a small town, which made getting around easy! Everything was literally a walk away.",
        stars: 5
      },
      {
        userId: 5,
        spotId: 10,
        review: "I wanted to get some picture of the Zenith Wall so I booked this spot. Everything turned out great!",
        stars: 5
      },
      {
        userId: 6,
        spotId: 4,
        review: "Definitely no ordinary castle.",
        stars: 4
      },
      {
        userId: 6,
        spotId: 8,
        review: "Smelled like something was dying in the walls of my room... I slept outside on the balcony for the night",
        stars: 1
      },
      {
        userId: 6,
        spotId: 9,
        review: "Truly amazing. My friends and I got around everywhere on foot. It was rewarding because of that cool ocean breeze!",
        stars: 5
      },
      {
        userId: 6,
        spotId: 10,
        review: "Very cold! Came with my girlfriend so we shared our warm bodies, hehe.",
        stars: 5
      },
      {
        userId: 7,
        spotId: 1,
        review: "Very peaceful and secluded, but hard to get around. Our truck coudln't even make it across the narrow straight.",
        stars: 4
      },
      {
        userId: 7,
        spotId: 2,
        review: "I'd love to own a villa like this one day. Everything was cleanly and the owner made sure I was accomodated.",
        stars: 5
      },
      {
        userId: 7,
        spotId: 4,
        review: "Threw a party here with many of my friends. Suprised no one jumped.",
        stars: 5
      },
      {
        userId: 7,
        spotId: 5,
        review: "Had to find a place to stay the night because my train broke down. Glad this place was available.",
        stars: 4
      },
      {
        userId: 7,
        spotId: 9,
        review: "Went on a cruise with friends! We decided to get this place after the cruise because we wanted to stay longer. Snooty is such a fun place.",
        stars: 5
      },
      {
        userId: 7,
        spotId: 10,
        review: "My friends and I bought sleds and rode them down the top of the glacier. Very dangerous, 10/10 would recommend.",
        stars: 5
      },
      {
        userId: 8,
        spotId: 4,
        review: "Cool place to kick back with friends",
        stars: 4
      },
      {
        userId: 8,
        spotId: 5,
        review: "The trains are very loud. Recommend you buy some earplugs before sleeping! Otherwise, worth the money.",
        stars: 4
      },
      {
        userId: 8,
        spotId: 6,
        review: "Needed to get away from work and life. Decided to pull the trigger and book for myself because I definitely needed it. It was very calming. My aura feels rejuvenated.",
        stars: 5
      },
      {
        userId: 8,
        spotId: 10,
        review: "Heater did not work throughout the night...",
        stars: 2
      },
      {
        userId: 9,
        spotId: 4,
        review: "Like, WHO in their right mind would want to live here? Having to zipline EVERY. SINGLE. TIME. just to get back to civilization???",
        stars: 1
      },
      {
        userId: 9,
        spotId: 5,
        review: "Why did I even bother? The store near this apartment sold me BROKEN earplugs. I cannot even.",
        stars: 2
      },
      {
        userId: 9,
        spotId: 6,
        review: "Booked this place for a getaway with my boyfriend. He ended up dumping me and left during the middle of the stay. Oddly, I felt free and more alive. This place calmed my mind and helped me see things clear.",
        stars: 5
      },
      {
        userId: 9,
        spotId: 7,
        review: "EW. This place gives me the creeps! Booked this place for me and my girls thinking it was gonna be a cute place to stay. But NO. SPIDERS!",
        stars: 2
      },
      {
        userId: 10,
        spotId: 1,
        review: "Amazing stay.",
        stars: 5
      },
      {
        userId: 10,
        spotId: 2,
        review: "Amazing stay.",
        stars: 5
      },
      {
        userId: 10,
        spotId: 4,
        review: "Amazing stay.",
        stars: 5
      },
      {
        userId: 10,
        spotId: 5,
        review: "Amazing stay.",
        stars: 5
      },
      {
        userId: 10,
        spotId: 6,
        review: "Amazing stay.",
        stars: 5
      },
      {
        userId: 10,
        spotId: 8,
        review: "Amazing.",
        stars: 5
      },
      {
        userId: 11,
        spotId: 2,
        review: "The loot here is great. I think theres about 12 chests that spawn here so its a great landing spot for a duo.",
        stars: 5
      },
      {
        userId: 11,
        spotId: 4,
        review: "Landing here is not ideal. There isn't much loot. Its especially not good for anything other than a solo landing spot.",
        stars: 3
      },
      {
        userId: 11,
        spotId: 6,
        review: "Would recommend. 10/10 for a solo landing spot. Its on the edge of the island with great loot.",
        stars: 5
      },
      {
        userId: 11,
        spotId: 7,
        review: "I personally never land here. Theres closer areas that are more worth landing at.",
        stars: 5
      },
      {
        userId: 11,
        spotId: 8,
        review: "After the last update, chests don't spawn as much. Don't recommend.",
        stars: 1
      },
      {
        userId: 11,
        spotId: 9,
        review: "ABSOLUTELY A GREAT DUO LANDING SPOT. Be prepared for conflict tho.",
        stars: 5
      }

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
      stars: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
