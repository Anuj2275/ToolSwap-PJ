import express from 'express';
import { listNewTool, getNearbyTools,getToolById,updateTool,deleteTool,getToolsByUserId } from '../controllers/toolController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../services/uploadService.js';

const router = express.Router();

// Here, we use two middleware functions. `protect` runs first, then `upload.single('image')`.
router.post('/', protect, upload.single('image'), listNewTool);
router.get('/nearby', getNearbyTools);
router.put('/:id', protect, upload.single('image'), updateTool);
router.delete('/:id', protect, deleteTool);
router.get('/:id', getToolById);
router.get('/user/:userId', getToolsByUserId); // New route to get tools by user ID


export default router;