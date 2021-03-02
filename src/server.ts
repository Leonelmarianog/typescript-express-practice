import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
const PORT: number = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
