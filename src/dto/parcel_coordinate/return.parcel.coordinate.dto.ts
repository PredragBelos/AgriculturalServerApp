type ParcelObject = {
    parcelId: number;
    xCoordinate: number;
    yCoordinate: number;
}

export class ReturnParcelCoordinateDto {
    code: number;
    rejectedParcels: ParcelObject[];
}