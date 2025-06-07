import { body } from 'express-validator';
import User from '../../models/User.js';

export default [
    body('name').exists().withMessage('Name is required'),
    body('email')
        .exists().withMessage('Email is required')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password').exists().withMessage('Password is required'),
];
