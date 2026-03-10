import express from 'express';
import { getStatus, updatePaymentStatus, getAnalytics } from '../controllers/statusController.js';

const router = express.Router();

router.get('/analytics', getAnalytics); // New Analytics Route
router.get('/:phone', getStatus);
router.put('/:phone', updatePaymentStatus); // New Admin Update Route

export default router;
