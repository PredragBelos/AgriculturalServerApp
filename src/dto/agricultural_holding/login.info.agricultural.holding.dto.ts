export class LoginInfoAgriculturalHoldingDto {
    agriculturalHoldingId: number;
    agriculturalHoldingName: string;
    token: string;

    constructor(
        agriculturalHoldingId: number,
        agriculturalHoldingName: string,
        token: string
    ) {
        this.agriculturalHoldingId = agriculturalHoldingId;
        this.agriculturalHoldingName = agriculturalHoldingName;
        this.token = token;
    }
}