import Band from "../../entity/Band";

export default interface BandRepositoryInterface {
  save(band: Band): Promise<void>;
  findBandById(id: string): Promise<Band>;
  update(band: Band): Promise<void>;
}
