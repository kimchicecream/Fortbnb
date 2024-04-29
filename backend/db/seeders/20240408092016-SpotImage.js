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
        url: 'https://i.postimg.cc/7hyF4LnX/Unmoored-Manor-1.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.postimg.cc/1RjFvNMp/Unmoored-Manor-2.png',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.postimg.cc/W4wr8Wf3/Unmoored-Manor-3.png',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.postimg.cc/qqSCq9gm/Unmoored-Manor-4.png',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.postimg.cc/HncVqB3b/Unmoored-Manor-5.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/BQhKw737/Seaside-Villa-5.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/vHnJ0k5b/Seaside-Villa-1.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/DyfG6k9b/Seaside-Villa-2.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/QdycV4nK/Seaside-Villa-3.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.postimg.cc/R0JKt7js/Seaside-Villa-4.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/VNLwdgpM/Mount-Olympus-1.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/k5kTkXQ4/Mount-Olympus-2.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/kggYSHMn/Mount-Olympus-3.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/Mp3PmYX1/Mount-Olympus-4.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.postimg.cc/50Ls1dgm/Mount-Olympus-5.png',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.postimg.cc/XJrpy4mw/Cloistered-Castle-1.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.postimg.cc/tJyGGz3Y/Cloistered-Castle-2.png',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.postimg.cc/pdwtqvyQ/Cloistered-Castle-3.png',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.postimg.cc/v8LdLpy9/Cloistered-Castle-4.png',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.postimg.cc/kXsq9Lh9/Cloistered-Castle-5.png',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.postimg.cc/pdXB455R/Apt-Reckless-Railways-1.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://i.postimg.cc/90pdLWXr/Apt-Reckless-Railways-2.png',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.postimg.cc/Hszz2tjB/Apt-Reckless-Railways-3.png',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.postimg.cc/QM2Jt4nx/Apt-Reckless-Railways-4.png',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.postimg.cc/jqQ4xh6t/Apt-Reckless-Railways-5.png',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.postimg.cc/NMWsZTMn/Beachside-Lodge-1.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://i.postimg.cc/59RkvVKn/Beachside-Lodge-2.png',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.postimg.cc/bN4WXhQs/Beachside-Lodge-3.png',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.postimg.cc/TYSMRmX2/Beachside-Lodge-4.png',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.postimg.cc/XJ21sSjN/Beachside-Lodge-5.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.postimg.cc/jdhccYZp/The-Ol-Mill-House-1.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://i.postimg.cc/NM4FVDSj/The-Ol-Mill-House-2.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.postimg.cc/jSwW5zwM/The-Ol-Mill-House-3.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.postimg.cc/15YnsWtg/The-Ol-Mill-House-4.png',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.postimg.cc/j5rnBLjZ/The-Ol-Mill-House-5.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.postimg.cc/x16SW7T7/Single-Room-Grand-Glacier-1.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://i.postimg.cc/Xv9kZMG1/Single-Room-Grand-Glacier-2.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.postimg.cc/L8cV64XZ/Single-Room-Grand-Glacier-3.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.postimg.cc/zGbjrHJr/Single-Room-Grand-Glacier-4.png',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.postimg.cc/Vsg4Bc73/Single-Room-Grand-Glacier-5.png',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://i.postimg.cc/FKh7xwCB/Apt-Snooty-Steppes-1.png',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://i.postimg.cc/9QbqsW9h/Apt-Snooty-Steppes-2.png',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://i.postimg.cc/7Zw2BCf9/Apt-Snooty-Steppes-5.png',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://i.postimg.cc/6QQzmbyM/Apt-Snooty-Steppes-3.png',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://i.postimg.cc/GmPh5zZT/Apt-Snooty-Steppes-4.png',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://i.postimg.cc/GmMhR9mb/Cabin-Zenith-Wall-1.png',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://i.postimg.cc/JzgVKXhH/Cabin-Zenith-Wall-2.png',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://i.postimg.cc/4Nfg3ZMy/Cabin-Zenith-Wall-3.png',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://i.postimg.cc/V68hHWPv/Cabin-Zenith-Wall-4.png',
        preview: false
      },
      {
        spotId: 10,
        url: 'https://i.postimg.cc/yN95Pr52/Cabin-Zenith-Wall-5.png',
        preview: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      url: { [Sequelize.Op.ne]: null }
    }, {});
  }
};
