import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ParcelCoordinate } from "src/entity/parcel.coordinate.entity";
import { Repository } from "typeorm";

@Injectable()
export class ParcelCoordinateService {
    constructor(
        @InjectRepository(ParcelCoordinate) private readonly parcelCoordinate: Repository<ParcelCoordinate>
    ) { }
}