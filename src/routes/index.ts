import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();
console.log('User routes initialized');
// API v1 routes
router.use('/v1/users', userRoutes);

export default router;
