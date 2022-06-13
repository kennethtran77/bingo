import express from 'express';

import * as controller from '../controllers/comments.js';
import { authHeader } from '../middleware/auth.js';

// set mergeParams to true to be able to access params from parent route
const router = express.Router({ mergeParams: true });

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', controller.getComments);
router.post('/', authHeader, controller.createComment);
router.patch('/:commentId', authHeader, controller.updateComment);
router.delete('/:commentId', authHeader, controller.deleteComment);
router.post('/like/:commentId', authHeader, controller.likeComment);
router.post('/dislike/:commentId', authHeader, controller.dislikeComment);

export default router;