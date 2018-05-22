const express = require('express');
const router = require('express-promise-router')();
const debateControler = require('../controler/debate');



router.route('/polevote')
	  .post(debateControler.poleVote)

router.route('/get/:id')
	 .get(debateControler.get)

router.route('/newcomment')
      .post(debateControler.postComment)
      .put(debateControler.putComment)

router.route('/deletecmt/:id')
	  .delete(debateControler.deleteComment)

router.route('/getcomment/:id/:skip')
	  .get(debateControler.getComment)

router.route('/singlecomment/:id')
      .get(debateControler.singleComment)

router.route('/cmtlike')
      .post(debateControler.postLike)

router.route('/cmtdislike')
      .post(debateControler.postDislike)

router.route('/newcomment_reply')
	  .post(debateControler.postCommentReply)

router.route('/morereplys/:id')
      .get(debateControler.moreReplys)

router.route('/sort/:id')
	  .get(debateControler.sortedComment)

module.exports = router;