import express from 'express';

import * as controller from '../controllers/collections.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', auth, controller.getCollections);
router.patch('/add/:collectionId', auth, controller.addToCollection);
router.patch('/remove/:collectionId', auth, controller.removeFromCollection);
router.post('/', auth, controller.createCollection);
router.delete('/:collectionId', auth, controller.deleteCollection);

export default router;