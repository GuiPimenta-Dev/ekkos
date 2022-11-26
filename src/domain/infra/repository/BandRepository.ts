import Band from "../../entity/Band";

export default interface BandRepositoryInterface {
  save(band: Band): Promise<void>;
}
