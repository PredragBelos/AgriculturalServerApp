import { Controller, Post, Body, Req, Put, Param, ParseIntPipe, Delete, Get } from "@nestjs/common";
import { AddParcelOwnerDto } from "src/dto/parcel_owner/add.parcel.owner.dto";
import { EditParcelOwnerDto } from "src/dto/parcel_owner/edit.parcel.owner.dto";
import { GetParcelOwnerDto } from "src/dto/parcel_owner/get.parcel.owner.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { ParcelOwnersService } from "src/service/parcel.owner/parcel.owner.service";

@Controller("parcel-owners")
export class ParcelOwnersController {
    constructor(
        private parcelOwnersService: ParcelOwnersService,
    ) { }

    // Service for adding new parcel owner
    @Post()
    async addOwner(@Body() data: AddParcelOwnerDto, @Req() req: Request): Promise<RequestResponse> {
        return await this.parcelOwnersService.addOwner(data, req);
    }

    @Put(":id")
    async editOwner(@Param("id", ParseIntPipe) ownerId: number, @Body() data: EditParcelOwnerDto, @Req() req: Request): Promise<RequestResponse> {
        return await this.parcelOwnersService.editOwner(ownerId, data, req);
    }

    @Delete(":id")
    async deleteOwner(@Param("id", ParseIntPipe) ownerId: number, @Req() req: Request): Promise<RequestResponse> {
        return await this.parcelOwnersService.deleteOwner(ownerId, req);
    }

    @Get()
    async getParcelOwnersByAgriculturalHolding(@Req() req: Request): Promise<RequestResponse | GetParcelOwnerDto[]> {
        return await this.parcelOwnersService.getParcelOwnersByAgriculturalHolding(req);
    }
}