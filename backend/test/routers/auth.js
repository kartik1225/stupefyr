const router = require('express-promise-router')()
const authControler = require('../controler/authControler')

// validation helpers
const { validateBody,schemas } = require('../helpers/routeHelper')
// auth dependencys

router.route('/')
      .post(validateBody(schemas.signup),authControler.root)

router.route('/login')
	  .post(validateBody(schemas.login),authControler.login)

module.exports = router;