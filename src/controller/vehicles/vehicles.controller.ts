import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { AddVehiclesDto } from "src/dto/vehicles/add.vehicles.dto";
import { EditVehiclesDto } from "src/dto/vehicles/edit.vehicles.dto";
import { GetVehiclesDto } from "src/dto/vehicles/get.vehicles.dto";
import { Vehicles } from "src/entity/vehicles.entity";
import { RequestResponse } from "src/objects/response/request.response";
import { VehiclesService } from "src/service/vehicles/vehicles.service";


@Controller("vehicles")
export class VehiclesController {
    constructor(
        private vehiclesService: VehiclesService,
    ) { }

    @Get()
    async getAllVehiclesByAgriculturalId(@Req() req: Request): Promise<GetVehiclesDto[] | RequestResponse> {
        return this.vehiclesService.getAllVehiclesByAgriculturalId(req);
    }

    @Get(":id")
    async getVehicleById(@Param("id", ParseIntPipe) vehicleId: number, @Req() req: Request): Promise<GetVehiclesDto | RequestResponse> {
        return this.vehiclesService.getVehicleById(vehicleId, req);
    }

    @Put()
    async editVehicleById(@Body() data: EditVehiclesDto, @Req() req: Request): Promise<RequestResponse | GetVehiclesDto> {
        return this.vehiclesService.editVehicleById(data, req);
    }

    @Post()
    async addNewVehicle(@Body() data: AddVehiclesDto, @Req() req: Request): Promise<RequestResponse | GetVehiclesDto[]> {
        return await this.vehiclesService.addNewVehicle(data, req);
    }

    @Delete(":id")
    async deleteVehicleById(@Param("id", ParseIntPipe) vehicleId: number, @Req() req: Request): Promise<RequestResponse> {
        return this.vehiclesService.deleteVehicleById(vehicleId, req)
    }
}