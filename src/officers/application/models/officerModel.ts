export class OfficerModel {
    public officerId: number;
    public firstName: string;
    public lastName: string;
    public createAt: Date;
    public updatedAt: Date;

    constructor(
        officerId: number,
        firstName: string,
        lastName: string,
        createAt: Date,
        updatedAt: Date,
    ) {
        this.officerId = officerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createAt = createAt;
        this.updatedAt = updatedAt;
    }
}
