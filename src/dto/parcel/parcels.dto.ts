import { ParcelCoordinateDto } from "../parcel_coordinate/parcel.coordinate.dto";
import { ParcelOwnerDto } from "../parcel_owner/parcel.owner.dto";

export class ParcelDto {

    parcelId: number;
    agriculturalHoldingId: number;
    manicipalityId: string;
    manicipalityName: string;
    cadastralManicipalityId: string;
    cadastralManicipalityName: string;
    parcelNumber: string;
    parcelName: string;
    alternativeName: string;
    areaMeters: number;
    areaHectars: number;
    areaJutro: number;
    usableAreaMeters: number;
    usableAreaHectars: number;
    usableAreaJutro: number;
    class: string;
    propertyOwnership: boolean;
    rent: string;
    owners: ParcelOwnerDto[];
    coordinates: ParcelCoordinateDto[];
}