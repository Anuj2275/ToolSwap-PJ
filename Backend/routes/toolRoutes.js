import express from 'express';
import { listNewTool, getNearbyTools,getToolById } from '../controllers/toolController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../services/uploadService.js';

const router = express.Router();

// Here, we use two middleware functions. `protect` runs first, then `upload.single('image')`.
router.post('/', protect, upload.single('image'), listNewTool);
router.get('/nearby', getNearbyTools);

router.get('/:id', getToolById);
export default router;