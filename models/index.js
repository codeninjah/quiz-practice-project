const Sequelize = require('sequelize')
const setupUser = require('./User')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/dbfile.sqlite'
})

const User = setupUser(sequelize)

module.exports = { User }