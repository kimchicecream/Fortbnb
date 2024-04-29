'use strict';

const { User } = require('../models');
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
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Ethan',
        lastName: 'Morrow',
        email: 'ethan@fortbnb.io',
        username: 'ShadowMaster',
        hashedPassword: bcrypt.hashSync('darkMatter01')
      },
      {
        firstName: 'Lucas',
        lastName: 'Grant',
        email: 'lucas@fortbnb.io',
        username: 'DefaultHero',
        hashedPassword: bcrypt.hashSync('buildEdit789')
      },
      {
        firstName: 'Zeus',
        lastName: 'Allfather',
        email: 'zeus@fortbnb.io',
        username: 'CommandoRam',
        hashedPassword: bcrypt.hashSync('zeusTheMoose55')
      },
      {
        firstName: 'Emma',
        lastName: 'Clarke',
        email: 'emma@fortbnb.io',
        username: 'NinjaZoe',
        hashedPassword: bcrypt.hashSync('silentFoot92')
      },
      {
        firstName: 'Noah',
        lastName: 'Sullivan',
        email: 'noah@fortbnb.io',
        username: 'SunnyRays',
        hashedPassword: bcrypt.hashSync('brightSky44')
      },
      {
        firstName: 'Liam',
        lastName: 'Bishop',
        email: 'liam@fortbnb.io',
        username: 'ConstructorK',
        hashedPassword: bcrypt.hashSync('hammerTime88')
      },
      {
        firstName: 'Ava',
        lastName: 'Parker',
        email: 'ava@fortbnb.io',
        username: 'BuilderBabe',
        hashedPassword: bcrypt.hashSync('wiseBuilds22')
      },
      {
        firstName: 'Olivia',
        lastName: 'Walters',
        email: 'olivia@fortbnb.io',
        username: 'ReaperMan',
        hashedPassword: bcrypt.hashSync('wickMode111')
      },
      {
        firstName: 'Mason',
        lastName: 'Phelps',
        email: 'mason@fortbnb.io',
        username: 'GhostRunner',
        hashedPassword: bcrypt.hashSync('hauntSwift30')
      },
      {
        firstName: 'Alex',
        lastName: 'Go',
        email: 'alexgo@fortbnb.io',
        username: 'Throngler',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Sequelize.Op.en]: null }
    }, {});
  }
};
