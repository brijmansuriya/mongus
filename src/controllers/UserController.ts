import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Controller } from './Controller';
import { User } from '@models/User';
import { IUser, IUserRequest } from '@types/index';
import { config } from '@config/env';

interface TokenUser {
  _id: string;
  name: string;
  email: string;
  token: string;
}

class UserController extends Controller {
  private static instance: UserController;

  private constructor() {
    super();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  private generateToken(id: string): string {
    return jwt.sign({ id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  private formatUserResponse(user: IUser): TokenUser {
    const token = this.generateToken(user._id);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  public async login(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.matchPassword(password))) {
        return this.error(res, null, 'Invalid email or password', 401);
      }

      return this.success(res, this.formatUserResponse(user), 'Login successful');
    } catch (error) {
      return this.error(res, error as Error, 'Login failed');
    }
  }

  public async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;

      const user = await User.create({ name, email, password });

      return this.success(
        res,
        this.formatUserResponse(user),
        'User created successfully',
        201
      );
    } catch (error) {
      return this.error(res, error as Error, 'Error creating user');
    }
  }

  public async getProfile(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user?._id);
      return this.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error retrieving profile');
    }
  }

  public async updateProfile(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user?._id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      return this.success(res, this.formatUserResponse(updatedUser), 'Profile updated successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error updating profile');
    }
  }

  public async getAll(_req: IUserRequest, res: Response): Promise<Response> {
    try {
      const users = await User.find();
      return this.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error retrieving users');
    }
  }

  public async getById(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }
      return this.success(res, user, 'User retrieved successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error retrieving user');
    }
  }

  public async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      const { name, email, password } = req.body;

      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return this.error(res, null, 'Email already in use', 400);
        }
      }

      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password;
      }

      const updatedUser = await user.save();
      return this.success(res, this.formatUserResponse(updatedUser), 'User updated successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error updating user');
    }
  }

  public async delete(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      await user.deleteOne();
      return this.success(res, null, 'User deleted successfully');
    } catch (error) {
      return this.error(res, error as Error, 'Error deleting user');
    }
  }
}

export default UserController;
