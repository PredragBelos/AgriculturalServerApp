export class EditAttachedMachinesDto {
    attachedMachinesId: number;
    agriculturalHoldingId: number;
    type: string;
    mark: string;
    model: string;
    status: boolean;
}

export const editAttachedMachinesDtoTemplate = {
    attachedMachinesId: { type: "number" },
    agriculturalHoldingId: { type: "number" },
    type: { type: "string", length: 30 },
    mark: { type: "string", length: 30 },
    model: { type: "string", length: 30 },
    status: { type: "boolean" },
}