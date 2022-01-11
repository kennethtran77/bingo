import express from 'express';

import * as controller from '../controllers/user.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', controller.getUsernames);
router.post('/login', controller.login);
router.post('/signup', controller.signUp);
router.get('/user/:userId', auth, controller.getUser);
router.get('/settings', auth, controller.getSettings);
router.post('/settings', auth, controller.updateSettings);
router.post('/username', auth, controller.updateUsername);
router.post('/password', auth, controller.resetPassword);

export default router;