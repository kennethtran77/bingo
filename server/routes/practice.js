import express from 'express';

import { getSessions, generateQuestions, processSession } from '../controllers/practice.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/sessions', auth, getSessions);
router.get('/generate/:conceptId', generateQuestions);
router.post('/process', auth, processSession)

export default router;