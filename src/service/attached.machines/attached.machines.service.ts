import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "src/config/jwt.cofiguration";
import { AttachedMachines } from "src/entity/attached.machines.entity";
import { GetAttachedMachinesDto } from "src/dto/attached_machines/get.attached.machines.dto";
import { getAgriculturalHoldingId } from "src/functions/global.functions";
import { AddAttachedMachinesDto, addAttachedMachinesDtoTemplate } from "src/dto/attached_machines/add.attached.machines.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";
import { EditAttachedMachinesDto, editAttachedMachinesDtoTemplate } from "src/dto/attached_machines/edit.attached.machines.dto";

@Injectable()
export class AttachedMachinesService {
    constructor(
        @InjectRepository(AttachedMachines) private readonly attachedMachines: Repository<AttachedMachines>,
    ) { }

    // Service for getting all attached machines for agricultural holding
    async getAllAttachedMachinesByAgriculturalId(req: Request): Promise<GetAttachedMachinesDto[] | RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedMachinesArr: GetAttachedMachinesDto[] = [];
        let machinesFromDatabase: AttachedMachines[];

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(3400, "Agricultural holding id can not get from token") }

        // Find vehicles for agricultural holding in database
        try { machinesFromDatabase = await this.attachedMachines.find({ where: { agriculturalHoldinId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(3401, "Attached machines can not be found in database") }

        // Set vehicles array for returning
        try {
            machinesFromDatabase.forEach(machine => {
                let newAttachedMachine = new GetAttachedMachinesDto();

                newAttachedMachine.agriculturalHoldingId = machine.agriculturalHoldinId;
                newAttachedMachine.attachedMachinesId = machine.attachedMachinesId;
                newAttachedMachine.garageNumber = machine.garageNumber;
                newAttachedMachine.mark = machine.mark;
                newAttachedMachine.model = machine.model;
                newAttachedMachine.status = transformNumberToBoolean(machine.status);
                newAttachedMachine.type = machine.type;

                // Add new vehicle to vehicle array
                attachedMachinesArr.push(newAttachedMachine);
            });

            // Return vehicle array to controller
            return attachedMachinesArr;
        } catch (error) {
            return new RequestResponse(3402, "Attached vehicles can not be returned")
        }
    }

    // Service for getting one attached machine for agricultural holding
    async getAttachedMachineById(attachedMachineId: number, req: Request): Promise<GetAttachedMachinesDto | RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedMachineFromDatabase: AttachedMachines;

        // Function for transform number to boolean
        const transformNumberToBoolean = (number: number): boolean => {
            if (number === 1) { return true } else { return false };
        }

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(3500, "Agricultural holding id can not get from token") };

        // Find vehicles for agricultural holding in database
        try { attachedMachineFromDatabase = await this.attachedMachines.findOne({ where: { attachedMachinesId: attachedMachineId, agriculturalHoldinId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(3501, "Attached machine can not be found in database") }

        // Set vehicle for returning
        try {
            if (attachedMachineFromDatabase) {
                let curentMachine = new GetAttachedMachinesDto();

                curentMachine.agriculturalHoldingId = attachedMachineFromDatabase.agriculturalHoldinId;
                curentMachine.attachedMachinesId = attachedMachineFromDatabase.attachedMachinesId;
                curentMachine.garageNumber = attachedMachineFromDatabase.garageNumber;
                curentMachine.mark = attachedMachineFromDatabase.mark;
                curentMachine.model = attachedMachineFromDatabase.model;
                curentMachine.status = transformNumberToBoolean(attachedMachineFromDatabase.status);
                curentMachine.type = attachedMachineFromDatabase.type;

                return curentMachine;
            }
            else { return new RequestResponse(3502, "Attached machine do not exist") }
        } catch (error) {
            return new RequestResponse(3503, "Attached machine can not be returned");
        }
    }

    // Service for adding new attached machine to database
    async addNewAttachedMachine(data: AddAttachedMachinesDto, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let newAttachedMachine: AttachedMachines;
        let newGarageNumber: number = -1;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, addAttachedMachinesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(3600, "Agricultural holding id can not get from token") };

        // Checking agricultural holding id from data and token
        try {
            if (data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(3601, "Agricultural holding id from data is not corect");
            }
        } catch (error) {
            return new RequestResponse(3602, "Checking agricultural holding id from data is not possible");
        }

        // Set garage number for new vehicle
        try {
            let attachedMachines = await this.attachedMachines.find({ where: { agriculturalHoldinId: data.agriculturalHoldingId } });

            // Find largest garage number
            attachedMachines.forEach(attachedMachine => { if (attachedMachine.garageNumber > newGarageNumber) { newGarageNumber = attachedMachine.garageNumber; } })

            // Set new garage number
            newGarageNumber = newGarageNumber + 1;
        } catch (error) {
            return new RequestResponse(3603, "Garage number can not be created");
        }

        // Add new vehicle
        try {
            newAttachedMachine = new AttachedMachines();

            newAttachedMachine.agriculturalHoldinId = data.agriculturalHoldingId;
            newAttachedMachine.garageNumber = newGarageNumber;
            newAttachedMachine.mark = data.mark;
            newAttachedMachine.model = data.model;
            newAttachedMachine.status = transformBooleanNumberTo(data.status);
            newAttachedMachine.type = data.type;

            await this.attachedMachines.save(newAttachedMachine);
            return new RequestResponse(200, "Attached machine was added")
        } catch (error) {
            return new RequestResponse(3604, "Attached machine was not added");
        }
    }

    // Service for editing one attached machine by id
    async editAttachedMachineById(data: EditAttachedMachinesDto, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedMachineFromDatabase: AttachedMachines;

        // Function for transform number to boolean
        const transformBooleanNumberTo = (boolean: boolean): number => {
            if (boolean) { return 1 } else { return 0 };
        }

        // Validate data transfer object
        if (validateObjectPropertyType(data, editAttachedMachinesDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req) }
        catch (error) { return new RequestResponse(3700, "Agricultural holding id can not get from token") };

        // Get attached vehicles from database
        try {
            attachedMachineFromDatabase = await this.attachedMachines.findOne({
                where: {
                    agriculturalHoldinId: agriculturalHoldingId,
                    attachedMachinesId: data.attachedMachinesId
                }
            });
            if (!attachedMachineFromDatabase || data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(3701, "Attached machine do not exist");
            };
        } catch (error) {
            return new RequestResponse(3702, "Attached machine can not find");
        }

        // Create custom vehicle for editing data
        try {
            let curentMachine = new AttachedMachines();

            curentMachine.agriculturalHoldinId = attachedMachineFromDatabase.agriculturalHoldinId;
            curentMachine.garageNumber = attachedMachineFromDatabase.garageNumber;
            curentMachine.attachedMachinesId = attachedMachineFromDatabase.attachedMachinesId;
            curentMachine.mark = data.mark;
            curentMachine.model = data.model;
            curentMachine.status = transformBooleanNumberTo(data.status);
            curentMachine.type = data.type;

            this.attachedMachines.save(curentMachine);
            return new RequestResponse(200, 'Attached machine data has changed');

        } catch (error) {
            return new RequestResponse(3703, "Attached machine can not be edited");
        }
    }

    // Service for deleting attached machine from database
    async deleteAttachedMachineById(attachedMachineId: number, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let attachedMachineFromDatabase: AttachedMachines;

        // Getting agricultural holding id from token authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(3800, "Agricultural holding id can not get from token") };

        // Check that vehicle exist in database
        try {
            attachedMachineFromDatabase = await this.attachedMachines.findOne({
                where: {
                    agriculturalHoldinId: agriculturalHoldingId,
                    attachedMachinesId: attachedMachineId
                }
            });
            if (!attachedMachineFromDatabase) { return new RequestResponse(3801, "Attached machine do not exist in database") }
        } catch (error) {
            return new RequestResponse(3802, "Checking attached machine to database is not possible");
        }

        // Delete machine from database
        try {
            if (attachedMachineFromDatabase) {
                await this.attachedMachines.remove(attachedMachineFromDatabase);
                return new RequestResponse(200, "Attached machine was deleted");
            }
        } catch (error) {
            return new RequestResponse(3803, "Attached machine can not be deleted");
        }
    }
}
