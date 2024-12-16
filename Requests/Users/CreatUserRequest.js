import { param, body } from 'express-validator';

export default [
    body('name').exists().withMessage('Name is required'),
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
];
