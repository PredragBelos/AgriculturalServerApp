import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ParcelDto } from "src/dto/parcel/parcels.dto";
import { Parcel } from "src/entity/parcel.entity";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { ParcelOwner } from "src/entity/parcel.owner.entity";
import { changeBooleanToNumber, changeNumberToBolean } from "src/functions/global.functions";
import { ParcelParcelOwner } from "src/entity/parcel.parcel.owner.entity";
import { ParcelOwnerDto } from "src/dto/parcel_owner/parcel.owner.dto";
import { ParcelParcelOwnerDto } from "src/dto/parcel_parcel_owner/parcel.parcel.owner.dto";
import { ParcelCoordinate } from "src/entity/parcel.coordinate.entity";
import { ParcelCoordinateDto } from "src/dto/parcel_coordinate/parcel.coordinate.dto";
import { AddParcelDto, addParcelDtoTemplate } from "src/dto/parcel/add.parcel.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { EditParcelDto, editParcelDtoTemplate } from "src/dto/parcel/edit.parcel.dto";

@Injectable()
export class ParcelService {
    constructor(
        @InjectRepository(Parcel) private readonly parcel: Repository<Parcel>,
        @InjectRepository(ParcelOwner) private readonly parcelOwner: Repository<ParcelOwner>,
        @InjectRepository(ParcelParcelOwner) private readonly parcelParcelOwner: Repository<ParcelParcelOwner>,
        @InjectRepository(ParcelCoordinate) private readonly parcelCoordinate: Repository<ParcelCoordinate>
    ) { }

