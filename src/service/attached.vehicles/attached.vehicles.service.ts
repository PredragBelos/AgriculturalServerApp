import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AttachedVehicles } from "src/entity/attached.vehicles.entity";
import { GetAttachedVehiclesDto } from "src/dto/attached_vehicles/get.attached.vehicles.dto";
import { getAgriculturalHoldingId } from "src/functions/global.functions";
import { EditAttachedVehiclesDto, editAttachedVehiclesDtoTemplate } from "src/dto/attached_vehicles/edit.attached.vehicles.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { AddAttachedVehiclesDto, addAttachedVehiclesDtoTemplate } from "src/dto/attached_vehicles/add.attached.vehicles.dto";
import { Vehicles } from "src/entity/vehicles.entity";

@Injectable()
export class AttachedVehiclesService {
    constructor(
        @InjectRepository(AttachedVehicles) private readonly attachedVehicles: Repository<AttachedVehicles>,
    ) { }

    // Service for getting all attached vehicles for agricultural holding
    async getAllAttachedVehiclesByAgriculturalId(req: Request): Promise<GetAttachedVehiclesDto[] | RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedVehiclesArr: GetAttachedVehiclesDto[] = [];
        let vehiclesFromDatabase: AttachedVehicles[];

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(2900, "Agricultural holding id can not get from token") }

        // Find vehicles for agricultural holding in database
        try { vehiclesFromDatabase = await this.attachedVehicles.find({ where: { agriculturalHoldingId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(2901, "Attached vehicles can not be found in database") }

        // Set vehicles array for returning
        try {
            vehiclesFromDatabase.forEach(vehicle => {
                let newAttachedVehicle = new GetAttachedVehiclesDto();

                newAttachedVehicle.agriculturalHoldingId = vehicle.agriculturalHoldingId;
                newAttachedVehicle.attachedVehiclesId = vehicle.attachedVehiclesId;
                newAttachedVehicle.garageNumber = vehicle.garageNumber;
                newAttachedVehicle.mark = vehicle.mark;
                newAttachedVehicle.model = vehicle.model;
                newAttachedVehicle.registrationNumber = vehicle.registrationNumber;
                newAttachedVehicle.status = transformNumberToBoolean(vehicle.status);
                newAttachedVehicle.type = vehicle.type;
                newAttachedVehicle.vinNumber = vehicle.vinNumber;

                // Add new vehicle to vehicle array
                attachedVehiclesArr.push(newAttachedVehicle);
            });

            // Return vehicle array to controller
            return attachedVehiclesArr;
        } catch (error) {
            return new RequestResponse(2902, "Attached vehicles can not be returned")
        }
    }

    // Service for getting one attached vehicle for agricultural holding
    async getAttachedVehicleById(attachedVehicleId: number, req: Request): Promise<GetAttachedVehiclesDto | RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedVehicleFromDatabase: AttachedVehicles;

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(3000, "Agricultural holding id can not get from token") };

        // Find vehicles for agricultural holding in database
        try { attachedVehicleFromDatabase = await this.attachedVehicles.findOne({ where: { attachedVehiclesId: attachedVehicleId, agriculturalHoldingId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(3001, "Attached vehicle can not be found in database") }

        // Set vehicle for returning
        try {
            if (attachedVehicleFromDatabase) {
                let curentVehicle = new GetAttachedVehiclesDto();
                curentVehicle.agriculturalHoldingId = attachedVehicleFromDatabase.agriculturalHoldingId;
                curentVehicle.attachedVehiclesId = attachedVehicleFromDatabase.attachedVehiclesId;
                curentVehicle.garageNumber = attachedVehicleFromDatabase.garageNumber;
                curentVehicle.mark = attachedVehicleFromDatabase.mark;
                curentVehicle.model = attachedVehicleFromDatabase.model;
                curentVehicle.registrationNumber = attachedVehicleFromDatabase.registrationNumber;
                curentVehicle.status = transformNumberToBoolean(attachedVehicleFromDatabase.status);
                curentVehicle.type = attachedVehicleFromDatabase.type;
                curentVehicle.vinNumber = attachedVehicleFromDatabase.vinNumber;

                return curentVehicle;
            }
            else { return new RequestResponse(3002, "Attached vehicle do not exist") }
        } catch (error) {
            return new RequestResponse(3003, "Attached vehicle can not be returned");
        }
    }

    // Service for editing one attached vehicle by id
    async editAttachedVehicleById(data: EditAttachedVehiclesDto, req: Request): Promise<RequestResponse | GetAttachedVehiclesDto> {
        let agriculturalHoldingId: number;
        let attachedVehicleFromDatabase: AttachedVehicles;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, editAttachedVehiclesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(3100, "Agricultural holding id can not get from token") };

        // Get attached vehicles from database
        try {
            attachedVehicleFromDatabase = await this.attachedVehicles.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    attachedVehiclesId: data.attachedVehiclesId
                }
            });
            if (!attachedVehicleFromDatabase || data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(3101, "Attached vehicle do not exist");
            };
        } catch (error) {
            return new RequestResponse(3102, "Attached vehicle can not find");
        }

        // Create custom vehicle for editing data
        try {
            let curentVehicle = new AttachedVehicles();

            curentVehicle.agriculturalHoldingId = attachedVehicleFromDatabase.agriculturalHoldingId;
            curentVehicle.garageNumber = attachedVehicleFromDatabase.garageNumber;
            curentVehicle.attachedVehiclesId = attachedVehicleFromDatabase.attachedVehiclesId;
            curentVehicle.mark = data.mark;
            curentVehicle.model = data.model;
            curentVehicle.registrationNumber = data.registrationNumber;
            curentVehicle.status = transformBooleanNumberTo(data.status);
            curentVehicle.type = data.type;
            curentVehicle.vinNumber = data.vinNumber;

            this.attachedVehicles.save(curentVehicle);

            // Create getAttachedVehicleDto for returning
            let attachedVehicleForReturning = new GetAttachedVehiclesDto();
            attachedVehicleForReturning.agriculturalHoldingId = curentVehicle.agriculturalHoldingId;
            attachedVehicleForReturning.attachedVehiclesId = curentVehicle.attachedVehiclesId;
            attachedVehicleForReturning.garageNumber = curentVehicle.garageNumber;
            attachedVehicleForReturning.mark = curentVehicle.mark;
            attachedVehicleForReturning.model = curentVehicle.model;
            attachedVehicleForReturning.registrationNumber = curentVehicle.registrationNumber;
            attachedVehicleForReturning.status = transformNumberToBoolean(curentVehicle.status);
            attachedVehicleForReturning.type = curentVehicle.type;
            attachedVehicleForReturning.vinNumber = curentVehicle.vinNumber;

            return attachedVehicleForReturning;
        } catch (error) {
            return new RequestResponse(3103, "Attached vehicle can not be edited");
        }
    }

    // Service for adding new attached vehicle to database
    async addNewAttachedVehicle(data: AddAttachedVehiclesDto, req: Request): Promise<RequestResponse | GetAttachedVehiclesDto[]> {
        let agriculturalHoldingId: number;
        let newAttachedVehicle: AttachedVehicles;
        let newGarageNumber: number = -1;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, addAttachedVehiclesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(3200, "Agricultural holding id can not get from token") };

        // Checking agricultural holding id from data and token
        try {
            if (data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(3201, "Agricultural holding id from data is not corect");
            }
        } catch (error) {
            return new RequestResponse(3202, "Checking agricultural holding id from data is not possible");
        }

        // Set garage number for new vehicle
        try {
            let attachedVehicles = await this.attachedVehicles.find({ where: { agriculturalHoldingId: data.agriculturalHoldingId } });

            // Find largest garage number
            attachedVehicles.forEach(attachedVehicle => { if (attachedVehicle.garageNumber > newGarageNumber) { newGarageNumber = attachedVehicle.garageNumber; } })

            // Set new garage number
            newGarageNumber = newGarageNumber + 1;
        } catch (error) {
            return new RequestResponse(3203, "Garage number can not be created");
        }

        // Add new vehicle
        try {
            newAttachedVehicle = new AttachedVehicles();

            newAttachedVehicle.agriculturalHoldingId = data.agriculturalHoldingId;
            newAttachedVehicle.garageNumber = newGarageNumber;
            newAttachedVehicle.mark = data.mark;
            newAttachedVehicle.model = data.model;
            newAttachedVehicle.registrationNumber = data.registrationNumber;
            newAttachedVehicle.status = transformBooleanNumberTo(data.status);
            newAttachedVehicle.type = data.type;
            newAttachedVehicle.vinNumber = data.vinNumber;

            await this.attachedVehicles.save(newAttachedVehicle);

            // Get all attached vehicles from database
            let attachedVehicles: AttachedVehicles[] = await this.attachedVehicles.find({ where: { agriculturalHoldingId: agriculturalHoldingId } });

            // Create attached vehicles response array
            let attached_vehicles_for_return: GetAttachedVehiclesDto[] = [];

            // Fill attached vehicle for return array
            attachedVehicles.forEach(vehicle => {
                let newAttachedVehicle = new GetAttachedVehiclesDto();
                newAttachedVehicle.agriculturalHoldingId = vehicle.agriculturalHoldingId;
                newAttachedVehicle.attachedVehiclesId = vehicle.attachedVehiclesId;
                newAttachedVehicle.garageNumber = vehicle.garageNumber;
                newAttachedVehicle.mark = vehicle.mark;
                newAttachedVehicle.model = vehicle.model;
                newAttachedVehicle.registrationNumber = vehicle.registrationNumber;
                newAttachedVehicle.status = transformNumberToBoolean(vehicle.status);
                newAttachedVehicle.type = vehicle.type;
                newAttachedVehicle.vinNumber = vehicle.vinNumber;

                // Add new attached vehicle to attached vehicle array
                attached_vehicles_for_return.push(newAttachedVehicle);
            })

            return attached_vehicles_for_return;
        } catch (error) {
            return new RequestResponse(3204, "Attached vehicle was not added");
        }
    }

    // Service for deleting attached vehicle from database
    async deleteAttachedVehicleById(attachedVehicleId: number, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedVehicleFromDatabase: AttachedVehicles;

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(3300, "Agricultural holding id can not get from token") };

        // Check that vehicle exist in database
        try {
            attachedVehicleFromDatabase = await this.attachedVehicles.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    attachedVehiclesId: attachedVehicleId
                }
            });
            if (!attachedVehicleFromDatabase) { return new RequestResponse(3301, "Attached vehicle do not exist in database") }
        } catch (error) {
            return new RequestResponse(3302, "Checking attached vehicle to database is not possible");
        }

        // Delete vehicle from database
        try {
            if (attachedVehicleFromDatabase) {
                await this.attachedVehicles.remove(attachedVehicleFromDatabase);
                return new RequestResponse(200, "Attached vehicle was deleted");
            }
        } catch (error) {
            return new RequestResponse(3303, "Attached vehicle can not be deleted");
        }
    }
}
