import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});