import express from 'express';

import * as controller from '../controllers/concepts.js';
import { authHeader } from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', authHeader, controller.getConcepts);
// router.get('/:conceptId', auth, getConcept);
// router.get('/search', getConceptsBySearch);
router.post('/', authHeader, controller.createConcept);
router.patch('/:conceptId', authHeader, controller.updateConcept);
router.delete('/:conceptId', authHeader, controller.deleteConcept);
router.post('/like/:conceptId', authHeader, controller.likeConcept);
router.post('/dislike/:conceptId', authHeader, controller.dislikeConcept);

export default router;