import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AttachedVehicles } from "src/entity/attached.vehicles.entity";

@Injectable()
export class AttachedVehiclesService {
    constructor(
        @InjectRepository(AttachedVehicles) private readonly attachedVehicles: Repository<AttachedVehicles>,
    ) { }

}
