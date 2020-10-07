import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { errors } from "celebrate";
import routes from "./routes";
import multerConfig from "@config/multer";
import AppError from "@shared/errors/AppError";
import rateLimiterMiddleware from "./middlewares/rateLimiterMiddleware";
import "@shared/infra/typeorm";
import "@shared/container";

const app = express();

app.use(rateLimiterMiddleware);
app.use(cors());
app.use(express.json());
app.use("/files", express.static(multerConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

app.listen(3333, () => {
  console.log("🚀  Server started!");
});
