import * as express from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import PostModel from '../posts/posts.model';

class UserController implements Controller {
  public path = './users';

  public router = express.Router();

  private PostModel = PostModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getAllPostsOfUser = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.params.id;

    // eslint-disable-next-line no-underscore-dangle
    if (userId === req.user._id.toString()) {
      const posts = await this.PostModel.find({ author: userId });
      res.send(posts);
    } else {
      next(new NotAuthorizedException());
    }
  };
}

export default UserController;
