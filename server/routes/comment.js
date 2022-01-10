import express from 'express';

import * as controller from '../controllers/comments.js';
import auth from '../middleware/auth.js';

// set mergeParams to true to be able to access params from parent route
const router = express.Router({ mergeParams: true });

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', controller.getComments);
router.post('/', auth, controller.createComment);
router.patch('/:commentId', auth, controller.updateComment);
router.delete('/:commentId', auth, controller.deleteComment);

export default router;