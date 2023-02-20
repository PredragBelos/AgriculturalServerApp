import { Controller, Post, Body, Req } from "@nestjs/common";
import { Request } from "express";
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { AgriculturalHoldingService } from "src/service/agricultural_holding/agricultural.holding.service";
import { loginAgriculturalHoldingDtoTemplate, LoginAgriculturalHoldingDto } from "src/dto/agricultural_holding/login.agricultural.holding.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { AgriculturalHolding } from "src/entity/agricultural.holding.entity";
import { JwtDataAgriculturalHoldingDto } from "src/dto/agricultural_holding/jwt.data.agricultural.holding.dto";
import { jwtSecret } from "src/config/jwt.cofiguration";
import { LoginInfoAgriculturalHoldingDto } from "src/dto/agricultural_holding/login.info.agricultural.holding.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";

// Method for authentification on login
@Controller('agricultural-holding/auth')
export class AuthAgriculturalHoldingController {
    constructor(public agriculturalHoldingService: AgriculturalHoldingService) { }

    @Post("login")
    async login(@Body() loginData: LoginAgriculturalHoldingDto, @Req() req: Request): Promise<RequestResponse | LoginInfoAgriculturalHoldingDto> {
        // Validate data transfer object
        if (validateObjectPropertyType(loginData, loginAgriculturalHoldingDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Search agriculturalHolding by username
        const agriculturalHolding: AgriculturalHolding | null | RequestResponse = await this.agriculturalHoldingService.getByUsername(loginData);

        // Returning requestResponse when usernam does not exist and if search have a error
        if (agriculturalHolding === null) {
            return new RequestResponse(1051, "Username does not exist");
        }
        if (agriculturalHolding instanceof RequestResponse) {
            return agriculturalHolding;
        }

        // Transforming password from data to passwordHash
        const passwordHash = crypto.createHash('sha512').update(loginData.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        // Compare password hashes from loginData and database
        if (agriculturalHolding.passwordHash !== passwordHashString) { return new RequestResponse(1052, "Password is incorect") }
        else {
            // Crete jwtData object
            const jwtData: JwtDataAgriculturalHoldingDto = new JwtDataAgriculturalHoldingDto();
            jwtData.agriculturalHoldingId = agriculturalHolding.agriculturalHoldingId;
            jwtData.username = agriculturalHolding.username;
            jwtData.ip = req.ip;
            jwtData.ua = req.headers['user-agent'];

            // Create token
            let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

            // Create response object
            const responseObject: LoginInfoAgriculturalHoldingDto = new LoginInfoAgriculturalHoldingDto(
                agriculturalHolding.agriculturalHoldingId,
                agriculturalHolding.agriculturalHoldingName,
                agriculturalHolding.username,
                token
            );

            return responseObject;
        }
    }
}