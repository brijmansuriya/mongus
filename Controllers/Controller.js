import { validationResult } from 'express-validator';

class Controller {
    constructor() { }
    success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    error(res, error, message = 'Error occurred', statusCode = 500) {
        console.log('base Controller');
        return res.status(statusCode).json({
            success: false,
            message,
            error: error?.message || error,
        });
    }

    validationError(res, errors, message = 'Validation failed', statusCode = 400) {
        console.log('Controller');
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }

    validateRequest(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            this.validationError(res, errors.array());
            return false;
        }
        return true;
    }

    //check alredy exist
    // Check if a record exists in a model by a field (e.g., email or id)
    async checkRecordExists(Model, field, value, res) {
        try {
            const record = await Model.findOne({ [field]: value });
            if (record) {
                return this.error(res, null, `${field} already exists`, 400);
            }
            return true; // No record found, safe to proceed
        } catch (err) {
            return this.error(res, err, 'Error while checking record existence');
        }
    }
}

export default Controller;
