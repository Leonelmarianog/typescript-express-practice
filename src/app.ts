import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  // eslint-disable-next-line class-methods-use-this
  private connectToDatabase() {
    const { MONGO_DB_URI } = process.env;

    mongoose
      .connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      // eslint-disable-next-line no-console
      .then(() => console.log('Connected to db'))
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  }
}

export default App;
