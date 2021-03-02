import * as express from 'express';
import Post from './post.interface';

class PostsController {
  public path = '/posts';

  public router = express.Router();

  private posts: Post[] = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum',
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
  }

  getAll(req: express.Request, res: express.Response) {
    res.send(this.posts);
  }

  create(req: express.Request, res: express.Response) {
    const post: Post = req.body;
    this.posts.push(post);
    res.send(post);
  }
}

export default PostsController;
