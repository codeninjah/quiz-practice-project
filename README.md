![](poster.png)
# RESTful Quiz Service
* Login and Registering System
* Users can create quizzes and upload an image to the quiz
* Users can add questions to their own quizzes
* Users can modify and delete their own quizzes
* Other users can take a quizzes from other users and answer the questions
* Users cannot take a quiz more than once
* Users can see the score they got after taking a quiz
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
Create a seeder that creates users, quizzes and questions to make it easier to test.

## Bonus
* Add multiple answer choices for each question, one answer should be correct
* Add so users can upload an image to questions
* Add a simple user interface using Vanilla JS or VueJS