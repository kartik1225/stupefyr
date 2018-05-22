const router = require('express-promise-router')();
const profileControler = require('../controler/profile');


router.route('/displayName')
	  .put(profileControler.displayName);

module.exports = router