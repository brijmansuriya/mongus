import 'dotenv/config';

export class env {
  static readonly port = process.env.PORT ? Number(process.env.PORT) : 3000;
  static readonly appName = process.env.APP_NAME || 'MongusTS';
  static readonly mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mongusdb';
}
