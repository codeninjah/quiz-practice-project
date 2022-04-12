const express = require('express')
require('dotenv').config()
const {User, Quiz} = require('./models')
const session = require('cookie-session')

const app = express()
const PORT = process.env.PORT

app.use( express.static('public') )
app.use( express.urlencoded( { extended: true } ) )
app.use( session({
    name: 'session',
    keys: [process.env.SESSION_SECRET]
  }))

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    res.render('index', {errorMessage})
  })
  
  app.get('/register', (req,res) => {
    res.render('register')
  })
  
  app.get('/dashboard', (req,res) => {
    if(req.session.user){
        res.render('dashboard', {user: req.session.user})
    }
    else{
        res.redirect('/')
    }
  })
  
  app.post('/register', async (req,res) => {
    const {username, password} = req.body  
    const user = await User.create({
      username, 
      password_hash: password
    })
    
    req.session.user = {
      username: user.username,
      id: user.id
    }
  
    res.redirect('/dashboard')
  })
  
  
  
  
  
  
  
  app.post('/login', async (req,res) => {
    try{
      const {username, password} = req.body
      const user = await User.authenticate(username, password)
      req.session.user = {
        username: user.username,
        id: user.id
      }
      res.redirect('/dashboard')
    }catch(error){
      req.session.errorMessage = error.message
      res.redirect('/')
    }
  })
  
  // app.get('/error', (req,res) => {
  //   const errorMessage = req.session.errorMessage
  //   req.session.errorMessage = null
  //   res.render('error', {errorMessage})
  // })
  
  
  app.post('/logout', (req,res) => {
    req.session = null
    res.redirect('/')
  })

  app.get('/quizes', async(req, res) => {
      if(req.session.user){
        const quizes = await Quiz.findAll()
        res.render('quizes', {quizes})
    }
    else{
        res.redirect('/')
    }
  })
  
  User.sync().then( () => {
    PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })