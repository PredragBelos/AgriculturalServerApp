import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AttachedMachines } from "src/entity/attached.machines.entity";

@Injectable()
export class AttachedMachinesService {
    constructor(
        @InjectRepository(AttachedMachines) private readonly attachedMachines: Repository<AttachedMachines>,
    ) { }

}
