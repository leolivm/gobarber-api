import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRespository";
import CreateAppointmentService from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it("should be able to create a new appointment", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      user_id: "user-id",
      provider_id: "provider-id",
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("provider-id");
  });

  it("should not be able to create two appointments on the same time", async () => {
    const appointmentDate = new Date(2021, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: "user-id",
      provider_id: "provider-id",
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: "user-id",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create appointment on past date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: "user-id",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create appointment with same user_id as provider_id", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: "user-id",
        provider_id: "user-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create appointment before 8am and after 5pm", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: "user-id",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: "user-id",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
