import express from 'express';

import * as controller from '../controllers/practice.js';

import { authHeader } from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/sessions', authHeader, controller.getSessions);
router.get('/checkChanged', controller.fetchPracticeQuestionChanged);
router.get('/generateConcept/:conceptId', controller.generateConceptQuestions);
router.get('/generateCollection/:collectionId', controller.generateCollectionQuestions);
router.post('/process', authHeader, controller.processSession);

export default router;