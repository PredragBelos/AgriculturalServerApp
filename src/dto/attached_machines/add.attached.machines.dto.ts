export class AddAttachedMachinesDto {
    agriculturalHoldingId: number;
    type: string;
    mark: string;
    model: string;
    status: boolean;
}

export const addAttachedMachinesDtoTemplate = {
    agriculturalHoldingId: { type: "number" },
    type: { type: "string", length: 30 },
    mark: { type: "string", length: 30 },
    model: { type: "string", length: 30 },
    status: { type: "boolean" },
}