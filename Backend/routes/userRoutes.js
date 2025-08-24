import express from 'express';
import { getOnlineUsers } from '../controllers/userController.js';
const router = express.Router();

router.get('/online', getOnlineUsers);

export default router;