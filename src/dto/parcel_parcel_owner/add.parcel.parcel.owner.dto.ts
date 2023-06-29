export class AddParcelParcelOwnerDto {
    agriculturalHoldingId: number;
    parcelId: number;
    parcelOwnerId: number;
    sharePercentage: 1; // This is property with default value bicause this property dont use now
}

export const AddParcelParcelOwnerDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    parcelId: { type: "number" },
    parcelOwnerId: { type: "number" },
    sharePercentage: { type: "number" },
}