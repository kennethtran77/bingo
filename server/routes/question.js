import express from 'express';

import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getQuestion, verifyQuestion } from '../controllers/questions.js';

import auth from '../middleware/auth.js';

// set mergeParams to true to be able to access params from parent route
const router = express.Router({ mergeParams: true });

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', auth, getQuestions);
router.get('/:questionId', auth, getQuestion);
router.get('/verify/:questionId', verifyQuestion);
router.post('/', auth, createQuestion);
router.patch('/:questionId', auth, updateQuestion);
router.delete('/:questionId', auth, deleteQuestion);

export default router;