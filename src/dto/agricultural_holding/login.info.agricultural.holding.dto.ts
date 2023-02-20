export class LoginInfoAgriculturalHoldingDto {
    agriculturalHoldingId: number;
    agriculturalHoldingName: string;
    username: string;
    token: string;

    constructor(
        agriculturalHoldingId: number,
        agriculturalHoldingName: string,
        username: string,
        token: string
    ) {
        this.agriculturalHoldingId = agriculturalHoldingId;
        this.agriculturalHoldingName = agriculturalHoldingName;
        this.username = username;
        this.token = token;
    }
}