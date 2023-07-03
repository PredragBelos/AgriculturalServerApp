import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { RequestResponse } from "src/objects/response/request.response";
import { AttachedMachinesService } from "src/service/attached.machines/attached.machines.service";


@Controller("attached-machines")
export class AttachedMachinesController {
    constructor(
        private attachedMachinesService: AttachedMachinesService,
    ) { }

    
}