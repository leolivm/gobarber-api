import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { getHours, isAfter } from "date-fns";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProvideDayAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appoimentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    day,
    month,
    year,
    provider_id,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appoimentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      }
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
