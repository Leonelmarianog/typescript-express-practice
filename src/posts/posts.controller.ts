import * as express from 'express';
import Post from './post.interface';
import PostModel from './posts.model';
import Controller from '../interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';

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
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.create);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.update);
    this.router.delete(`${this.path}/:id`, this.remove);
  }

  findAll = (req: express.Request, res: express.Response) => {
    this.PostModel.find().then((posts) => {
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

  create = (req: express.Request, res: express.Response) => {
    const postData: Post = req.body;
    const createdPost = new this.PostModel(postData);
    createdPost.save().then((savedPost) => {
      res.send(savedPost);
    });
  };

  update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const postData: Post = req.body;
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
