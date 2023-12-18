import { default as bcryptjs, default as bycrptjs } from 'bcryptjs';
import { Request } from 'express';
import { Role } from '../helpers/roles';
import { JsonDb } from '../utils/jsonDB';
import User from '../types/User';

export default class AuthService {
  private userDb: JsonDb<User>;

  constructor() {
    this.userDb = new JsonDb<User>('users.json');
  }

  public async register(req: Request): Promise<User> {
    try {
      const username = req.body.username
        .trim()
        .toLowerCase()
        .replace(/\s/g, '');

      const existingUser = await this.userDb.findOne({ username });
      if (existingUser) {
        throw new Error('Username already taken');
      }
      const password = await this.hashPassword(req.body.password);
      const newUser: any = {
        password,
        username,
        role: req.body.role ? req.body.role : Role.USER,
      };
      const user = await this.userDb.create(newUser);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error('Error registering user');
    }
  }

  public async login(req: Request): Promise<User | null> {
    try {
      const username = req.body.username
        .trim()
        .toLowerCase()
        .replace(/\s/g, '');
      const user = await this.userDb.findOne({ username });
      if (!user) {
        throw new Error('Wrong credentials');
      }
      const isMatch = await this.matchPasswords(
        req.body.password,
        user.password
      );
      return isMatch ? user : null;
    } catch (error) {
      console.log(error);
      throw new Error('Wrong credentials');
    }
  }

  private async matchPasswords(
    enteredPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const isMatch = await bycrptjs.compare(enteredPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.log(error);
      throw new Error('Wrong credentials');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  }
}
