import express from 'express';
import { register, login, getAllUsers, deleteUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.delete('/users/:phone', deleteUser); // New Admin Delete Route

export default router;
