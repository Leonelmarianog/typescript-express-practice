import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import UserModel from '../users/user.model';
import LoginDto from './login.dto';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import User from '../users/user.interface';

class AuthenticationController implements Controller {
  public path = '/auth';

  public router = express.Router();

  private UserModel = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  };

  private register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body;
    const userExists = await this.UserModel.findOne({ email: userData.email });

    if (userExists) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.UserModel.create({
        ...userData,
        password: hashedPassword,
      });

      user.password = undefined;
      const tokenData = this.createToken(user);

      res.cookie('Authorization', tokenData.token, {
        httpOnly: true,
        maxAge: tokenData.expiresIn,
      });

      res.send(user);
    }
  };

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginDto = req.body;
    const user = await this.UserModel.findOne({ email: loginData.email });

    if (!user) {
      next(new WrongCredentialsException());
    } else {
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);

      if (!isPasswordMatching) {
        next(new WrongCredentialsException());
      } else {
        user.password = undefined;
        const tokenData = this.createToken(user);

        res.cookie('Authorization', tokenData.token, {
          httpOnly: true,
          maxAge: tokenData.expiresIn,
        });

        res.send(user);
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  private createToken(user: User): TokenData {
    const expiresIn = new Date().getTime() + 3600000 * 24 * 14;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private logout = (req: express.Request, res: express.Response) => {
    res.clearCookie('Authorization');
    res.sendStatus(200);
  };
}

export default AuthenticationController;
