const router = require('express').Router();
const registerController = require('../controllers/register');

router.get('/', registerController.handleRegister);