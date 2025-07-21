const express = require('express');
const router  = express.Router();

const {register_user , login_user ,logout_user, profile, getPreferences, updatePreferences} = require('../controllers/userController');
const authenticatetoken = require('../services/auth');

router.post('/register', register_user);

router.post('/login' , login_user);

router.post('/logout' , logout_user);

router.get('/profile' , authenticatetoken , profile);

router.get('/preferences', authenticatetoken , getPreferences);

router.put('/preferences' , authenticatetoken , updatePreferences);

module.exports = router;