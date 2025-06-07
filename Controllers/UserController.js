import User from '../models/User.js';
import Controller from './Controller.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

class UserController extends Controller {
  // Generate JWT Token
  generateToken(id) {
    return jwt.sign({ id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        return this.error(res, null, 'Invalid email or password', 401);
      }

      const token = this.generateToken(user._id);

      return this.success(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }, 'Login successful');
    } catch (error) {
      return this.error(res, error, 'Login failed');
    }
  }

  async index(req, res) {
    try {
      if (!req.params.id) {
        return this.error(res, null, 'User ID is required', 400);
      }

      const user = await User.findById(req.params.id).select('-password');

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      return this.success(res, user, 'User retrieved successfully');
    } catch (error) {
      return this.error(res, error, 'Error retrieving user');
    }
  }
  create = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        //  error
        console.log('::::::::::::UserController');
        return this.error(res, null, 'Email already exists', 400);
      }

      const user = await User.create({
        name,
        email,
        password
      });

      const token = this.generateToken(user._id);

      return this.success(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }, 'User created successfully', 201);
    } catch (error) {
      return this.error(res, error, 'Error creating user');
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      await user.deleteOne();
      return this.success(res, null, 'User deleted successfully');
    } catch (error) {
      return this.error(res, error, 'Error deleting user');
    }
  }

  async all(req, res) {
    try {
      const users = await User.find().select('-password');
      return this.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      return this.error(res, error, 'Error retrieving users');
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return this.success(res, {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      }, 'Profile updated successfully');
    } catch (error) {
      return this.error(res, error, 'Error updating profile');
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      return this.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      return this.error(res, error, 'Error retrieving profile');
    }
  }

  async update(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return this.error(res, null, 'User not found', 404);
      }

      const { name, email, password } = req.body;

      // Check if email is being changed and if it's already taken
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

      return this.success(res, {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }, 'User updated successfully');
    } catch (error) {
      return this.error(res, error, 'Error updating user');
    }
  }
}

export default new UserController();
