import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddAgriculturalHoldingDto, addAgriculturalHoldingDtoTemplate } from "src/dto/agricultural_holding/add.agricultural.holding.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { RequestResponse } from "src/objects/response/request.response";
import { AgriculturalHoldingService } from "src/service/agricultural_holding/agricultural.holding.service";

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

}