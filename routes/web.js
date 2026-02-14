const express = require('express');
const router = express.Router(); 
const HomeController = require('../app/Controllers/HomeController');
const AuthController = require('../app/Controllers/AuthController');
const DashboardController = require('../app/Controllers/DashboardController');

const auth = require('../app/Middleware/AuthMiddleware');
const guest = require('../app/Middleware/GuestMiddleware');

router.get('/', HomeController.home);

router.get('/dashboard', auth, DashboardController.dashboard);
router.post('/logout', auth, AuthController.logout);

// auth
router.get('/login', guest, AuthController.loginPage);
router.get('/register', guest, AuthController.registerPage);
router.post('/login', guest, AuthController.login);
router.post('/register', guest, AuthController.register);




module.exports = router;