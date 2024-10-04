'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let profiles = require("../data/profiles.json").map(el => {
      el.createdAt = el.updatedAt = new Date()

      return el
    })
    await queryInterface.bulkInsert("Profiles", profiles)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Profiles", null);
  }
};
