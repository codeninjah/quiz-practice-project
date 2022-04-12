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
        imageLink: DataTypes.TEXT,
        quOne: DataTypes.TEXT,
        anOne: DataTypes.TEXT,
        quTwo: DataTypes.TEXT,
        anTwo: DataTypes.TEXT,
        quThree: DataTypes.TEXT,
        anThree: DataTypes.TEXT,
        quFour: DataTypes.TEXT,
        anFour: DataTypes.TEXT,
        quFive: DataTypes.TEXT,
        anFive: DataTypes.TEXT,
    }, { sequelize}
)

module.exports = Quiz