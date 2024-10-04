'use strict';
const { hashPassword } = require("../helpers/bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let users = require("../data/users.json").map(el => {
      el.createdAt = el.updatedAt = new Date()
      el.password = hashPassword(el.password)
      return el
    })
    await queryInterface.bulkInsert("Users", users)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  }
};
