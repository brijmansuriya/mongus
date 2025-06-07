# Mongus API

## Environment Configuration

This project uses a centralized configuration system that loads and validates environment variables at startup. The configuration is managed through the `config/env.js` file.

### Setup

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Update the values in `.env` with your configuration

### Required Environment Variables

- `JWT_SECRET`: Your JWT signing key (required)
- `MONGODB_URI`: MongoDB connection string

### Optional Environment Variables

#### Server Configuration
- `NODE_ENV`: development, production, or test (default: development)
- `PORT`: Server port (default: 3000)
- `APP_NAME`: Application name (default: Mongus API)
- `API_VERSION`: API version (default: v1)

#### Security Configuration
- `CORS_ORIGIN`: CORS allowed origins (default: *)
- `RATE_LIMIT_WINDOW`: Rate limit window in minutes (default: 15)
- `RATE_LIMIT_MAX`: Max requests per window (default: 100)

#### Logging Configuration
- `LOG_LEVEL`: error, warn, info, or debug (default: info)
- `LOG_FILE`: Log file path (default: logs/app.log)

#### Cache Configuration
- `CACHE_TTL`: Cache time-to-live in seconds (default: 60)

#### Email Configuration (Optional)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

### Validation

The configuration system validates all environment variables at startup:
- Required variables must be present
- Values are type-checked and validated
- Sensitive information is redacted from logs

### Usage in Code

Import and use the config object:

```javascript
import config from '../config/env.js';

// Use configuration values
const port = config.PORT;
const jwtSecret = config.JWT_SECRET;
```

All configuration values are frozen (immutable) to prevent accidental modifications during runtime.
