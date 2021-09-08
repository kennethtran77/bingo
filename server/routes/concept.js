import express from 'express';

import { getConcepts, createConcept, updateConcept, deleteConcept } from '../controllers/concepts.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', auth, getConcepts);
// router.get('/:conceptId', auth, getConcept);
// router.get('/search', getConceptsBySearch);
router.post('/', auth, createConcept);
router.patch('/:conceptId', auth, updateConcept);
router.delete('/:conceptId', auth, deleteConcept);

export default router;