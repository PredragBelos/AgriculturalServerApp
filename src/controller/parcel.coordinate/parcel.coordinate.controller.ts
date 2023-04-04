import { Controller } from "@nestjs/common";
import { ParcelCoordinateService } from "src/service/parcel.coordinate/parcel.coordinate.service";

@Controller("parcel-coordinate")
export class ParcelCoordinateController {
    constructor(
        private parcelCoordinateService: ParcelCoordinateService,
    ) { }
}