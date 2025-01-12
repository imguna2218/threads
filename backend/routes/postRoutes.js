import express from 'express';
import { createPost, deletePost, getPost, likeUnlikePost, replyPost, getFeed, getUserPosts } from '../controllers/postController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeed);
router.get('/:id', getPost);
router.get('/user/:username', getUserPosts);
router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute, deletePost);
router.put('/like/:id', protectRoute, likeUnlikePost);
router.put('/reply/:id', protectRoute, replyPost);

export default router;