![](poster.png)
# RESTful Quiz Service
* ~~Login and Registering System~~
* *Users can create quizzes and upload an image to the quiz*
* Users can add questions to their own quizzes
* Users can modify and delete their own quizzes
* ~~Other users can take a quizzes from other users and answer the questions~~
* ~~Users cannot take a quiz more than once~~
* ~~Users can see the score they got after taking a quiz~~
* The web services is RESTful

## Admins
* Admins can delete and edit any user, quiz and questions
* Admins needs to be added manually to the database

## Uploading Files
Use one of the following packages to handle file uploads from the client
* [Multer](https://www.npmjs.com/package/multer)
* [Formidable](https://www.npmjs.com/package/formidable)
* [express-fileupload](https://www.npmjs.com/package/express-fileupload)

## Tips
~~Create a seeder that creates users, quizzes and questions to make it easier to test.~~

## Bonus
* Add multiple answer choices for each question, one answer should be correct
* *Add so users can upload an image to questions*
* ~~Add a simple user interface using Vanilla JS or VueJS# quiz-practice-project~~
# quiz-practice-project
# quiz-practice-project


## Instructions on how to set up and get this project running
1. Run the command `npm install`
2. Create a .env file with the following variables:
USER_ONE_PASSWORD
USER_TWO_PASSWORD
PORT
SESSION_SECRET
And assign values to them
3. Open the terminal window and run `node db/setup.js` and `node db/seed.js`
4. You should now be able to run the project with `node app.js`



## TODO
1. I need to complete adding the user score to the database.
2. Also I should reimplement the restriction to complete the same quiz more than once.
3. The fileupload function is in a very early stage, that will also need work
4. A better UI
5. Suggestions?
