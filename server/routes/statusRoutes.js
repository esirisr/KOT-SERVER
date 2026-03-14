import express from 'express';
import { getStatus, updatePaymentStatus, getAnalytics, checkStoreUnique } from '../controllers/statusController.js';

const router = express.Router();

router.get('/analytics', getAnalytics);
router.get('/check-store', checkStoreUnique); // New endpoint for store validation
router.get('/:phone', getStatus);
router.put('/:phone', updatePaymentStatus);

export default router;
