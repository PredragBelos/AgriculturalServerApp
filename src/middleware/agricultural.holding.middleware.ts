import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { JwtDataAgriculturalHoldingDto } from "src/dto/agricultural_holding/jwt.data.agricultural.holding.dto";
import { RequestResponse } from "src/objects/response/request.response";
import { AgriculturalHoldingService } from "src/service/agricultural_holding/agricultural.holding.service";

@Injectable()
export class AgriculturalHoldingMiddleware implements NestMiddleware {
    constructor(private agriculturalHoldingService: AgriculturalHoldingService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        // Get token from request
        try {
            var token: undefined | string = req.headers.authorization;
        } catch (error) {
            throw new BadRequestException({ "code": 1080, "message": "Type of token data is not correct" });
        }

        // Checking token existing
        if (!token) { throw new BadRequestException({ "code": 1081, "message": "Token does not found" }); }

        // Token Validation
        try {
            // Decript token
            var jwtData: JwtDataAgriculturalHoldingDto = jwt.verify(token, jwtSecret);
        } catch (error) {
            throw new BadRequestException({ "code": 1082, "message": "Bad token" });
        }

        // Checking agricultural holding
        try {
            // Searching agricultural holding from database
            const agriculturalHolding = await this.agriculturalHoldingService.getById(jwtData.agriculturalHoldingId);
            if (agriculturalHolding === null || agriculturalHolding instanceof RequestResponse) {
                throw new BadRequestException({ "code": 1083, "message": "Agricultural holding not found" });
            }
        } catch (error) {
            throw new BadRequestException({ "code": 1084, "message": "Bad token" });
        }

        next();
    }
}