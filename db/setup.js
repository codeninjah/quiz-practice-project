const { Quiz, User } = require('../models')

async function setup(){
    await User.sync({force: true})
    await Quiz.sync({force: true})
}

setup()