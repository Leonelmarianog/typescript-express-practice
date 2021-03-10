import * as express from 'express';
import PostModel from './posts.model';
import Controller from '../interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CreatePostDto from './post.dto';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class PostsController implements Controller {
  public path = '/posts';

  public router = express.Router();

  private PostModel = PostModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.findAll);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.create);
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.update
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.remove);
  }

  findAll = (req: express.Request, res: express.Response) => {
    this.PostModel.find()
      .populate('author', '-password')
      .then((posts) => {
        res.send(posts);
      });
  };

  findById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    this.PostModel.findById(id).then((post) => {
      if (!post) {
        next(new PostNotFoundException(id));
      } else {
        res.send(post);
      }
    });
  };

  create = async (req: RequestWithUser, res: express.Response) => {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.PostModel({
      ...postData,
      // eslint-disable-next-line no-underscore-dangle
      author: req.user._id,
    });
    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password').execPopulate();
    res.send(savedPost);
  };

  update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const postData: CreatePostDto = req.body;
    this.PostModel.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      if (!post) {
        next(new PostNotFoundException(id));
      } else {
        res.send(post);
      }
    });
  };

  remove = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    this.PostModel.findByIdAndDelete(id).then((successResponse) => {
      if (!successResponse) {
        next(new PostNotFoundException(id));
      } else {
        res.sendStatus(200);
      }
    });
  };
}

export default PostsController;
