const router = require('express-promise-router')()
const queryControler = require('../controler/query')

// validation helpers
const { validateBody,schemas } = require('../helpers/routeHelper')
// auth dependencys

router.route('/q')
	  .get(queryControler.getquery)

module.exports = router;