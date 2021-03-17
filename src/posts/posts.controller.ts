import * as express from 'express';
import { getRepository } from 'typeorm';
import Post from './post.entity';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import CreatePostDto from './post.dto';

class PostsController implements Controller {
  public path = '/posts';

  public router = express.Router();

  private postRepository = getRepository(Post);

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
    this.router.delete(`${this.path}/:id`, this.remove);
  }

  findAll = async (req: express.Request, res: express.Response) => {
    const posts = await this.postRepository.find({
      relations: ['author'],
    });
    res.send(posts);
  };

  findById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const post = await this.postRepository.findOne(id, {
      relations: ['author'],
    });

    if (!post) {
      next(new PostNotFoundException(id));
    } else {
      res.send(post);
    }
  };

  create = async (req: RequestWithUser, res: express.Response) => {
    const postData: CreatePostDto = req.body;
    const newPost = this.postRepository.create({
      ...postData,
      author: req.user,
    });
    await this.postRepository.save(newPost);
    res.send(newPost);
  };

  update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const postData: CreatePostDto = req.body;
    await this.postRepository.update(id, postData);
    const updatedPost = await this.postRepository.findOne(id);

    if (!updatedPost) {
      next(new PostNotFoundException(id));
    } else {
      res.send(updatedPost);
    }
  };

  remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const deleteResponse = await this.postRepository.delete(id);

    if (!deleteResponse.raw[1]) {
      next(new PostNotFoundException(id));
    } else {
      res.sendStatus(200);
    }
  };
}

export default PostsController;
