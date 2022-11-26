import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepository";
import CreateBand from "../../../src/usecase/band/CreateBand";
import MemoryBandRepository from "../../../src/infra/repository/memory/MemoryBandRepository";

let bandRepository: BandRepositoryInterface;
let bandId: string;
beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  bandId = await usecase.execute("id", "Some cool name for a band", "Some cool logo for a band");
});

test("It should be able to create a band", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  await usecase.execute("id", "Some cool name for a band", "Some cool logo for a band");
  expect(bandRepository.bands).toHaveLength(1);
});
