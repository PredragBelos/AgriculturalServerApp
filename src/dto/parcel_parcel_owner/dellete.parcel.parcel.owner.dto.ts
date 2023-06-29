export class DelleteParcelParcelOwnerDto {
    agriculturalHoldingId: number;
    parcelId: number;
}

export const DelleteParcelParcelOwnerDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    parcelId: { type: "number" },
}