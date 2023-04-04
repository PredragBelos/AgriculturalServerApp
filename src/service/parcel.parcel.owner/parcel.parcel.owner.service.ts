import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ParcelParcelOwner } from "src/entity/parcel.parcel.owner.entity";
import { Repository } from "typeorm";

@Injectable()
export class ParcelParcelOwnerService {
    constructor(
        @InjectRepository(ParcelParcelOwner) private readonly parcel: Repository<ParcelParcelOwner>,
    ) { }
}