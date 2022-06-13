import express from 'express';

import * as controller from '../controllers/collections.js';
import { authHeader } from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', authHeader, controller.getCollections);
router.patch('/add/:collectionId', authHeader, controller.addToCollection);
router.patch('/remove/:collectionId', authHeader, controller.removeFromCollection);
router.patch('/:collectionId', authHeader, controller.updateCollection)
router.post('/', authHeader, controller.createCollection);
router.delete('/:collectionId', authHeader, controller.deleteCollection);

export default router;