const express = require('express');
const router = express.Router();
// **********Member***************
const sub = require('../controller/link');

router.get('/submit', sub.submit);
router.post('/generateNewLink', sub.generateNewLink);
router.post('/timeConfirm', sub.timeConfirm);
router.post('/deleteAll', sub.deleteAll);

module.exports = router;