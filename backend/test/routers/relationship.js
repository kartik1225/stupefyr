const router = require('express-promise-router')()
const followControler = require('../controler/follow')

// validation helpers
const { validateBody,schemas } = require('../helpers/routeHelper')
// auth dependencys

router.route('/follow')
	  .post(followControler.storeFollow)

module.exports = router;