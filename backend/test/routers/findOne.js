const router = require('express-promise-router')();
const oneControler = require('../controler/findOne');


router.route('/post/:id')
	  .get(oneControler.getpost);

router.route('/user/edit/:id')
      .put(oneControler.useredit);

router.route('/user/:id')
      .get(oneControler.oneuser);

router.route('/listpost')
      .get(oneControler.singleListPost);
module.exports = router