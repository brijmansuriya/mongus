import { Router } from 'express';
import UserController from '@controllers/UserController';
import { protect } from '@middleware/auth';
import validateRequest from '@middleware/requestValidation';
import userValidation from '@validation/user.validation';

const router = Router();

// Public routes
router.post('/register', userValidation.create, validateRequest, UserController.create);
router.post('/login', userValidation.login, validateRequest, UserController.login);

// Protected routes
router.use(protect);
router.get('/me', UserController.getProfile);
router.put('/me', userValidation.update, validateRequest, UserController.updateProfile);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', userValidation.update, validateRequest, UserController.update);
router.delete('/:id', UserController.delete);

export default router;
