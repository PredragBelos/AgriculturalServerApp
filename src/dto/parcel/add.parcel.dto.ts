export class AddParcelDto {
    agriculturalHoldingId: number;
    manicipalityId: string;
    manicipalityName: string;
    cadastralManicipalityId: string;
    cadastralManicipalityName: string;
    parcelNumber: string;
    parcelName: string;
    alternativeName: string;
    areaMeters: number;
    usableAreaMeters: number;
    class: string;
    propertyOwnership: boolean;
    rent: string;
}

export const addParcelDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    manicipalityId: { type: "string", length: 10 },
    manicipalityName: { type: "string", length: 30 },
    cadastralManicipalityId: { type: "string", length: 10 },
    cadastralManicipalityName: { type: "string", length: 30 },
    parcelNumber: { type: "string", length: 15 },
    parcelName: { type: "string", length: 50 },
    alternativeName: { type: "string", length: 50 },
    areaMeters: { type: "number" },
    usableArea: { type: "number" },
    class: { type: "string", length: 10 },
    propertyOwnership: { type: "boolean" },
    rent: { type: "string", length: 50 },
}