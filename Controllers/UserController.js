import User from '../Models/User.js';
import Controller from './Controller.js';


class UserController extends Controller {

  async index(req, res) {
    if (!this.validateRequest(req, res)) return;

    let user = this.checkRecordExists(User, 'id', req.params.id, res);

    return this.success(res, user, 'Users retrieved successfully');
  }


  // Create a new user
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      this.checkRecordExists(User, 'id', req.params.id, res);

      // Create new user
      const newUser = new User({ name, email, password }); // Remember to hash the password

      await newUser.save();

      return this.success(res, newUser, 'User created successfully', 201);
    } catch (err) {
      return this.error(res, err, 'Server error while creating user');
    }
  }


}

export default new UserController();
