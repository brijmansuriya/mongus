import { Router } from 'express';
import UserController from '@controllers/UserController';
import { protect } from '@middleware/auth';
import validateRequest from '@middleware/requestValidation';
import userValidation from '@validation/user.validation';

const router = Router();

const controller = UserController.getInstance();

// Public routes

router.post('/register', userValidation.create, validateRequest, controller.create.bind(controller));
router.post('/login', userValidation.login, validateRequest, controller.login.bind(controller));

// Protected routes
router.use(protect);
router.get('/me', controller.getProfile.bind(controller));
router.put('/me', userValidation.update, validateRequest, controller.updateProfile.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', userValidation.update, validateRequest, controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
