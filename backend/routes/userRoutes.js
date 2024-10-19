import express from "express";
import { followUnfollowUser, getSuggested, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from '../controllers/userController.js';
import protectRoute from "../middleware/protectRoute.js";
import getSuggestedUsers from "../Suggested.js";

const router = express.Router();

router.get('/suggest', protectRoute, getSuggested);
router.get('/Suggested', protectRoute, getSuggestedUsers);
router.get('/profile/:query', getUserProfile);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.put('/update/:id', protectRoute, updateUser);

export default router;