import { User } from '@models/User';
import mongoose from 'mongoose';
import { config } from '@config/env';

describe('User Model Test Suite', () => {
  beforeAll(async () => {
    await mongoose.connect(config.MONGODB_TEST_URI || config.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user successfully', async () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const savedUser = await User.create(validUser);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.name).toBe(validUser.name);
    // Password should be hashed
    expect(savedUser.password).not.toBe(validUser.password);
  });

  it('should fail to create a user with invalid email', async () => {
    const userWithInvalidEmail = {
      email: 'invalid-email',
      password: 'Password123!',
      name: 'Test User',
    };

    await expect(User.create(userWithInvalidEmail))
      .rejects
      .toThrow(mongoose.Error.ValidationError);
  });

  it('should fail to create a user with duplicate email', async () => {
    const user = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    await User.create(user);
    await expect(User.create(user))
      .rejects
      .toThrow(mongoose.mongo.MongoServerError);
  });
});
