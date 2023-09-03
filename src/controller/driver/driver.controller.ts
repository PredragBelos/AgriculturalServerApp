import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { AddDriverDto } from "src/dto/driver/add.driver.dto";
import { EditDriverDto } from "src/dto/driver/edit.driver.dto";
import { GetDriverDto } from "src/dto/driver/get.driver.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { DriverService } from "src/service/driver/driver.service";


@Controller("driver")
export class DriverController {
    constructor(
        private driverService: DriverService,
    ) { }

    // Controller for getting all drivers for agricultural holding
    @Get()
    async getAllDriversByAgriculturalHoldingId(@Req() req: Request): Promise<GetDriverDto[] | RequestResponse> {
        return this.driverService.getAllDriverByAgriculturalHoldingId(req);
    }

    // Controller for getting one driver by drivers id
    @Get(":id")
    async getDriverById(@Param("id", ParseIntPipe) driverId: number, @Req() req: Request): Promise<GetDriverDto | RequestResponse> {
        return this.driverService.getDriverById(driverId, req);
    }

    // Controller for editing driver
    @Put()
    async editDriverById(@Body() data: EditDriverDto, @Req() req: Request): Promise<GetDriverDto | RequestResponse> {
        return this.driverService.editDriverById(data, req);
    }

    @Post()
    async addDriver(@Body() data: AddDriverDto, @Req() req: Request): Promise<GetDriverDto[] | RequestResponse> {
        return this.driverService.addDriver(data, req);
    }

    @Delete(":id")
    async deleteDriver(@Param("id", ParseIntPipe) driverId: number, @Req() req: Request): Promise<RequestResponse> {
        return this.driverService.deleteDriver(driverId, req);
    }



    // @Get()
    // async getAllVehiclesByAgriculturalId(@Req() req: Request): Promise<GetVehiclesDto[] | RequestResponse> {
    //     return this.vehiclesService.getAllVehiclesByAgriculturalId(req);
    // }

    // @Get(":id")
    // async getVehicleById(@Param("id", ParseIntPipe) vehicleId: number, @Req() req: Request): Promise<GetVehiclesDto | RequestResponse> {
    //     return this.vehiclesService.getVehicleById(vehicleId, req);
    // }

    // @Put()
    // async editVehicleById(@Body() data: EditVehiclesDto, @Req() req: Request): Promise<RequestResponse | GetVehiclesDto> {
    //     return this.vehiclesService.editVehicleById(data, req);
    // }

    // @Post()
    // async addNewVehicle(@Body() data: AddVehiclesDto, @Req() req: Request): Promise<RequestResponse | GetVehiclesDto[]> {
    //     return await this.vehiclesService.addNewVehicle(data, req);
    // }

    // @Delete(":id")
    // async deleteVehicleById(@Param("id", ParseIntPipe) vehicleId: number, @Req() req: Request): Promise<RequestResponse> {
    //     return this.vehiclesService.deleteVehicleById(vehicleId, req)
    // }
}