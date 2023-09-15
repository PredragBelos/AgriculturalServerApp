import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestResponse } from "src/objects/response/request.response";
import { Repository } from "typeorm";
import { Driver } from "src/entity/driver.entity";
import { GetDriverDto } from "src/dto/driver/get.driver.dto";
import { changeBooleanToNumber, changeNumberToBolean, getAgriculturalHoldingId } from "src/functions/global.functions";
import { EditDriverDto, editDriverDtoTemplate } from "src/dto/driver/edit.driver.dto";
import { AddDriverDto, addDriverDtoTemplate } from "src/dto/driver/add.driver.dto";
import { validateObjectPropertyType } from "src/functions/validate.dto.objects";

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver) private readonly driver: Repository<Driver>,
    ) { }

    // Service for getting all driver for agricultural holding
    async getAllDriverByAgriculturalHoldingId(req: Request): Promise<GetDriverDto[] | RequestResponse> {
        let agriculturalHoldingId: number;
        let driverArr: GetDriverDto[] = [];
        let driversFromDatabase: Driver[];

        // Getting agricultural holding id from authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(3900, "Agricultural holding id can not get from token"); }

        // Find drivers for agricultural holding from database
        try { driversFromDatabase = await this.driver.find({ where: { agriculturalHoldingId: agriculturalHoldingId } }); }
        catch (error) { return new RequestResponse(3901, "Drivers can not be found in database"); }

        // Set drivers array for returning
        try {
            driversFromDatabase.forEach(driver => {
                let newDriver = new GetDriverDto();

                newDriver.agriculturalHoldingId = driver.agriculturalHoldingId;
                newDriver.driverAddress = driver.driverAddress;
                newDriver.driverCardNum = driver.driverCardNum;
                newDriver.driverCity = driver.driverCity;
                newDriver.driverEmail = driver.driverEmail;
                newDriver.driverId = driver.driverId;
                newDriver.driverName = driver.driverName;
                newDriver.driverPhone = driver.driverPhone;
                newDriver.driverStatus = changeNumberToBolean(driver.driverStatus);
                newDriver.driverSurname = driver.driverSurname;
                newDriver.zipCode = driver.zipCode;

                // Adding new driver to driver array
                driverArr.push(newDriver);
            })
        } catch (error) {
            return new RequestResponse(3902, "Drivers can not be returned");
        }

        return driverArr;
    }

    // Service for getting one driver for agricultural holding by driver id
    async getDriverById(driverId: number, req: Request): Promise<GetDriverDto | RequestResponse> {
        let agriculturalHoldingId: number;
        let driverFromDatabase: Driver;
        let driverForReturning: GetDriverDto = new GetDriverDto();

        // Getting agricultural holding id from authorization
        try { agriculturalHoldingId = getAgriculturalHoldingId(req); }
        catch (error) { return new RequestResponse(4000, "Agricultural holding id can not get from token"); }

        // Find driver to database
        try { driverFromDatabase = await this.driver.findOne({ where: { agriculturalHoldingId: agriculturalHoldingId, driverId: driverId } }); }
        catch (error) { return new RequestResponse(4001, "Driver can not be found in database"); }

        // Check that driver existing in database
        if (driverFromDatabase !== null && driverFromDatabase instanceof Driver) {
            try {
                driverForReturning.agriculturalHoldingId = driverFromDatabase.agriculturalHoldingId;
                driverForReturning.driverAddress = driverFromDatabase.driverAddress;
                driverForReturning.driverCardNum = driverFromDatabase.driverCardNum;
                driverForReturning.driverCity = driverFromDatabase.driverCity;
                driverForReturning.driverEmail = driverFromDatabase.driverEmail;
                driverForReturning.driverId = driverFromDatabase.driverId;
                driverForReturning.driverName = driverFromDatabase.driverName;
                driverForReturning.driverPhone = driverFromDatabase.driverPhone;
                driverForReturning.driverStatus = changeNumberToBolean(driverFromDatabase.driverStatus);
                driverForReturning.driverSurname = driverFromDatabase.driverSurname;
                driverForReturning.zipCode = driverFromDatabase.zipCode;

                return driverForReturning;
            } catch (error) {
                return new RequestResponse(4002, "Driver can not be created");
            }
        }
        else {
            return new RequestResponse(4003, "Driver not exist in database");
        }
    }

    // Service for editing driver by id
    async editDriverById(data: EditDriverDto, req: Request): Promise<GetDriverDto | RequestResponse> {
        let agriculturalHoldingId: number;
        let driverFromDatabase: Driver;

        // Validating data transfer object
        try {
            if (validateObjectPropertyType(data, editDriverDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };
        } catch (error) {
            return new RequestResponse(4100, "Data transfer object can not check");
        }

        // Getting agricultural holding id from token
        try {
            agriculturalHoldingId = getAgriculturalHoldingId(req);
        } catch (error) {
            return new RequestResponse(4101, "Agricultural holding id can not get from token");
        }

        // Get driver from database
        try {
            driverFromDatabase = await this.driver.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    driverId: data.driverId,
                },
            });

            // Checking is driver exist in database
            if (driverFromDatabase === null) { return new RequestResponse(4102, "Driver do not exist in database") };

        } catch (error) {
            return new RequestResponse(4103, "Driver can not be found in database");
        }

        // Create custom driver for editing data in database
        try {
            let curentDriver: Driver = new Driver();

            curentDriver.agriculturalHoldingId = driverFromDatabase.agriculturalHoldingId;
            curentDriver.driverAddress = data.driverAddress;
            curentDriver.driverCardNum = data.driverCardNum;
            curentDriver.driverCity = data.driverCity;
            curentDriver.driverEmail = data.driverEmail;
            curentDriver.driverId = driverFromDatabase.driverId;
            curentDriver.driverName = data.driverName;
            curentDriver.driverPhone = data.driverPhone;
            curentDriver.driverStatus = changeBooleanToNumber(data.driverStatus);
            curentDriver.driverSurname = data.driverSurname;
            curentDriver.zipCode = data.zipCode;

            // Save driver to database
            this.driver.save(curentDriver);

            // Create driver object for returning
            let driverForReturning = new GetDriverDto();
            driverForReturning.agriculturalHoldingId = curentDriver.agriculturalHoldingId;
            driverForReturning.driverAddress = curentDriver.driverAddress;
            driverForReturning.driverCardNum = curentDriver.driverCardNum;
            driverForReturning.driverCity = curentDriver.driverCity;
            driverForReturning.driverEmail = curentDriver.driverEmail;
            driverForReturning.driverId = curentDriver.driverId;
            driverForReturning.driverName = curentDriver.driverName;
            driverForReturning.driverPhone = curentDriver.driverPhone;
            driverForReturning.driverStatus = changeNumberToBolean(curentDriver.driverStatus);
            driverForReturning.driverSurname = curentDriver.driverSurname;
            driverForReturning.zipCode = curentDriver.zipCode;

            return driverForReturning;

        } catch (error) {
            return new RequestResponse(4104, "Driver can not be edited");
        }
    }

    // Service for adding new driver
    async addDriver(data: AddDriverDto, req: Request): Promise<GetDriverDto[] | RequestResponse> {
        let agriculturalHoldingId: number;
        let newDriver: Driver;
        let drivers: Driver[];
        let driversForReturn: GetDriverDto[] = [];

        // Validating data transfer object
        try {
            if (validateObjectPropertyType(data, addDriverDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") };
        } catch (error) {
            return new RequestResponse(4200, "Data transfer object can not check");
        }

        // Getting agricultural holding id from token authorization
        try {
            agriculturalHoldingId = getAgriculturalHoldingId(req);
        }
        catch (error) {
            return new RequestResponse(4201, "Agricultural holding id can not get from token")
        };

        // Checking agricultural holding id from data and token
        try {
            if (data.agriculturalHoldingId !== agriculturalHoldingId) {
                return new RequestResponse(4202, "Agricultural holding id from data is not corect");
            }
        } catch (error) {
            return new RequestResponse(4203, "Checking agricultural holding id from data is not possible");
        }

        // Add new driver
        try {
            newDriver = new Driver();

            newDriver.agriculturalHoldingId = data.agriculturalHoldingId;
            newDriver.driverAddress = data.driverAddress;
            newDriver.driverCardNum = data.driverCardNum;
            newDriver.driverCity = data.driverCity;
            newDriver.driverEmail = data.driverEmail;
            newDriver.driverName = data.driverName;
            newDriver.driverPhone = data.driverPhone;
            newDriver.driverStatus = changeBooleanToNumber(data.driverStatus);
            newDriver.driverSurname = data.driverSurname;
            newDriver.zipCode = data.zipCode;

            // Save driver to database
            await this.driver.save(newDriver);

            // Get new drivers from database
            drivers = await this.driver.find({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                }
            });

            // Fill response objects
            drivers.forEach(driver => {
                let newDriver = new GetDriverDto();
                newDriver.agriculturalHoldingId = driver.agriculturalHoldingId;
                newDriver.driverAddress = driver.driverAddress;
                newDriver.driverCardNum = driver.driverCardNum;
                newDriver.driverCity = driver.driverCity;
                newDriver.driverEmail = driver.driverEmail;
                newDriver.driverId = driver.driverId;
                newDriver.driverName = driver.driverName;
                newDriver.driverPhone = driver.driverPhone;
                newDriver.driverStatus = changeNumberToBolean(driver.driverStatus);
                newDriver.driverSurname = driver.driverSurname;
                newDriver.zipCode = driver.zipCode;

                driversForReturn.push(newDriver);
            });

            return driversForReturn;
        } catch (error) {
            return new RequestResponse(4204, "Driver can not be added");
        }
    }

    // Service for delleting driver
    async deleteDriver(driverId: number, req: Request): Promise<RequestResponse> {
        let agriculturalHoldingId: number;
        let driverFromDatabase: Driver;

        // Getting agricultural holding id from token authorization
        try {
            agriculturalHoldingId = getAgriculturalHoldingId(req);
        }
        catch (error) {
            return new RequestResponse(4300, "Agricultural holding id can not get from token")
        };

        // Check that driver exist in database
        try {
            driverFromDatabase = await this.driver.findOne({
                where: {
                    agriculturalHoldingId: agriculturalHoldingId,
                    driverId: driverId,
                }
            });

            if (driverFromDatabase !== null) {
                await this.driver.remove(driverFromDatabase);
                return new RequestResponse(200, "Driver is deleted");
            }
        } catch (error) {
            return new RequestResponse(4301, "Driver can not be deleted");
        }
    }
}

