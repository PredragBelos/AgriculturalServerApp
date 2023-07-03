import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { RequestResponse } from "src/objects/response/request.response";
import { AttachedVehiclesService } from "src/service/attached.vehicles/attached.vehicles.service";


@Controller("attached-vehicles")
export class AttachedVehiclesController {
    constructor(
        private attachedVehiclesService: AttachedVehiclesService,
    ) { }

    
}