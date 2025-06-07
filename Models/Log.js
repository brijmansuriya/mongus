import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    level: {
        type: String,
        required: true,
        enum: ['error', 'warn', 'info', 'debug'],
        index: true
    },
    message: {
        type: String,
        required: true
    },
    meta: {
        type: mongoose.Schema.Types.Mixed
    },
    service: {
        type: String,
        default: 'api',
        index: true
    },
    trace: String,
    userAgent: String,
    requestId: String,
    ip: String,
    method: String,
    url: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }
}, {
    timestamps: true
});

// Create a TTL index to automatically delete old logs
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // 7 days

// Create a capped collection with a maximum size
const Log = mongoose.model('Log', logSchema, 'logs');

// Ensure the collection is capped
mongoose.connection.on('connected', async () => {
    const isCapped = await mongoose.connection.db.collection('logs').isCapped();
    if (!isCapped) {
        await mongoose.connection.db.createCollection('logs', {
            capped: true,
            size: 5242880, // 5MB
            max: 5000 // Maximum number of documents
        });
    }
});

export default Log;
