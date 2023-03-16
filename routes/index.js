const express = require('express');

const queryFetch = require('./login')
const router = express.Router();

router.use('/queryFetch', queryFetch);

module.exports = router;
