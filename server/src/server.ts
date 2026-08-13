import express, { Application } from "express";
import userRouter from "@server/modules/user/user.routes.js";
import authRouter from '@server/modules/auth/auth.routes.js';
import {getEnvOrThrow} from '@server/utils/getEnvOrThrow.js';
import {errorMiddleware} from '@server/middlewares/errorMiddleware.js';

const app: Application = express();
const PORT = getEnvOrThrow('PORT');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
