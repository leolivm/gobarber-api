import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRespository";

let fakeAppointentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe("ListProviderDayAvailability", () => {
  beforeEach(() => {
    fakeAppointentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointentsRepository
    );
  });

  it("should be able to list the day availability from provider", async () => {
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

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availabilty = await listProviderDayAvailability.execute({
      provider_id: "user",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availabilty).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );
  });
});
