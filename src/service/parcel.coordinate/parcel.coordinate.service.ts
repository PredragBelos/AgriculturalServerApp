import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddParcelCoordinateDto } from "src/dto/parcel_coordinate/add.parcel.coordinate.dto";
import { ReturnParcelCoordinateDto } from "src/dto/parcel_coordinate/return.parcel.coordinate.dto";
import { ParcelCoordinate } from "src/entity/parcel.coordinate.entity";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "src/config/jwt.cofiguration";


@Injectable()
export class ParcelCoordinateService {
    constructor(
        @InjectRepository(ParcelCoordinate) private readonly parcelCoordinate: Repository<ParcelCoordinate>
    ) { }

    // Function for adding parcel coordinates
    async addCoordinates(parcelId: number, data: AddParcelCoordinateDto[], req: Request): Promise<RequestResponse | ReturnParcelCoordinateDto> {
        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2055, "Agricultural holding id can not get from token") }

        // Checking parcels data
        let checker = false;
        data.forEach(parcelCoordinate => {
            if (parcelCoordinate.parcelId !== parcelId) {
                checker = true;
            }
        });

        if (checker) { return new RequestResponse(2056, "Coordinate is not for this parcel") };

        // Find all coordinates for parcel and delete it
        try {
            const existingParcelsCoordinate = await this.parcelCoordinate.find({
                where: {
                    agriculturalHoldingId: agriculturalHoldingIdFromToken,
                    parcelId: parcelId,
                }
            });

            // Remove existing coordinates
            existingParcelsCoordinate.forEach(async coordinate => {
                await this.parcelCoordinate.remove(coordinate);
            })
        } catch (error) {
            return new RequestResponse(2057, "Coordinates can not be found");
        }

        // Add new coordinates to database
        let coordinateArr: AddParcelCoordinateDto[] = [];

        data.forEach(coordinate => {
            let newCoordinate = new AddParcelCoordinateDto();
            newCoordinate.agriculturalHoldingId = agriculturalHoldingIdFromToken;
            newCoordinate.parcelId = parcelId;
            newCoordinate.xCoordinate = coordinate.xCoordinate;
            newCoordinate.yCoordinate = coordinate.yCoordinate;

            coordinateArr.push(newCoordinate);
        });

        try {
            coordinateArr.forEach(async coordinate => {
                await this.parcelCoordinate.save(coordinate);
            });
        } catch (error) {
            return new RequestResponse(2058, "Coordinates can not be added");
        }

        return new RequestResponse(200, "Coordinates are added");
    }
}