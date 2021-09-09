import express from 'express';

import { login, signUp, getSettings, updateSettings, getUser, getUsername, updateUsername, resetPassword } from '../controllers/user.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/login', login);
router.post('/signup', signUp);
router.get('/user/:userId', auth, getUser);
router.get('/username/:userId', getUsername);
router.get('/settings', auth, getSettings);
router.post('/settings', auth, updateSettings);
router.post('/username', auth, updateUsername);
router.post('/password', auth, resetPassword);

export default router;