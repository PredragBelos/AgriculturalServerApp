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
import { CheckAgriculturalHoldingStatusDto } from "src/dto/agricultural_holding/check.agricultural.holding.status.dto";

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
            return new RequestResponse(1071, "Username or password is incorect");
        }
        if (agriculturalHolding instanceof RequestResponse) {
            return agriculturalHolding;
        }
        if (agriculturalHolding === undefined) {
            return new RequestResponse(1072, "Username or password is incorect");
        }

        // Transforming password from data to passwordHash
        const passwordHash = crypto.createHash('sha512').update(loginData.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        // Compare password hashes from loginData and database
        if (agriculturalHolding.passwordHash !== passwordHashString) { return new RequestResponse(1073, "Username or password is incorect") }
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
                token
            );

            return responseObject;
        }
    }

    @Post("status")
    async checkStatus(@Body() data: CheckAgriculturalHoldingStatusDto): Promise<boolean> {
        try {
            // Getting agricultural holding id from token
            const agriculturalHoldingId = jwt.verify(data.token, jwtSecret).agriculturalHoldingId;

            // Search agricultural holding by id
            const agriculturalHolding = await this.agriculturalHoldingService.getById(agriculturalHoldingId);

            if (agriculturalHolding === null || agriculturalHolding instanceof RequestResponse) { return false }
            else {
                if ((agriculturalHolding.agriculturalHoldingId !== data.agriculturalHoldingId) || (agriculturalHolding.agriculturalHoldingName !== data.agriculturalHoldingName)) { return false }
                else { return true; }
            }
        } catch (error) {
            return false;
        }
    }
}