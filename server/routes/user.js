import express from 'express';

import * as controller from '../controllers/user.js';

import { authHeader, authCookie } from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', controller.getUsernames);
router.get('/token', authCookie, controller.generateToken);
router.post('/clearsession', authCookie, controller.clearSession);
router.post('/login', controller.login);
router.post('/signup', controller.signUp);
router.get('/user/:userId', authHeader, controller.getUser);
router.get('/settings', authHeader, controller.getSettings);
router.post('/settings', authHeader, controller.updateSettings);
router.post('/username', authHeader, controller.updateUsername);
router.post('/password', authHeader, controller.resetPassword);

export default router;