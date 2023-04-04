import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { AddParcelDto } from "src/dto/parcel/add.parcel.dto";
import { EditParcelDto } from "src/dto/parcel/edit.parcel.dto";
import { ParcelDto } from "src/dto/parcel/parcels.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { ParcelService } from "src/service/parcel/parcel.service";

@Controller("parcels")
export class ParcelController {
    constructor(
        private parcelService: ParcelService,
    ) { }

    // Method for get parcels for agricultural holding
    @Get(":id")
    async getParcelsForAgriculturalHolding(@Param("id", ParseIntPipe) agriculturalHoldingId: number, @Req() req: Request): Promise<RequestResponse | ParcelDto[]> {
        return this.parcelService.getParcelsForAgriculturalHolding(agriculturalHoldingId, req);
    }

    @Get("parcel/:id")
    async getParcelById(@Param("id", ParseIntPipe) parcelId: number, @Req() req: Request): Promise<RequestResponse | ParcelDto> {
        return this.parcelService.getParcelById(parcelId, req);
    }

    @Post()
    async addParcel(@Body() data: AddParcelDto): Promise<RequestResponse> {
        return this.parcelService.addParcel(data);
    }

    @Put("parcel/:id")
    async editParcel(@Param("id", ParseIntPipe) parcelId: number, @Body() data: EditParcelDto, @Req() req: Request): Promise<RequestResponse> {
        return await this.parcelService.editParcel(parcelId, data, req);
    }

    @Delete("parcel/:id")
    async deleteParcel(@Param("id", ParseIntPipe) parcelId: number, @Req() req: Request) {
        return await this.parcelService.deleteParcel(parcelId, req);
    }
}