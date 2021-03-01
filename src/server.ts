import * as express from 'express';

const app = express();
const PORT: number = 3000;

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
