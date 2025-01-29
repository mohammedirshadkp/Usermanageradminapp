import express from 'express';
import { getUserDetails, login, register,getAllUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register-user', register);
router.post('/login', login);
router.get('/get-userDetails', getUserDetails);
router.get('/get-all-users', getAllUsers);

export default router;
