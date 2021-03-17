import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from './ormconfig';
import validateEnv from './utils/validateEnv';
import App from './app';
import PostsController from './posts/posts.controller';
import AuthenticationController from './authentication/authentication.controller';
import AddressController from './address/address.controller';
import CategoryController from './category/category.controller';

validateEnv();

// eslint-disable-next-line consistent-return
(async () => {
  try {
    await createConnection(config);
    // eslint-disable-next-line no-console
    console.log('Connected to database!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error while connecting to the database', error);
    return error;
  }

  const app = new App([
    new PostsController(),
    new AuthenticationController(),
    new AddressController(),
    new CategoryController(),
  ]);
  app.listen();
})();
