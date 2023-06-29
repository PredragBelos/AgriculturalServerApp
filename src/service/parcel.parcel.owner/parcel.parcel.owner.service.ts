import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AddParcelParcelOwnerDto, AddParcelParcelOwnerDtoTemplate } from "src/dto/parcel_parcel_owner/add.parcel.parcel.owner.dto";
import { ParcelParcelOwner } from "src/entity/parcel.parcel.owner.entity";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { DelleteParcelParcelOwnerDto } from "src/dto/parcel_parcel_owner/dellete.parcel.parcel.owner.dto";
import { time } from "console";

type ChangeOwnersParameters = {
    ownersData: AddParcelParcelOwnerDto[],
    ownersNoData: DelleteParcelParcelOwnerDto[],
}

@Injectable()
export class ParcelParcelOwnerService {
    constructor(
        @InjectRepository(ParcelParcelOwner) private readonly parcelParcelOwner: Repository<ParcelParcelOwner>,
    ) { }

    // Service for fill parcel owners table when data object contains parcel owner details
    async fillOwnersTable(data: ChangeOwnersParameters, req: Request): Promise<RequestResponse> {

        let agriculturalHoldingIdFromToken: number;
        let parcelIdFromData: number = data.ownersData[0].parcelId;
        let parcelParcelOwnerFromDatabase: ParcelParcelOwner[];
        let filteredParcelParcelOwner: AddParcelParcelOwnerDto[];

        // Function for find all parcelparcelowners by parcel id
        async function findOwnerFromDatabase(parcelParcelOwner: Repository<ParcelParcelOwner>) {
            parcelParcelOwnerFromDatabase = await parcelParcelOwner.find({ where: { parcelId: parcelIdFromData } });
        }

        // Function for deleting all parcel parcel owners by parcel id
        async function deleteOwnerFromDatabase(parcelParcelOwnerFromDatabase: ParcelParcelOwner[], parcelParcelOwner: Repository<ParcelParcelOwner>) {
            for (let i = 0; i < parcelParcelOwnerFromDatabase.length; i++) {
                const parcel = parcelParcelOwnerFromDatabase[i];
                await parcelParcelOwner.delete(parcel);
            }
        }

        // Function for save all new parcel parcel owners to database
        async function saveNewParcelOwners(data: ChangeOwnersParameters, parcelParcelOwner: Repository<ParcelParcelOwner>) {
            for (let i = 0; i < data.ownersData.length; i++) {
                const parcel = data.ownersData[i];
                await parcelParcelOwner.save(parcel);
            }
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data.ownersData, AddParcelParcelOwnerDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2200, "Agricultural holding id can not get from token") }

        // Checking agriculturalHoldingId from data and token
        for (let i = 0; i < data.ownersData.length; i++) {
            let parcelparcelOwnerData = data.ownersData[i];

            // Checking agricultural holding id from different 
            if (agriculturalHoldingIdFromToken !== parcelparcelOwnerData.agriculturalHoldingId) {
                return new RequestResponse(2201, "Agricultural holding id is not equal in data and token");
            }
        }

        // Checking parcelId number from data
        try {
            filteredParcelParcelOwner = data.ownersData.filter(item => { return item.parcelId === data.ownersData[0].parcelId });
            if (filteredParcelParcelOwner.length < data.ownersData.length) {
                return new RequestResponse(2202, "Items from data don't have equal parcelId");
            }
        }
        catch (error) { return new RequestResponse(2203, 'Data for parcelParcelOwner can not be filtered') }

        // Checking duplicate on data array
        try {
            let duplicateIndex: number = 0;

            for (let i = 0; i < data.ownersData.length; i++) {
                for (let j = 0; j < data.ownersData.length; j++) {
                    if (i !== j) {
                        if (data.ownersData[i].parcelId === data.ownersData[j].parcelId && data.ownersData[i].parcelOwnerId === data.ownersData[j].parcelOwnerId) {
                            duplicateIndex = 1;
                            break;
                        }
                    }
                }
                break;
            }
            if (duplicateIndex === 1) { return new RequestResponse(2024, 'Data objects have duplicates') }
        } catch (error) {
            return new RequestResponse(2025, 'Error on find duplicates')
        }

        // Find all parcel owners by parcelId
        try { await findOwnerFromDatabase(this.parcelParcelOwner); }
        catch (error) { return new RequestResponse(2205, "Service can not find all parcel parcel owners from database"); }

        // Delete all parcel owners by parcelId
        try { await deleteOwnerFromDatabase(parcelParcelOwnerFromDatabase, this.parcelParcelOwner); }
        catch (error) { return new RequestResponse(2206, "Service can not delete all parcel parcel owners from database"); }

        // Save new parcel owners to database
        try {
            await saveNewParcelOwners(data, this.parcelParcelOwner);
            return new RequestResponse(200, "Parcel owners add sucsesseful");
        }
        catch (error) { return new RequestResponse(2207, "Service can not save new parcel parcel owners from database"); }
    }

    // Service for delleting all parcels owners by parcelId
    async delleteParcelOwnersByParcelId(data: ChangeOwnersParameters, req: Request): Promise<RequestResponse> {

        let agriculturalHoldingIdFromToken: number;

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2300, "Agricultural holding id can not get from token") }

        // Checking agriculturalHoldingId from data and token
        try {
            for (let i = 0; i < data.ownersNoData.length; i++) {
                let agriculturalHoldingIdFromData = data.ownersNoData[i].agriculturalHoldingId;

                if (agriculturalHoldingIdFromToken !== agriculturalHoldingIdFromData) {
                    return new RequestResponse(2301, "Agricultural holding id is not equal in data and token");
                }
                break;
            }
        } catch (error) { return new RequestResponse(2302, 'Checking agricultural holding id can not be execute'); }

        // Deleting all parcel owners from table
        try {
            let parcelOwnersFromDatabse = await this.parcelParcelOwner.find({ where: { parcelId: data.ownersNoData[0].parcelId } });

            // Delete parcel owners from database
            for(let i = 0; i < parcelOwnersFromDatabse.length; i++) {
                const owner = parcelOwnersFromDatabse[i];
                await this.parcelParcelOwner.remove(owner)
            }
            return new RequestResponse(200, 'Parcel owners are saved');
        } catch (error) {
            return new RequestResponse(2304, 'Parcel owners can not be deleted');
        }
    }
}

