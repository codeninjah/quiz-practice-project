const express = require('express')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.use( express.static('public') )
app.use( express.urlencoded( { extended: true } ) )

app.set('view engine', 'ejs')

app.listen(PORT || 5000, () => {
    console.log("App up and running")
})