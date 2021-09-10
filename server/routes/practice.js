import express from 'express';

import * as controller from '../controllers/practice.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/sessions', auth, controller.getSessions);
router.get('/generateConcept/:conceptId', controller.generateConceptQuestions);
router.get('/generateCollection/:conceptId', controller.generateCollectionQuestions);
router.post('/process', auth, controller.processSession);

export default router;