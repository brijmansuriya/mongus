import express from 'express';
import UserController from '../controllers/userController.js';
import CreatUserRequest from '../requests/users/CreatUserRequest.js';
import validate from '../middlewares/RequestValidation.js';
import { protect as authMiddleware } from '../middlewares/authMiddleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Public routes
router.post('/register', CreatUserRequest, validate, UserController.create);
router.post('/login', UserController.login);

// Protected routes
router.use(authMiddleware); // All routes below this will require authentication

router.get('/me', UserController.getProfile);
router.get('/all', UserController.all);
router.get('/:id', UserController.index);
router.put('/:id', CreatUserRequest, validate, UserController.update);
router.delete('/:id', UserController.delete);

export default router;
