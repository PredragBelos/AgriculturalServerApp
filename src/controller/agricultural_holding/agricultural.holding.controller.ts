import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from "@nestjs/common";
import { AddAgriculturalHoldingDto, addAgriculturalHoldingDtoTemplate } from "src/dto/agricultural_holding/add.agricultural.holding.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { RequestResponse } from "src/objects/response/request.response";
import { AgriculturalHoldingService } from "src/service/agricultural_holding/agricultural.holding.service";
import { GetAgriculturalHoldingDto } from "../../dto/agricultural_holding/get.agricultural.holding.dto";
import { EditAgriculturalHoldingDto } from "src/dto/agricultural_holding/edit.agricultural.holding.dto";

@Controller("holding")
export class AgriculturalHoldingController {
    constructor(
        private agriculturalHoldingService: AgriculturalHoldingService,
    ) { }

    // Method for add new agricultural holding
    @Post()
    async add(@Body() data: AddAgriculturalHoldingDto): Promise<RequestResponse> {
        // Validate data transfer object
        if (validateObjectPropertyType(data, addAgriculturalHoldingDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        return await this.agriculturalHoldingService.add(data);
    }

    @Get(":id")
    async getAgriculturalHolding(@Param('id', ParseIntPipe) agriculturalHoldingId: number, @Req() req: Request): Promise<GetAgriculturalHoldingDto | RequestResponse> {
        return this.agriculturalHoldingService.getAgriculturalHolding(agriculturalHoldingId, req);
    }

    @Put(":id")
    async edit(@Param('id', ParseIntPipe) agriculturalHoldingId: number, @Body() data: EditAgriculturalHoldingDto): Promise<RequestResponse | GetAgriculturalHoldingDto> {
        return await this.agriculturalHoldingService.edit(agriculturalHoldingId, data);
    }

    @Delete(":id")
    async delete(@Param('id', ParseIntPipe) agriculturalHoldingId: number): Promise<RequestResponse> {
        return await this.agriculturalHoldingService.delete(agriculturalHoldingId);
    }

}