'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let posts = require("../data/posts.json").map(el => {
      el.createdAt = el.updatedAt = new Date()

      return el
    })
    await queryInterface.bulkInsert("Posts", posts)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null);
  }
};
