const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config()
const {User, Quiz} = require('./models')
const session = require('cookie-session')
const { Op } = require('sequelize')

const fs = require('fs');
const path = require("path");
const multer = require("multer");

const app = express()
const PORT = process.env.PORT

app.use( express.static('public') )
app.use( express.urlencoded( { extended: true } ) )
app.use(bodyParser.json());
app.use( session({
    name: 'session',
    keys: [process.env.SESSION_SECRET]
  }))


app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs')


// Serve static files from the 'photos' directory
// Without the following, the /gallery endpoint won't work
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let score = 0;

// Default enpoint
app.get('/', (req,res) => {
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    res.render('index', {errorMessage})
  })
  

// The register view
app.get('/register', (req,res) => {
   res.render('register')
})
  
// The dashboard view
app.get('/dashboard', (req,res) => {
   if(req.session.user){
       res.render('dashboard', {user: req.session.user})
   }
   else{
       res.redirect('/')
   }
})
  
// The register endpoint
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
  

// The login endpoint
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
  

// The logout endpoint 
app.post('/logout', (req,res) => {
   req.session = null
   res.redirect('/')
})


// The quizes endpoint
app.get('/quizes', async(req, res) => {
    if(req.session.user){
      const user = await User.findOne({where: {username: req.session.user.username}})
      const quizes = await Quiz.findAll({ where: {user_id: {[Op.ne] : user.user_id}}})
      //res.render('quizes', {quizes})
      const myQuizes = await Quiz.findAll({where: {user_id: user.user_id}})
      res.render('quizes', {quizes: quizes, myQuizes: myQuizes})
  }
  else{
      res.redirect('/')
   }
})


  // Need to work with this 
  // As of now implementing not being able to take the same quiz twice does not work
app.get('/quiz/:id', async(req, res, next) => {
  try{
   if(req.session.user){
     const quiz = await Quiz.findOne({where: {id: req.params.id}})
     //let score = 0
     //const userQuiz = req.session.user.quiz_id
     const user = await User.findOne({where: {username: req.session.user.username}})

     const userQuiz = await user.quiz_id
     console.log(userQuiz)
     
    if(userQuiz.includes(quiz.id) || userQuiz){
       res.render('quiz', {quiz})
    }
      
    else{
      res.send("Quiz already taken. You cannot take the same quiz twice")
      console.log("Quiz already taken")
      console.log("Req session " + req.session)
      console.log("Max age is: " + req.session.cookie)
    }
   }
  else{
     res.redirect('/')
   }
 }
 catch(err) {
  next(err)
 }
})

  // I don't think this is working
  // Commenting it for now
  /*
  app.post('/quiz/:id', async(req, res) => {
    if(req.session.user){
      const { userScore } = req.body
      const quizId = req.params.id
      const user = await User.findOne({where: {username: req.session.user.username}})
      user.quiz_id += quizId
      await user.save()

      console.log("Score is: " + userScore  + " And quiz was added: " + quizId)
      //res.send("Your score was: " + userScore + " And quiz was added: " + quizId)
    }
    else {
      res.redirect("/")
    }
  })
  */

// Using the quizes endpoint to create quizes
app.post('/quizes', async(req, res) => {
   if(req.session.user){
      const {quizName, qOne, aOne, qTwo, aTwo, qThree, aThree, qFour, aFour, qFive, aFive} = req.body
      const quiz = await Quiz.findOne({where: {name: quizName}})
      const user = await User.findOne({where: {username: req.session.user.username}})
      if(!quiz){
         const newQuiz = await Quiz.create({name: quizName})
          newQuiz.set({
             quOne: qOne,
             anOne: aOne,
             quTwo: qTwo,
             anTwo: aTwo,
             quThree: qThree,
             anThree: aThree,
             quFour: qFour,
             anFour: aFour,
             quFive: qFive,
             anFive: aFive,
             user_id: user.user_id
         })
           await newQuiz.save()
       }
       else{
          const quizes = await Quiz.findAll()
          res.send("A quiz with that name already exists")
      }
      const quizes = await Quiz.findAll({ where: {user_id: {[Op.ne] : user.user_id}}})
      const myQuizes = await Quiz.findAll({where: {user_id: user.user_id}})
      //let score = 0
      //res.render('quizes', {quizes: quizes, myQuizes: myQuizes})
      res.render('quizes', {quizes: quizes, myQuizes: myQuizes})
    }
    else{
       res.redirect('/')
    }
 })

// Experimenting with posting the quiz score
app.post('/update-score', async(req, res) => {
  const user = await User.findOne({where: {username: req.session.user.username}})
  const score = req.body.score

  console.log(`Score: ${score}`)

  // Handle the data
  //res.send(`Score: ${score}`);
  res.json({ score: score });
  user.user_score = score;
  //res.redirect('/dashboard'); // Need to redirect to the right quiz
})


//////////////////////////////////////
//////////////////////////////////////
// Here comes the code for multer
// This will allow to use the following functions to upload pictures
// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Uploads is the Upload_folder_name
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		// cb(null, file.fieldname + "-" + Date.now() + ".jpg"); //the original code
        cb(null, file.originalname)
	},
});


// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 15 * 1000 * 1000; // The firsy number is the size in MB

var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb) {
		// Set the filetypes, it is optional
		var filetypes = /jpeg|jpg|png/;
		var mimetype = filetypes.test(file.mimetype);

		var extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);

		if (mimetype && extname) {
			return cb(null, true);
		}

		cb(
			"Error: File upload only supports the " +
				"following filetypes - " +
				filetypes
		);
	},

	// mypic is the name of file attribute
}).single("mypic");



app.get("/uploadStuff", (req, res, next) => {
  res.render("uploadStuff");
});


app.post("/uploadPicture", function (req, res, next) {
   // Error MiddleWare for multer file upload, so if any
   // error occurs, the image would not be uploaded!
    upload(req, res, function (err) {
           if (err) {
               // ERROR occurred (here it can be occurred due
               // to uploading image of size greater than
               // 1MB or uploading different file type)
               console.log(err);
               res.send(err);
               //return res.status(500).json({ error: err.message });
            } else {
               // SUCCESS, image successfully uploaded
               res.send("Success, Image uploaded!");
              }
        });
  });



// Route handler to render the pictures uploaded
app.get('/gallery', (req, res) => {
  // Read the contents of the directory
  fs.readdir("./uploads", (err, files) => {
      if (err) {
          console.error('Error reading directory:', err);
          return res.status(500).send('Internal Server Error');
      }
      // Render the EJS template and pass the list of files
      res.render('gallery', { files });
  });
});


  
User.sync().then( () => {
  PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
})