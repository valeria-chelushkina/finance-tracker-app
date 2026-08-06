import express, { Application, Request, Response } from "express";
import userRouter from './modules/user/user.routes.js';

const app: Application = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/user', userRouter);

app.get('/users', (req: Request, res: Response) => {
  res.send("It is working :)");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});