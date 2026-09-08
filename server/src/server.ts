import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "@server/modules/user/user.routes.js";
import { authRouter } from "@server/modules/auth/auth.routes.js";
import { bankRouter } from "@server/modules/bank/bank.routes.js";
import { accountRouter } from "@server/modules/account/account.routes.js";
import { transactionRouter } from "@server/modules/transaction/transaction.routes.js";
import { categoryRouter } from "@server/modules/category/category.routes.js";
import { jarRouter } from "@server/modules/jar/jar.routes.js";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { errorMiddleware } from "@server/middlewares/errorMiddleware.js";

const app: Application = express();
const PORT = getEnvOrThrow("PORT");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/bank", bankRouter);
app.use("/account", accountRouter);
app.use("/transaction", transactionRouter);
app.use("/category", categoryRouter);
app.use("/jar", jarRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
