const express = require('express');
const router = require('express-promise-router')();
const userControler = require('../controler/user');


const { validateParams,schemas } = require('../helpers/routeHelper')
// userd just for testing *
router.route('/')
	  .get(userControler.index)
	  .post(userControler.user)

// feeding data to time line
router.route('/feed/:id/:start')
      .get(userControler.feed)

router.route('/pictures/:id')
      .get(userControler.userpictures)

// user every route validation
router.route('/isvalid')
	  .get(userControler.isvalid)

// for testing i guess
router.route('/more')
	  .get(userControler.more)


router.route('/get/:userid')
	  .get( validateParams(schemas.idSchema,'userid') ,userControler.getuser)

router.route('/update')
      .put(userControler.edituser)

router.route('/post/:id/:start')
	  .get(userControler.postget)
router.route('/post/:id')
	  .post(userControler.postcreate)
	  .put(userControler.postedit)
	  .delete(userControler.postdelete)


router.route('/comment/:id')
	  .post(userControler.commentcreate)
	  .get(userControler.commentget)
	  .put(userControler.commetedit)
	  .delete(userControler.commentdelete)

router.route('/like/:id')
	  .post(userControler.postlike)

router.route('/comment/like/:id')
      .post(userControler.postcommentlike)

// new commnet formats

router.route('/newcomment')
	  .post(userControler.submitCmt)
      .put(userControler.editCmt)

router.route('/commentreply')
      .post(userControler.submitCmtReply)

router.route('/commentreplychild')
      .post(userControler.submitCmtChaildReply)

router.route('/commentlike')
      .post(userControler.cmtLike)

router.route('/sortcmt/:id')
      .get(userControler.getSortedPost)

router.route('/morerep/:id')
      .get(userControler.loadMoreReplys)

router.route('/deletecmt/:id')
	  .delete(userControler.deleteCmt)


module.exports = router;