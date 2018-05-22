const express = require('express');
const router = require('express-promise-router')();
const pictureControler = require('../controler/pictures');

router.route('/upload')
      .post(pictureControler.upload)

router.route('/:filename')
      .get(pictureControler.root)

router.route('/low/:filename')
	  .get(pictureControler.low)

router.route('/normal/:filename')
      .get(pictureControler.normal)

// exporting route
module.exports = router;