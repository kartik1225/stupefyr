const router = require('express-promise-router')();
const quizControler = require('../controler/quiz')

router.route('/submit')
      .post(quizControler.submit)

router.route('/get/:id')
      .get(quizControler.getQuiz)

router.route('/getwithans/:id')
      .get(quizControler.getQuizAns)
router.route('/usersubmit')
      .post(quizControler.userSubmit)

router.route('/getall/:id')
      .get(quizControler.getAllQuiz)

router.route('/getresult/:id')
	  .get(quizControler.serveResult)

router.route('/q')
	  .get(quizControler.query)
module.exports = router;


