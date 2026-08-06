import express, { Application, Request, Response } from "express";
import userRouter from "@server/modules/user/user.routes.js";
import {getEnvOrThrow} from '@server/utils/getEnvOrThrow.js';

const app: Application = express();
const PORT = getEnvOrThrow('PORT');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/user/:id", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
