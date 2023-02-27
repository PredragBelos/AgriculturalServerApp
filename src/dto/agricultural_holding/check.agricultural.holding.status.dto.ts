export class CheckAgriculturalHoldingStatusDto {
    token: string;
    agriculturalHoldingName: string;
}

export const checkAgriculturalHoldingStatusDtoTemplate = {
    token: { type: "string", length: 500 },
    agriculturalHoldingName: { type: "string", length: 30 },
}