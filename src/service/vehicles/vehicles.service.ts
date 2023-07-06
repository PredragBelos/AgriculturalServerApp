import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import { Vehicles } from "src/entity/vehicles.entity";
import { GetVehiclesDto } from "src/dto/vehicles/get.vehicles.dto";
import { getAgriculturalHoldingId } from "src/functions/global.functions";
import { EditVehiclesDto, editVehiclesDtoTemplate } from "src/dto/vehicles/edit.vehicles.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { AddVehiclesDto, addVehiclesDtoTemplate } from "src/dto/vehicles/add.vehicles.dto";

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(Vehicles) private readonly vehicles: Repository<Vehicles>,
    ) { }

    // Service for getting all vehicles for agricultural holding
    async getAllVehiclesByAgriculturalId(req: Request): Promise<GetVehiclesDto[] | RequestResponse> {
        let agriculturalHoldingId: number;
        let vehiclesArr: GetVehiclesDto[] = [];
        let vehiclesFromDatabase: Vehicles[];

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(2400, "Agricultural holding id can not get from token") }

        // Find vehicles for agricultural holding in database
        try { vehiclesFromDatabase = await this.vehicles.find({ where: { agriculturalHoldingId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(2401, "Vehicles can not be found in database") }

        // Set vehicles array for returning
        try {
            vehiclesFromDatabase.forEach(vehicle => {
                let newVehicle = new GetVehiclesDto();
                newVehicle.agriculturalHoldingId = vehicle.agriculturalHoldingId;
                newVehicle.garageNumber = vehicle.garageNumber;
                newVehicle.mark = vehicle.mark;
                newVehicle.model = vehicle.model;
                newVehicle.registrationNumber = vehicle.registrationNumber;
                newVehicle.status = transformNumberToBoolean(vehicle.status);
                newVehicle.type = vehicle.type;
                newVehicle.vehicleId = vehicle.vehiclesId;
                newVehicle.vinNumber = vehicle.vinNumber;

                // Add new vehicle to vehicle array
                vehiclesArr.push(newVehicle);
            });

            // Return vehicle array to controller
            return vehiclesArr;
        } catch (error) {
            return new RequestResponse(2402, "Vehicles can not be returned")
        }
    }

    // Service for getting one vehicle for agricultural holding
    async getVehicleById(vehicleId: number, req: Request): Promise<GetVehiclesDto | RequestResponse> {
        let agriculturalHoldingId: number;
        let vehicleFromDatabase: Vehicles;

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(2500, "Agricultural holding id can not get from token") };

        // Find vehicles for agricultural holding in database
        try { vehicleFromDatabase = await this.vehicles.findOne({ where: { vehiclesId: vehicleId, agriculturalHoldingId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(2501, "Vehicle can not be found in database") }

        // Set vehicle for returning
        try {
            if (vehicleFromDatabase) {
                let curentVehicle = new GetVehiclesDto();
                curentVehicle.agriculturalHoldingId = vehicleFromDatabase.agriculturalHoldingId;
                curentVehicle.garageNumber = vehicleFromDatabase.garageNumber;
                curentVehicle.mark = vehicleFromDatabase.mark;
                curentVehicle.model = vehicleFromDatabase.model;
                curentVehicle.registrationNumber = vehicleFromDatabase.registrationNumber;
                curentVehicle.status = transformNumberToBoolean(vehicleFromDatabase.status);
                curentVehicle.type = vehicleFromDatabase.type;
                curentVehicle.vehicleId = vehicleFromDatabase.vehiclesId;
                curentVehicle.vinNumber = vehicleFromDatabase.vinNumber;

                return curentVehicle;
            }
            else { return new RequestResponse(2504, "Vehicle do not exist") }
        } catch (error) {
            return new RequestResponse(2505, "Vehicle can not be returned");
        }
    }

    // Service for editing one vehicle by id
    async editVehicleById(data: EditVehiclesDto, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let vehicleFromDatabase: Vehicles;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, editVehiclesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(2600, "Agricultural holding id can not get from token") };

        // Get vehicles from database
        try {
            vehicleFromDatabase = await this.vehicles.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    vehiclesId: data.vehicleId
                }
            });
            if (!vehicleFromDatabase || data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(2601, "Vehicle do not exist")
            };
        } catch (error) {
            return new RequestResponse(2602, "Vehicle can not find");
        }

        // Create custom vehicle for editing data
        try {
            let curentVehicle = new Vehicles();

            curentVehicle.agriculturalHoldingId = vehicleFromDatabase.agriculturalHoldingId;
            curentVehicle.garageNumber = vehicleFromDatabase.garageNumber;
            curentVehicle.mark = data.mark;
            curentVehicle.model = data.model;
            curentVehicle.registrationNumber = data.registrationNumber;
            curentVehicle.status = transformBooleanNumberTo(data.status);
            curentVehicle.type = data.type;
            curentVehicle.vehiclesId = vehicleFromDatabase.vehiclesId;
            curentVehicle.vinNumber = data.vinNumber;

            this.vehicles.save(curentVehicle);
            return new RequestResponse(200, 'Vehicle data has changed');

        } catch (error) {
            return new RequestResponse(2603, "Vehicle can not be edited");
        }
    }

    async addNewVehicle(data: AddVehiclesDto, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let newVehicle: Vehicles;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, addVehiclesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(2700, "Agricultural holding id can not get from token") };

        // Checking agricultural holding id from data and token
        try {
            if (data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(2703, "Agricultural holding id from data is not corect");
            }
        } catch (error) {
            return new RequestResponse(2704, "Checking agricultural holding id from data is not possible");
        }

        // Set garage number for new vehicle
        let vehicles = await this.vehicles.find({ where: { agriculturalHoldingId: data.agriculturalHoldingId } });
        let newGarageNumber: number = -1;

        // Find largest garage number
        vehicles.forEach(vehicle => { if (vehicle.garageNumber > newGarageNumber) { newGarageNumber = vehicle.garageNumber; } })

        // Set new garage number
        newGarageNumber = newGarageNumber + 1;

        // Add new vehicle
        try {
            newVehicle = new Vehicles();

            newVehicle.agriculturalHoldingId = data.agriculturalHoldingId;
            newVehicle.garageNumber = newGarageNumber;
            newVehicle.mark = data.mark;
            newVehicle.model = data.model;
            newVehicle.registrationNumber = data.registrationNumber;
            newVehicle.status = transformBooleanNumberTo(data.status);
            newVehicle.type = data.type;
            newVehicle.vinNumber = data.vinNumber;

            await this.vehicles.save(newVehicle);
            return new RequestResponse(200, "Vehicle was added")
        } catch (error) {
            return new RequestResponse(2705, "Vehicle was not added");
        }
    }

    async deleteVehicleById(vehicleId: number, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let vehicleFromDatabase: Vehicles;

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(2800, "Agricultural holding id can not get from token") };

        // Check that vehicle exist in database
        try {
            vehicleFromDatabase = await this.vehicles.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    vehiclesId: vehicleId,
                }
            });
            if (!vehicleFromDatabase) { return new RequestResponse(2801, "Vehicle do not exist in database") }
        } catch (error) {
            return new RequestResponse(2802, "Checking vehicle to database is not possible");
        }

        // Delete vehicle from database
        try {
            if (vehicleFromDatabase) {
                await this.vehicles.remove(vehicleFromDatabase);
                return new RequestResponse(200, "Vehicle was deleted");
            }
        } catch (error) {
            return new RequestResponse(2803, "Vehicle can not be deleted");
        }
    }
}

