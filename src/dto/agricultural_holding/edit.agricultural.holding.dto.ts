export class EditAgriculturalHoldingDto {
    agriculturalHoldingId: number;
    agriculturalHoldingName: string;
    agriculturalHoldingNumber: string;
    address: string;
    city: string;
    zipNumber: string;
    directorName: string;
    directorSurname: string;
    directorIdNum: string;
    phone: string;
    email: string;
}

export const editAgriculturalHoldingDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    agriculturalHoldingName: { type: "string", length: 30 },
    agriculturalHoldingNumber: { type: "string", length: 12 },
    address: { type: "string", length: 50 },
    city: { type: "string", length: 25 },
    zipNumber: { type: "string", length: 5 },
    directorName: { type: "string", length: 30 },
    directorSurname: { type: "string", length: 30 },
    directorIdNum: { type: "string", length: 13 },
    phone: { type: "string", length: 30 },
    email: { type: "string", length: 100 },
}