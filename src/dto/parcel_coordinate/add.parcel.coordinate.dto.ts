export class AddParcelCoordinateDto {
    agriculturalHoldingId: number;
    parcelId: number;
    xCoordinate: number;
    yCoordinate: number;
}

export const addParcelCoordinateDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    parcelId: { type: "number" },
    xCoordinate: { type: "number" },
    yCoordinate: { type: "number" },
}