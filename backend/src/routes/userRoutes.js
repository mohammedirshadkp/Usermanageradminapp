// routes/userRoutes.js
import express from 'express';
import {createUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/create-user', createUser); // Endpoint to create a new user

export default router;
