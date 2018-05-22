const express = require('express');
const router = require('express-promise-router')();
const notifyControler = require('../controler/notify');


router.route('/new/:id/:skip')
      .get(notifyControler.newNf)

router.route('/all/:id/:skip')
      .get(notifyControler.allNf)
router.route('/seen/:id')
      .get(notifyControler.seen)
// exporting route
module.exports = router;