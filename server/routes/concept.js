import express from 'express';

import * as controller from '../controllers/concepts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', auth, controller.getConcepts);
// router.get('/:conceptId', auth, getConcept);
// router.get('/search', getConceptsBySearch);
router.post('/', auth, controller.createConcept);
router.patch('/:conceptId', auth, controller.updateConcept);
router.delete('/:conceptId', auth, controller.deleteConcept);

export default router;