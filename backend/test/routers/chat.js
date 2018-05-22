const router = require('express-promise-router')()
const chatControler = require('../controler/chat')

// validation helpers
const { validateBody,schemas } = require('../helpers/routeHelper')

router.route('/all/:id')
      .get(chatControler.all)

router.route('/send')
      .post(chatControler.sendmsg)

router.route('/get/:id')
      .get(chatControler.getmsg)

module.exports = router;