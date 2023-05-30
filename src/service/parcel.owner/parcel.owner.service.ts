import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddParcelOwnerDto, addParcelOwnerDtoTemplate } from "src/dto/parcel_owner/add.parcel.owner.dto";
import { ParcelOwner } from "src/entity/parcel.owner.entity";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { EditParcelOwnerDto, editParcelOwnerDtoTemplate } from "src/dto/parcel_owner/edit.parcel.owner.dto";
import { GetParcelOwnerDto } from "src/dto/parcel_owner/get.parcel.owner.dto";

@Injectable()
export class ParcelOwnersService {
    constructor(
        @InjectRepository(ParcelOwner) private readonly parcelOwners: Repository<ParcelOwner>
    ) { }

    // Service for adding parcel owner
    async addOwner(data: AddParcelOwnerDto, req: Request): Promise<RequestResponse> {
        // Validate data transfer object
        if (validateObjectPropertyType(data, addParcelOwnerDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2040, "Agricultural holding id can not get from token") }

        // Checking agriculturalHoldingId from data and token
        if (agriculturalHoldingIdFromToken !== data.agriculturalHoldingId) {
            return new RequestResponse(2041, "Agricultural holding id is not equal in data and token")
        }

        // Create object for new parcel owner
        let newParcelOwner = new ParcelOwner();
        newParcelOwner.address = data.address;
        newParcelOwner.agriculturalHoldingId = data.agriculturalHoldingId;
        newParcelOwner.city = data.city;
        newParcelOwner.email = data.email;
        newParcelOwner.identificationNumber = data.identificationNumber;
        newParcelOwner.note = data.note;
        newParcelOwner.ownerName = data.ownerName;
        newParcelOwner.ownerSurname = data.ownerSurname;
        newParcelOwner.phone = data.phone;
        newParcelOwner.zipNumber = data.zipNumber;

        try {
            await this.parcelOwners.save(newParcelOwner);
            return new RequestResponse(200, "Parcel owner was saved");
        } catch (error) {
            return new RequestResponse(2042, "Parcel owner was not saved");
        }
    }

    async editOwner(ownerId: number, data: EditParcelOwnerDto, req: Request): Promise<RequestResponse> {
        // Validate data transfer object
        if (validateObjectPropertyType(data, editParcelOwnerDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2043, "Agricultural holding id can not get from token") }

        // Checking agricultural holding id from body and token
        if (agriculturalHoldingIdFromToken !== data.agriculturalHoldingId) { return new RequestResponse(2044, "Agricultural holding id from body is not correct") };

        // Checking owner id from parameter and body data
        if (ownerId !== data.parcelOwnerId) { return new RequestResponse(2045, "Parcel owner id from parameter is not equal to id from body data") };

        // Find owner and edit data
        try {
            let curentOwner = await this.parcelOwners.findOne({ where: { parcelOwnersId: ownerId } });
            if (curentOwner !== null) {
                curentOwner.address = data.address;
                curentOwner.agriculturalHoldingId = data.agriculturalHoldingId;
                curentOwner.city = data.city;
                curentOwner.email = data.email;
                curentOwner.identificationNumber = data.identificationNumber;
                curentOwner.note = data.note;
                curentOwner.ownerName = data.ownerName;
                curentOwner.ownerSurname = data.ownerSurname;
                curentOwner.parcelOwnersId = data.parcelOwnerId;
                curentOwner.phone = data.phone;
                curentOwner.zipNumber = data.zipNumber;

                await this.parcelOwners.save(curentOwner);
                return new RequestResponse(200, "Parcel owners data was changed");
            }
            else {
                return new RequestResponse(2046, "Parcel owner can not be found");
            }
        } catch (error) {
            return new RequestResponse(2047, "Parcel owners data was not changed");
        }
    }

    async deleteOwner(ownerId: number, req: Request): Promise<RequestResponse> {

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2048, "Agricultural holding id can not get from token") }

        // Find owner from database
        try {
            const curentOwner = await this.parcelOwners.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingIdFromToken,
                    parcelOwnersId: ownerId
                }
            });

            if (curentOwner !== null) {
                await this.parcelOwners.remove(curentOwner);
                return new RequestResponse(200, "Parcel owner was deleted");
            }
            else { return new RequestResponse(2049, "Parcel owner can not be found") };
        } catch (error) {
            return new RequestResponse(200, "Parcel owner was not deleted");
        }
    }

    async getParcelOwnersByAgriculturalHolding(req: Request): Promise<RequestResponse | GetParcelOwnerDto[]> {
        let agriculturalHoldingId: number;
        let parcelOwnersArr: GetParcelOwnerDto[] = [];

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2041, "Agricultural holding id can not get from token") }

        // Search parcel owners drom database per agricultural holding id and create array
        try {
            const parcelsOwnersFromDatabase = await this.parcelOwners.find({ where: { agriculturalHoldingId: agriculturalHoldingId } });
            parcelsOwnersFromDatabase.forEach(parcelOwner => {
                let curentParcelOwner = new GetParcelOwnerDto();
                curentParcelOwner.address = parcelOwner.address;
                curentParcelOwner.city = parcelOwner.city;
                curentParcelOwner.email = parcelOwner.email;
                curentParcelOwner.identificationNumber = parcelOwner.identificationNumber;
                curentParcelOwner.note = parcelOwner.note;
                curentParcelOwner.ownerName = parcelOwner.ownerName;
                curentParcelOwner.ownerSurname = parcelOwner.ownerSurname;
                curentParcelOwner.parcelOwnerId = parcelOwner.parcelOwnersId;
                curentParcelOwner.phone = parcelOwner.phone;
                curentParcelOwner.zipNumber = parcelOwner.zipNumber;

                parcelOwnersArr.push(curentParcelOwner);
            })
        } catch (error) {
            return new RequestResponse(2042, "Parcels owners for this id can not be found");
        }

        if (parcelOwnersArr) { return parcelOwnersArr } else { return new RequestResponse(2043, 'Parcel owners arr can not be created') }
    }
}