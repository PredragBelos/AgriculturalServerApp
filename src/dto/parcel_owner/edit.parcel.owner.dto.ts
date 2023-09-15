export class EditParcelOwnerDto {
    parcelOwnerId: number;
    agriculturalHoldingId: number;
    ownerName: string;
    ownerSurname: string;
    identificationNumber: string;
    address: string;
    zipNumber: string;
    city: string;
    phone: string;
    email: string;
    note: string;
}

export const editParcelOwnerDtoTemplate = {
    parcelOwnerId: { type: "number" },
    agriculturalHoldingId: { type: "number" },
    ownerName: { type: "string", length: 30 },
    ownerSurname: { type: "string", length: 30 },
    identificationNumber: { type: "string", length: 13 },
    address: { type: "string", length: 50 },
    zipNumber: { type: "string", length: 5 },
    city: { type: "string", length: 25 },
    phone: { type: "string", length: 30 },
    email: { type: "string", length: 100 },
    note: { type: "string", length: 255 },
}