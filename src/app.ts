import * as express from 'express';
import * as bodyParser from 'body-parser';

class App {
  public app: express.Application;

  public PORT: number;

  constructor(controllers, PORT) {
    this.app = express();
    this.PORT = PORT;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
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
    this.app.listen(this.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${this.PORT}...`);
    });
  }
}

export default App;
