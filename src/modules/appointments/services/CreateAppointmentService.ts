import { startOfHour, isBefore, getHours, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { injectable, inject } from "tsyringe";
import AppError from "@shared/errors/AppError";
import Appointment from "../infra/typeorm/entities/Appointment";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

interface Req {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    date,
    user_id,
    provider_id,
  }: Req): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create appointment on past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create appointment to yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can only create appointments between 8am and 5pm."
      );
    }

    const findAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointment) {
      throw new AppError("This appointment is already booked.");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento com para dia ${dateFormatted}'h'.`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
