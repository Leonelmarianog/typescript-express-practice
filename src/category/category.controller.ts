import * as express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getRepository } from 'typeorm';
import CategoryNotFoundException from '../exceptions/CategoryNotFoundException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateCategoryDto from './category.dto';
import Category from './category.entity';

class CategoryController implements Controller {
  public path = '/categories';

  public router = express.Router();

  private categoryRepository = getRepository(Category);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.findAll);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreateCategoryDto),
      this.create
    );
  }

  private findAll = async (req: express.Request, res: express.Response) => {
    const categories = await this.categoryRepository.find({ relations: ['posts'] });
    res.send(categories);
  };

  private findById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const category = this.categoryRepository.findOne(id);

    if (!category) {
      next(new CategoryNotFoundException(id));
    } else {
      res.send(category);
    }
  };

  private create = async (req: express.Request, res: express.Response) => {
    const categoryData: CreateCategoryDto = req.body;
    const newCategory = await this.categoryRepository.create(categoryData);
    await this.categoryRepository.save(newCategory);
    res.send(newCategory);
  };
}

export default CategoryController;
