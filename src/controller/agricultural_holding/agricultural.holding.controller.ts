import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from "@nestjs/common";
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AddAgriculturalHoldingDto, addAgriculturalHoldingDtoTemplate } from "src/dto/agricultural_holding/add.agricultural.holding.dto";
import { AgriculturalHolding } from "src/entity/agricultural.holding.entity";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { RequestResponse } from "src/objects/response/request.response";
import { AgriculturalHoldingService } from "src/service/agricultural_holding/agricultural.holding.service";
import { GetAgriculturalHoldingDto } from "../../dto/agricultural_holding/get.agricultural.holding.dto";
import * as jwt from 'jsonwebtoken';
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

    // Method for getting agricultural holding by id
    @Get(":id")
    async getById(@Req() req: Request): Promise<GetAgriculturalHoldingDto | RequestResponse> {
        try {
            // Getting agricultural holding from token authorization
            const agriculturalHoldingId = jwt.verify(req.headers['authorization'], jwtSecret).agriculturalHoldingId;
            const agriculturalHolding = await this.agriculturalHoldingService.getById(agriculturalHoldingId);

            // Response if agricultural holding not exist
            if (agriculturalHolding === null || agriculturalHolding === undefined) {
                return new RequestResponse(1090, "Agricultural holding not exist");
            }
            // Response if service return error
            else if (agriculturalHolding instanceof RequestResponse) { return agriculturalHolding; }
            // Response if agricultural holding exist
            else if (agriculturalHolding instanceof AgriculturalHolding) {
                let result = new GetAgriculturalHoldingDto();
                result.address = agriculturalHolding.address;
                result.agriculturalHoldingId = agriculturalHolding.agriculturalHoldingId;
                result.agriculturalHoldingName = agriculturalHolding.agriculturalHoldingName;
                result.agriculturalHoldingNumber = agriculturalHolding.agriculturalHoldingNumber;
                result.city = agriculturalHolding.city;
                result.directorIdNum = agriculturalHolding.directorIdNum;
                result.directorName = agriculturalHolding.directorName;
                result.directorSurname = agriculturalHolding.directorSurname;
                result.email = agriculturalHolding.email;
                result.phone = agriculturalHolding.phone;
                result.zipNumber = agriculturalHolding.zipNumber;

                return result;
            }
            else {
                return new RequestResponse(1091, "Agricultural holding not exist");
            }
        } catch (error) {
            return new RequestResponse(1092, "Agricultural holding not exist");
        }
    }

    @Put(":id")
    async edit(@Param('id', ParseIntPipe) agriculturalHoldingId: number, @Body() data: EditAgriculturalHoldingDto): Promise<RequestResponse | GetAgriculturalHoldingDto> {
        return await this.agriculturalHoldingService.edit(agriculturalHoldingId, data);
    }

}