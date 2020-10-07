import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRespository";

let fakeAppointentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe("ListProviderMonthAvailability", () => {
  beforeEach(() => {
    fakeAppointentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointentsRepository
    );
  });

  it("should be able to list the month availability from provider", async () => {
    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeAppointentsRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availabilty = await listProviderMonthAvailability.execute({
      provider_id: "user",
      year: 2020,
      month: 5,
    });

    expect(availabilty).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    );
  });
});
