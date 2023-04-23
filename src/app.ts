import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { UserRoutes } from './routes/user.routes';

createConnection().then(async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(fileUpload());
  app.use('/users', UserRoutes);

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
}).catch(error => console.log(error));
