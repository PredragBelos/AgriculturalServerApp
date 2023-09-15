export class EditVehiclesDto {
    vehicleId: number;
    agriculturalHoldingId: number;
    type: string;
    mark: string;
    model: string;
    vinNumber: string;
    registrationNumber: string;
    status: boolean;
}

export const editVehiclesDtoTemplate = {
    vehicleId: { type: "number" },
    agriculturalHoldingId: { type: "number" },
    type: { type: "string", length: 30 },
    mark: { type: "string", length: 30 },
    model: { type: "string", length: 30 },
    vinNumber: { type: "string", length: 17 },
    registrationNumber: { type: "string", length: 15 },
    status: { type: "boolean" },
}