const router = require('express-promise-router')();
const movieControler = require('../controler/movie')
const { validateBody,schemas } = require('../helpers/routeHelper')

router.route('/submit')
	  .post(validateBody(schemas.movie),movieControler.submitMovie);

router.route('/get/:id')
      .get(movieControler.getMovie)

router.route('/q')
	  .get(movieControler.query)

router.route('/newpost')
	  .post(movieControler.newPost)

router.route('/getposts/:id')
	  .get(movieControler.getPost)

router.route('/submitlike')
      .post(movieControler.like)

router.route('/submitdislike')
      .post(movieControler.dislike)

router.route('/newcomment')
      .post(movieControler.submitCmt)
      .put(movieControler.editCmt)

router.route('/commentreply')
      .post(movieControler.submitCmtReply)

router.route('/commentreplychild')
      .post(movieControler.submitCmtChaildReply)

router.route('/commentlike')
      .post(movieControler.cmtLike)

router.route('/sortcmt/:id')
            .get(movieControler.getSortedPost)

router.route('/morerep/:id')
            .get(movieControler.loadMoreReplys)

router.route('/deletecmt/:id')
	        .delete(movieControler.deleteCmt)

router.route('/getbestparts/:id')
	        .get(movieControler.getBestPartPost)

router.route('/getreviews/:id')
	        .get(movieControler.getReviewPost)

router.route('/newcast')
            .post(movieControler.addCasting)

router.route('/castlike')
			.post(movieControler.castLike)

router.route('/newrate')
			.post(movieControler.ratingSubmit)

router.route('/find?')
                  .get(movieControler.findMovie)
module.exports = router;