import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { AddAttachedVehiclesDto } from "src/dto/attached_vehicles/add.attached.vehicles.dto";
import { EditAttachedVehiclesDto } from "src/dto/attached_vehicles/edit.attached.vehicles.dto";
import { GetAttachedVehiclesDto } from "src/dto/attached_vehicles/get.attached.vehicles.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { AttachedVehiclesService } from "src/service/attached.vehicles/attached.vehicles.service";


@Controller("attached-vehicles")
export class AttachedVehiclesController {
    constructor(
        private attachedVehiclesService: AttachedVehiclesService,
    ) { }

    @Get()
    async getAllAttachedVehiclesByAgriculturalId(@Req() req: Request): Promise<GetAttachedVehiclesDto[] | RequestResponse> {
        return this.attachedVehiclesService.getAllAttachedVehiclesByAgriculturalId(req);
    }

    @Get(":id")
    async getAttachedVehicleById(@Param("id", ParseIntPipe) attachedVehicleId: number, @Req() req: Request): Promise<GetAttachedVehiclesDto | RequestResponse> {
        return this.attachedVehiclesService.getAttachedVehicleById(attachedVehicleId, req);
    }

    @Put()
    async editAttachedVehicleById(@Body() data: EditAttachedVehiclesDto, @Req() req: Request): Promise<RequestResponse> {
        return this.attachedVehiclesService.editAttachedVehicleById(data, req);
    }

    @Post()
    async addNewAttachedVehicle(@Body() data: AddAttachedVehiclesDto, @Req() req: Request): Promise<RequestResponse> {
        return await this.attachedVehiclesService.addNewAttachedVehicle(data, req);
    }

    @Delete(":id")
    async deleteVehicleById(@Param("id", ParseIntPipe) attachedVehicleId: number, @Req() req: Request): Promise<RequestResponse> {
        return this.attachedVehiclesService.deleteAttachedVehicleById(attachedVehicleId, req);
    }
}