import { validationResult } from 'express-validator';

export default (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorResponse = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorResponse,
        });
    }

    next();
};

