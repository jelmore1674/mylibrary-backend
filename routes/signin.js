const router = require('express').Router();
// Controllers
const signinController = require('../controllers/signin');

router.post('/', signinController.handleSignin);

module.exports = router;