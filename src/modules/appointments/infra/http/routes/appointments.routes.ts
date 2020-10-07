import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import authMiddleware from "@modules/users/infra/http/middlewares/auth";
import AppointmentController from "../controllers/AppointmentController";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();
const providerAppointmentController = new ProviderAppointmentsController();

appointmentsRouter.use(authMiddleware);

appointmentsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create
);

appointmentsRouter.get("/me", providerAppointmentController.index);

export default appointmentsRouter;
