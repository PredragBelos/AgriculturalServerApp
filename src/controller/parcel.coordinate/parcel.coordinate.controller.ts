import { Body, Controller, Put, Req, Param } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { AddParcelCoordinateDto } from "src/dto/parcel_coordinate/add.parcel.coordinate.dto";
import { ReturnParcelCoordinateDto } from "src/dto/parcel_coordinate/return.parcel.coordinate.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { ParcelCoordinateService } from "src/service/parcel.coordinate/parcel.coordinate.service";

@Controller("parcel-coordinate")
export class ParcelCoordinateController {
    constructor(
        private parcelCoordinateService: ParcelCoordinateService,
    ) { }

    @Put("parcel/:id")
    async addCoordinates(@Param('id', ParseIntPipe) parcelId: number, @Body() data: AddParcelCoordinateDto[], @Req() req: Request): Promise<RequestResponse | ReturnParcelCoordinateDto> {
        return await this.parcelCoordinateService.addCoordinates(parcelId, data, req);
    }
}