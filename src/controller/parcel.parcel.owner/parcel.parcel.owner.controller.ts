import { Controller, Post, Body, Req, Put, Param, ParseIntPipe, Delete, Get } from "@nestjs/common";
import { AddParcelParcelOwnerDto } from "src/dto/parcel_parcel_owner/add.parcel.parcel.owner.dto";
import { DelleteParcelParcelOwnerDto } from "src/dto/parcel_parcel_owner/dellete.parcel.parcel.owner.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { ParcelParcelOwnerService } from "src/service/parcel.parcel.owner/parcel.parcel.owner.service";

type ChangeOwnersParameters = {
    ownersData: AddParcelParcelOwnerDto[],
    ownersNoData: DelleteParcelParcelOwnerDto[],
}

@Controller("parcel-parcel-owners")
export class ParcelParcelOwnersController {
    constructor(
        private parcelParcelOwnersService: ParcelParcelOwnerService,
    ) { }

    // Controller for fill parcel owners table
    @Post()
    async fillOwnersTable(@Body() data: ChangeOwnersParameters, @Req() req: Request): Promise<RequestResponse> {
        if (data.ownersData.length > 0) {
            return await this.parcelParcelOwnersService.fillOwnersTable(data, req)
        }
        else { return this.parcelParcelOwnersService.delleteParcelOwnersByParcelId(data, req); }
    }
}