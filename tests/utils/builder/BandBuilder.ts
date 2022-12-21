import MemberDTO from "../../../src/dto/MemberDTO";
import BandRepositoryInterface from '../../../src/application/ports/repository/BandRepositoryInterface';
import { v4 as uuid } from "uuid";
import Band from "../../../src/domain/entity/Band";
import { InviteDTO, Status } from "../../../src/dto/InviteDTO";

export default class BandBuilder {
    public bandId: string;
    public name: string;
    public description: string;
    public logo: string;
    public adminId: string;
    public members: MemberDTO[];
    public vacancies: string[];
    public invite: InviteDTO;

    constructor(private bandRepository: BandRepositoryInterface) {}

    createBand(adminId: string) {
        this.bandId = uuid();
        this.name = "name";
        this.description = "description";
        this.logo = "logo";
        this.adminId = adminId;
        const member = { memberId: uuid(), profileId: adminId, role: "admin" }
        this.members = [member];
        this.vacancies = [];
        this.bandRepository.save(this.band);
        return this
    }

    withMember(members: MemberDTO) {
        this.members.push(members);
        this.bandRepository.save(this.band);
        return this
    }

    withVacancies(vacancies: string[]) {
        this.vacancies = vacancies;
        this.bandRepository.save(this.band);
        return this
    }

    withInviteTo(profileId: string, role: string) {
        this.invite = {
            inviteId: uuid(),
            bandId: this.bandId,
            profileId,
            role,
            status: Status.pending,
        }
        this.bandRepository.createInvite(this.invite);
        return this
    }

    private get band() {
        return new Band(this.bandId, this.name, this.description, this.logo, this.adminId, this.members, this.vacancies);
    }
}