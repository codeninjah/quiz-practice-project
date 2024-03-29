const Sequelize = require('sequelize')
const setupUser = require('./User')
const Quiz = require('./Quiz')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/dbfile.sqlite'
})

const User = setupUser(sequelize)

User.hasMany( Quiz, {foreignKey:'user_id'})
Quiz.belongsTo( User )

module.exports = { User, Quiz }