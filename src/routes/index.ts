import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// API v1 routes
router.use('/v1/users', userRoutes);

export default router;
