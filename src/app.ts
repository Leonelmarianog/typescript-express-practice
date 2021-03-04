import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

class App {
  public app: express.Application;

  constructor(controllers) {
    this.app = express();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
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

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  }
}

export default App;
