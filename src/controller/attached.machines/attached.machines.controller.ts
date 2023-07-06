import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Put, Delete } from "@nestjs/common";
import { AddAttachedMachinesDto } from "src/dto/attached_machines/add.attached.machines.dto";
import { EditAttachedMachinesDto } from "src/dto/attached_machines/edit.attached.machines.dto";
import { GetAttachedMachinesDto } from "src/dto/attached_machines/get.attached.machines.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { AttachedMachinesService } from "src/service/attached.machines/attached.machines.service";


@Controller("attached-machines")
export class AttachedMachinesController {
    constructor(
        private attachedMachinesService: AttachedMachinesService,
    ) { }

    @Get()
    async getAllAttachedMachinesByAgriculturalId(@Req() req: Request): Promise<GetAttachedMachinesDto[] | RequestResponse> {
        return this.attachedMachinesService.getAllAttachedMachinesByAgriculturalId(req);
    }

    @Get(":id")
    async getAttachedMachineById(@Param("id", ParseIntPipe) attachedMachineId: number, @Req() req: Request): Promise<GetAttachedMachinesDto | RequestResponse> {
        return this.attachedMachinesService.getAttachedMachineById(attachedMachineId, req);
    }

    @Put()
    async editAttachedMachineById(@Body() data: EditAttachedMachinesDto, @Req() req: Request): Promise<RequestResponse> {
        return this.attachedMachinesService.editAttachedMachineById(data, req);
    }

    @Post()
    async addNewAttachedMachine(@Body() data: AddAttachedMachinesDto, @Req() req: Request): Promise<RequestResponse> {
        return await this.attachedMachinesService.addNewAttachedMachine(data, req);
    }

    @Delete(":id")
    async deleteAttachedMachineById(@Param("id", ParseIntPipe) attachedMachineId: number, @Req() req: Request): Promise<RequestResponse> {
        return this.attachedMachinesService.deleteAttachedMachineById(attachedMachineId, req);
    }
}