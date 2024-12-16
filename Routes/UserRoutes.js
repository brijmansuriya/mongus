import express from 'express';
import UserController from '../Controllers/UserController.js';
import CreatUserRequest from '../Requests/Users/CreatUserRequest.js';
import validate from '../Middlewares/RequestValidation.js';

const router = express.Router();
router.post('/create', CreatUserRequest, validate, (req, res) => UserController.create(req, res));
router.get('/:id?', (req, res) => UserController.index(req, res));

export default router;
