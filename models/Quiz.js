const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/dbfile.sqlite'
})

class Quiz extends Model{}

Quiz.init(
    {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageLink: DataTypes.TEXT
    }
)

module.exports = Quiz