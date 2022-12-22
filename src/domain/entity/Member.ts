import { v4 as uuid } from "uuid";

interface Props {
    memberId?: string;
    profileId: string;
    role: string;
}

export default class Member{
    readonly memberId: string;
    readonly profileId: string;
    readonly role: string;

    constructor(props: Props) {
        this.memberId = props.memberId || uuid();
        this.profileId = props.profileId;
        this.role = props.role;
    }
}