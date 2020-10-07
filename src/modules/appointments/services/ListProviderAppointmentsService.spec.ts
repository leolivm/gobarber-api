import ListProviderAppointmentsService from "./ListProviderAppointmentsService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRespository";

let fakeAppointentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe("ListProviderAppointments", () => {
  beforeEach(() => {
    fakeAppointentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointentsRepository,
      fakeCacheProvider
    );
  });

  it("should be able to list the appointments on a specific date", async () => {
    const appointment1 = await fakeAppointentsRepository.create({
      provider_id: "provider",
      user_id: "user",
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointentsRepository.create({
      provider_id: "provider",
      user_id: "user",
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: "provider",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
