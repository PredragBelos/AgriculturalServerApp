export class LoginAgriculturalHoldingDto {
    username: string;
    password: string;
}

export const loginAgriculturalHoldingDtoTemplate = {
    username: { type: "string", length: 30 },
    password: { type: "string", length: 255 },
}