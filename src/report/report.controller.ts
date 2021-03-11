import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import UserModel from '../users/user.model';

class ReportController implements Controller {
  public path = '/report';

  public router = express.Router();

  private UserModel = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const usersByCountries = await this.UserModel.aggregate([
      {
        $match: {
          'address.country': {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            country: '$address.country',
          },
          users: {
            $push: {
              name: '$name',
              _id: '$_id',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'articles',
        },
      },
      {
        $addFields: {
          amontOfArticles: {
            $size: '$articles',
          },
        },
      },
      {
        $sort: {
          amountOfArticles: 1,
        },
      },
    ]);

    res.send({
      usersByCountries,
    });
  };
}

export default ReportController;
