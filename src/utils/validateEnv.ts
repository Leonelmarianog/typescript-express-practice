import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    MONGO_DB_URI: str(),
    PORT: port(),
  });
}

export default validateEnv;
