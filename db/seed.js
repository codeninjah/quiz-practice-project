const { Sequelize } = require('sequelize')
const { Quiz, User } = require('../models/index.js')
require("dotenv").config()
const bcrypt = require('bcryptjs')

const hashUserOne = bcrypt.hashSync(process.env.USER_ONE_PASSWORD, 10)
const hashUserTwo = bcrypt.hashSync(process.env.USER_TWO_PASSWORD, 10)

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/dbfile.sqlite'
})

User.sync()
.then(() => {
    return User.bulkCreate([
        {
            username: 'Alex',
            password_hash: hashUserOne,
            user_score: 0,
        },
        {
            username: 'Steph',
            password_hash: hashUserTwo,
            user_score: 0,
        },
    ])
}, {sequelize})

Quiz.sync()
.then(() => {
    return Quiz.bulkCreate([
        {
            name: "Alex Test Quiz",
            imageLink: 'https://github.com/codeninjah/quiz-practice-project/raw/main/poster.png',
            quOne: 'What is my name?',
            anOne: 'Alex',
            quTwo: 'Bästa gaming märket?',
            anTwo: 'PlayStation',
            quThree: 'Bästa filmerna EVER? (Tips: de är en trilogi)',
            anThree: 'LOTR',
            quFour: 'DC Universes most OP karaktär?',
            anFour: 'Doctor Manhattan',
            quFive: 'Gow är ett Playstation exklusivt franchise. Vad står förkortningen GoW för?',
            anFive: 'God of War',
            user_id: 1,
        },
        {
            name: 'Stephanie Test Quiz',
            imageLink: 'https://github.com/codeninjah/quiz-practice-project/raw/main/poster.png',
            quOne: 'What is my name?',
            anOne: 'Steph',
            quTwo: 'Favorit färg?',
            anTwo: 'Grön',
            quThree: 'Är jag man eller kvinna?',
            anThree: 'Kvinna',
            quFour: 'DC eller Marvel?',
            anFour: 'Ingen',
            quFive: 'Jag kommer ursprungligen ifrån?',
            anFive: 'Amerika',
            user_id: 2,
        },
    ])
}, {sequelize})