    // Method for getting parcels for agricultural holding
    async getParcelsForAgriculturalHolding(agriculturalHoldingId: number, req: Request): Promise<RequestResponse | ParcelDto[]> {
        let parcelsArr: ParcelDto[] = [];
        let parcelOwnersArr: ParcelOwnerDto[] = [];
        let parcelParcelOwnerParameters: ParcelParcelOwnerDto[] = [];
        let parcelCoordinates: ParcelCoordinateDto[] = [];

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2016, "Agricultural holding id can not get from token") }

        // Checking match id from token and URL param
        if (agriculturalHoldingIdFromToken !== agriculturalHoldingId) { return new RequestResponse(2017, "Id from token and id from URL not match") }

        // Search parcels from database per agricultural holding id and create array
        try {
            const parcelsFromDatabase = await this.parcel.find({ where: { agriculturalHoldingId: agriculturalHoldingId } });
            parcelsFromDatabase.forEach(parcelFromDatabase => {
                let curentParcel = new ParcelDto();
                curentParcel.agriculturalHoldingId = parcelFromDatabase.agriculturalHoldingId;
                curentParcel.alternativeName = parcelFromDatabase.alternativeName;
                curentParcel.areaHectars = parcelFromDatabase.areaHectars;
                curentParcel.areaJutro = parcelFromDatabase.areaJutro;
                curentParcel.areaMeters = parcelFromDatabase.areaMeters;
                curentParcel.cadastralManicipalityId = parcelFromDatabase.cadastralManicipalityId;
                curentParcel.cadastralManicipalityName = parcelFromDatabase.cadastralManicipalityName;
                curentParcel.class = parcelFromDatabase.class;
                curentParcel.coordinates = [];
                curentParcel.manicipalityId = parcelFromDatabase.manicipalityId;
                curentParcel.manicipalityName = parcelFromDatabase.manicipalityName;
                curentParcel.owners = [];
                curentParcel.parcelId = parcelFromDatabase.parcelId;
                curentParcel.parcelName = parcelFromDatabase.parcelName;
                curentParcel.parcelNumber = parcelFromDatabase.parcelNumber;
                curentParcel.propertyOwnership = changeNumberToBolean(parcelFromDatabase.propertyOwnership);
                curentParcel.rent = parcelFromDatabase.rent;
                curentParcel.usableAreaMeters = parcelFromDatabase.usableAreaMeters;
                curentParcel.usableAreaHectars = parcelFromDatabase.usableAreaHectars;
                curentParcel.usableAreaJutro = parcelFromDatabase.usableAreaJutro;

                parcelsArr.push(curentParcel);
            })
        } catch (error) {
            return new RequestResponse(2018, "Parcels for this id can not be found");
        }

        // Search parcel owners from database and create array
        try {
            const parcelOwnersFromDatabase = await this.parcelOwner.find({ where: { agriculturalHoldingId: agriculturalHoldingId } });
            parcelOwnersFromDatabase.forEach(parcelOwnerFromDatabase => {
                let curentParcelOwner = new ParcelOwnerDto();
                curentParcelOwner.address = parcelOwnerFromDatabase.address;
                curentParcelOwner.city = parcelOwnerFromDatabase.city;
                curentParcelOwner.email = parcelOwnerFromDatabase.email;
                curentParcelOwner.identificationNumber = parcelOwnerFromDatabase.identificationNumber;
                curentParcelOwner.note = parcelOwnerFromDatabase.note;
                curentParcelOwner.ownerName = parcelOwnerFromDatabase.ownerName;
                curentParcelOwner.ownerSurname = parcelOwnerFromDatabase.ownerSurname;
                curentParcelOwner.phone = parcelOwnerFromDatabase.phone;
                curentParcelOwner.zipNumber = parcelOwnerFromDatabase.zipNumber;
                curentParcelOwner.parcelOwnerId = parcelOwnerFromDatabase.parcelOwnersId;

                parcelOwnersArr.push(curentParcelOwner);
            })
        } catch (error) {
            return new RequestResponse(2019, "Parcels owners can not be found");
        }

        // Create parcel parcel owners parameters array
        try {
            const parcelOwnerParameters = await this.parcelParcelOwner.find({ where: { agriculturalHoldingId: agriculturalHoldingId } })
            parcelOwnerParameters.forEach(parameter => {
                let curentParameter = new ParcelParcelOwnerDto();
                curentParameter.parcelId = parameter.parcelId;
                curentParameter.parcelOwnerId = parameter.parcelOwnerId;
                curentParameter.sharePercentage = parameter.sharePercentage;

                parcelParcelOwnerParameters.push(curentParameter);

            })
        } catch (error) {
            return new RequestResponse(2020, "Parcels owners parameters can not be created");
        }

        // Search parcel coordinates and create array
        try {
            const parcelCoordinatesFromDatabase = await this.parcelCoordinate.find({ where: { agriculturalHoldingId: agriculturalHoldingId } })
            parcelCoordinatesFromDatabase.forEach(coordinate => {
                let curentCoordinate = new ParcelCoordinateDto();
                curentCoordinate.parcelId = coordinate.parcelId;
                curentCoordinate.xCoordinate = coordinate.xCoordinate;
                curentCoordinate.yCoordinate = coordinate.yCoordinate;

                parcelCoordinates.push(curentCoordinate);
            })

        } catch (error) {
            return new RequestResponse(2021, "Parcels coordinates can not be found");
        }

        // Fill parcel owners
        parcelsArr.forEach(parcel => {
            parcelParcelOwnerParameters.forEach(parameter => {
                if (parcel.parcelId === parameter.parcelId) {
                    let curentOwner = parcelOwnersArr.filter(parcelOwner => { return parcelOwner.parcelOwnerId === parameter.parcelOwnerId; })[0];

                    parcel.owners.push(curentOwner);
                }
            })
        });

        // Fill parcel coordinates
        parcelsArr.forEach(parcel => {
            parcelCoordinates.forEach(coordinate => {
                if (parcel.parcelId === coordinate.parcelId) {
                    parcel.coordinates.push(coordinate);
                }
            })
        })

        return parcelsArr;
    }

    async getParcelById(parcelId: number, req: Request): Promise<RequestResponse | ParcelDto> {
        let parcel: ParcelDto;
        let ownersIdArr: number[] = [];

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2016, "Agricultural holding id can not get from token") }

        // Find parcel to databse
        try {
            const parcelFromDatabase = await this.parcel.findOne({ where: { parcelId: parcelId } });
            if (parcelFromDatabase) {
                let parcelToSend = new ParcelDto();
                parcelToSend.agriculturalHoldingId = parcelFromDatabase.agriculturalHoldingId;
                parcelToSend.alternativeName = parcelFromDatabase.alternativeName;
                parcelToSend.areaHectars = parcelFromDatabase.areaHectars;
                parcelToSend.areaJutro = parcelFromDatabase.areaJutro;
                parcelToSend.areaMeters = parcelFromDatabase.areaMeters;
                parcelToSend.cadastralManicipalityId = parcelFromDatabase.cadastralManicipalityId;
                parcelToSend.cadastralManicipalityName = parcelFromDatabase.cadastralManicipalityName;
                parcelToSend.class = parcelFromDatabase.class;
                parcelToSend.coordinates = [];
                parcelToSend.manicipalityId = parcelFromDatabase.manicipalityId;
                parcelToSend.manicipalityName = parcelFromDatabase.manicipalityName;
                parcelToSend.owners = [];
                parcelToSend.parcelId = parcelFromDatabase.parcelId;
                parcelToSend.parcelName = parcelFromDatabase.parcelName;
                parcelToSend.parcelNumber = parcelFromDatabase.parcelNumber;
                parcelToSend.propertyOwnership = changeNumberToBolean(parcelFromDatabase.propertyOwnership);
                parcelToSend.rent = parcelFromDatabase.rent;
                parcelToSend.usableAreaMeters = parcelFromDatabase.usableAreaMeters;
                parcelToSend.usableAreaHectars = parcelFromDatabase.usableAreaHectars;
                parcelToSend.usableAreaJutro = parcelFromDatabase.usableAreaJutro;

                parcel = parcelToSend;
            }
        } catch (error) {
            return new RequestResponse(2022, "Parcel can not be found");
        }

        // Check that parcel exist in agricultural holding
        if (parcel.agriculturalHoldingId !== agriculturalHoldingIdFromToken) {
            return new RequestResponse(2026, "Request for this parcel is not advalible for this agricultural holding");
        }

        // Fill parcelowners array
        try {
            const ownersId = await this.parcelParcelOwner.find({ where: { parcelId: parcel.parcelId } });
            ownersId.forEach(item => {
                ownersIdArr.push(item.parcelOwnerId);
            })
        } catch (error) {
            return new RequestResponse(2023, "Parcel owners id can not be found");
        }

        // Search parcel owners
        try {
            const parcelOwners = await this.parcelOwner.find({ where: { agriculturalHoldingId: parcel.agriculturalHoldingId } });
            parcelOwners.forEach(owner => {
                ownersIdArr.forEach(ownerId => {
                    if (owner.parcelOwnersId === ownerId) {
                        let curentOwner = new ParcelOwnerDto();
                        curentOwner.address = owner.address;
                        curentOwner.city = owner.city;
                        curentOwner.email = owner.email;
                        curentOwner.identificationNumber = owner.identificationNumber;
                        curentOwner.note = owner.note;
                        curentOwner.ownerName = owner.ownerName;
                        curentOwner.ownerSurname = owner.ownerSurname;
                        curentOwner.parcelOwnerId = owner.parcelOwnersId;
                        curentOwner.phone = owner.phone;
                        curentOwner.zipNumber = owner.zipNumber;

                        parcel.owners.push(curentOwner);
                    }
                })
            })
        } catch (error) {
            return new RequestResponse(2024, "Parcel owners can not be added");
        }

        // Adding parcel coordinates
        try {
            const parcelCoordinates = await this.parcelCoordinate.find({ where: { parcelId: parcel.parcelId } });
            parcelCoordinates.forEach(coordinate => {
                let curentCoordinate = new ParcelCoordinateDto();
                curentCoordinate.parcelId = coordinate.parcelId;
                curentCoordinate.xCoordinate = coordinate.xCoordinate;
                curentCoordinate.yCoordinate = coordinate.yCoordinate;

                parcel.coordinates.push(curentCoordinate);
            })
        } catch (error) {
            return new RequestResponse(2025, "Parcel coordinates can not be added");
        }

        return parcel
    }

    async addParcel(data: AddParcelDto): Promise<RequestResponse> {
        // Validate data transfer object
        if (validateObjectPropertyType(data, addParcelDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Check if parcel exist in agricultural holding
        try {
            var parcelChecker = await this.parcel.findOne({
                where: {
                    agriculturalHoldingId: data.agriculturalHoldingId,
                    manicipalityId: data.manicipalityId,
                    cadastralManicipalityId: data.cadastralManicipalityId,
                    parcelNumber: data.parcelNumber
                }
            });
            if (parcelChecker !== null) { return new RequestResponse(2027, "Parcel exist") }
        } catch (error) {
            return new RequestResponse(2028, "Parcel can not be checked");
        }

        // Create object for send to database
        let newParcel = {
            agriculturalHoldingId: data.agriculturalHoldingId,
            manicipalityId: data.manicipalityId,
            manicipalityName: data.manicipalityName,
            cadastralManicipalityId: data.cadastralManicipalityId,
            cadastralManicipalityName: data.cadastralManicipalityName,
            parcelNumber: data.parcelNumber,
            parcelName: data.parcelName,
            alternativeName: data.alternativeName,
            areaMeters: data.areaMeters,
            areaHectars: (data.areaMeters / 10000),
            areaJutro: (data.areaMeters / 10000) * (1 / (5754.64 / 10000)),
            usableAreaMeters: data.usableAreaMeters,
            usableAreaHectars: (data.usableAreaMeters / 10000),
            usableAreaJutro: (data.usableAreaMeters / 10000) * (1 / (5754.64 / 10000)),
            class: data.class,
            propertyOwnership: changeBooleanToNumber(data.propertyOwnership),
            rent: data.rent,
        }

        // Save new parcel to database
        try {
            this.parcel.save(newParcel);
            return new RequestResponse(200, "Parcel was saved");
        } catch (error) {
            return new RequestResponse(2029, "Parcel was not saved");
        }
    }

    async editParcel(parcelId: number, data: EditParcelDto, req: Request): Promise<RequestResponse> {

        // Validate data transfer object
        if (validateObjectPropertyType(data, editParcelDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2030, "Agricultural holding id can not get from token") }

        // Search parcel to database
        try {
            var curentParcel = await this.parcel.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingIdFromToken,
                    parcelId: parcelId,
                }
            });

        } catch (error) {
            return new RequestResponse(2031, "Parcel can not be found");
        }

        if (curentParcel) {
            curentParcel.agriculturalHoldingId = agriculturalHoldingIdFromToken;
            curentParcel.alternativeName = data.alternativeName;
            curentParcel.areaHectars = (data.areaMeters / 10000);
            curentParcel.areaJutro = (data.areaMeters / 10000) * (1 / (5754.64 / 10000));
            curentParcel.areaMeters = data.areaMeters;
            curentParcel.cadastralManicipalityId = data.cadastralManicipalityId;
            curentParcel.cadastralManicipalityName = data.cadastralManicipalityName;
            curentParcel.class = data.class;
            curentParcel.manicipalityId = data.manicipalityId;
            curentParcel.manicipalityName = data.manicipalityName;
            curentParcel.parcelName = data.parcelName;
            curentParcel.parcelNumber = data.parcelNumber;
            curentParcel.propertyOwnership = changeBooleanToNumber(data.propertyOwnership);
            curentParcel.rent = data.rent;
            curentParcel.usableAreaHectars = (data.usableAreaMeters / 10000);
            curentParcel.usableAreaJutro = (data.usableAreaMeters / 10000) * (1 / (5754.64 / 10000));
            curentParcel.usableAreaMeters = data.usableAreaMeters;

            try {
                await this.parcel.save(curentParcel);
                return new RequestResponse(200, "Parcel data was changed");
            } catch (error) {
                return new RequestResponse(2032, "Parcel datas can not changed")
            }
        }
    }

    async deleteParcel(parcelId: number, req: Request): Promise<RequestResponse> {

        // Getting agricultural holding id from token authorization
        try { var agriculturalHoldingIdFromToken = jwt.verify(req.headers["authorization"], jwtSecret).agriculturalHoldingId; }
        catch (error) { return new RequestResponse(2033, "Agricultural holding id can not get from token") }

        // Find parcel
        try {
            var curentParcel = await this.parcel.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingIdFromToken,
                    parcelId: parcelId,
                }
            })
        } catch (error) {
            return new RequestResponse(2034, "Parcel can not be found");
        }

        // Delete parcel
        try {
            if (curentParcel !== null) {
                await this.parcel.remove(curentParcel);
                return new RequestResponse(200, "Parcel was delete");
            }
            else {
                return new RequestResponse(2036, "Parcel don't exist");
            }

        } catch (error) {
            return new RequestResponse(2035, "Parcel was not deleted");
        }
    }
}
