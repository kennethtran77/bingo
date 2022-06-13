import express from 'express';

import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getQuestion, verifyQuestion } from '../controllers/questions.js';

import { authHeader } from '../middleware/auth.js';

// set mergeParams to true to be able to access params from parent route
const router = express.Router({ mergeParams: true });

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', authHeader, getQuestions);
router.get('/:questionId', authHeader, getQuestion);
router.get('/verify/:questionId', verifyQuestion);
router.post('/', authHeader, createQuestion);
router.patch('/:questionId', authHeader, updateQuestion);
router.delete('/:questionId', authHeader, deleteQuestion);

export default router;