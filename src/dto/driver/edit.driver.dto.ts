export class EditDriverDto {
    driverId: number;
    driverName: string;
    driverSurname: string;
    driverAddress: string;
    driverCity: string;
    zipCode: string;
    driverCardNum: string;
    driverPhone: string;
    driverEmail: string;
    driverStatus: boolean;
}

export const editDriverDtoTemplate = {
    driverId: { type: "number" },
    driverName: { type: "string", length: 30 },
    driverSurname: { type: "string", length: 30 },
    driverAddress: { type: "string", length: 50 },
    driverCity: { type: "string", length: 25 },
    zipCode: { type: "string", length: 5 },
    driverCardNum: { type: "string", length: 20 },
    driverNadriverPhoneme: { type: "string", length: 30 },
    driverEmail: { type: "string", length: 100 },
    driverStatus: { type: "boolean" },
}