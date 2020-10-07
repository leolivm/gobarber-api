import { Router } from "express";
import multer from "multer";
import { celebrate, Segments, Joi } from "celebrate";
import multerConfig from "@config/multer";
import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController";
import authMiddleware from "@modules/users/infra/http/middlewares/auth";

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(multerConfig);

usersRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

usersRouter.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  userAvatarController.update
);

export default usersRouter;
