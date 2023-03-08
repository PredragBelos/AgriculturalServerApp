import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgriculturalHolding } from 'src/entity/agricultural.holding.entity';
import { RequestResponse } from 'src/objects/response/request.response';
import { AddAgriculturalHoldingDto } from 'src/dto/agricultural_holding/add.agricultural.holding.dto';
import { checkAgriculturalHoldingProperyLength } from 'src/functions/agricultural.holding.functions';
import { LoginAgriculturalHoldingDto } from 'src/dto/agricultural_holding/login.agricultural.holding.dto';
import { EditAgriculturalHoldingDto, editAgriculturalHoldingDtoTemplate } from 'src/dto/agricultural_holding/edit.agricultural.holding.dto';
import { GetAgriculturalHoldingDto } from 'src/dto/agricultural_holding/get.agricultural.holding.dto';
import { validateObjectPropertyType } from 'src/functions/validate.dto.objects';

@Injectable()
export class AgriculturalHoldingService {
    constructor(
        @InjectRepository(AgriculturalHolding) private readonly agriculturalHolding: Repository<AgriculturalHolding>
    ) { }

    // Method for add new agricultural holding
    async add(data: AddAgriculturalHoldingDto): Promise<RequestResponse> {
        try {
            // Getting agricultural holdings per username, name and id number
            var agriculturalHoldingExistenceCheckerByUsername: AgriculturalHolding | null = await this.agriculturalHolding.findOne({ where: { username: data.username } });
            var agriculturalHoldingExistenceCheckerByHoldingName: AgriculturalHolding | null = await this.agriculturalHolding.findOne({ where: { agriculturalHoldingName: data.agriculturalHoldingName } });
            var agriculturalHoldingExistenceCheckerByHoldingNumber: AgriculturalHolding | null = await this.agriculturalHolding.findOne({ where: { agriculturalHoldingNumber: data.agriculturalHoldingNumber } });
        } catch (e) {
            return new RequestResponse(1000, "Server is turn off try later");
        }

        // Checking if username exists
        if (agriculturalHoldingExistenceCheckerByUsername !== null) {
            return new RequestResponse(1001, "Username alredy exist");
        } else if (agriculturalHoldingExistenceCheckerByHoldingName !== null) {
            return new RequestResponse(1002, "Agricultural holding name alredy exist");
        } else if (agriculturalHoldingExistenceCheckerByHoldingNumber !== null) {
            return new RequestResponse(1003, "Agricultural holding number alredy exist");
        } else {
            // Create password hash string
            const crypto = require('crypto');
            const passwordHash = crypto.createHash('sha512').update(data.password);
            const passwordHashString = passwordHash.digest('hex').toUpperCase();

            // Create new agricultural holding object
            let newAgriculturalHolding: AgriculturalHolding = new AgriculturalHolding();
            newAgriculturalHolding.username = data.username;
            newAgriculturalHolding.passwordHash = passwordHashString;
            newAgriculturalHolding.agriculturalHoldingName = data.agriculturalHoldingName;
            newAgriculturalHolding.agriculturalHoldingNumber = data.agriculturalHoldingNumber;
            newAgriculturalHolding.address = data.address;
            newAgriculturalHolding.city = data.city;
            newAgriculturalHolding.zipNumber = data.zipNumber;
            newAgriculturalHolding.directorName = data.directorName;
            newAgriculturalHolding.directorSurname = data.directorSurname;
            newAgriculturalHolding.directorIdNum = data.directorIdNum;
            newAgriculturalHolding.phone = data.phone;
            newAgriculturalHolding.email = data.email;

            // Checking newAgriculturalHolding property length
            if (checkAgriculturalHoldingProperyLength(newAgriculturalHolding).code !== 200) {
                return checkAgriculturalHoldingProperyLength(newAgriculturalHolding);
            }
            else {
                // Save agricultural holding in database
                try {
                    await this.agriculturalHolding.save(newAgriculturalHolding);
                    return new RequestResponse(200, `Agricultural holding ${newAgriculturalHolding.agriculturalHoldingName} is saved`);
                } catch (e) {
                    return new RequestResponse(1016, "Agricultural holding is not saved");
                }
            }
        }
    }

    // Method for edditing agricultural holding
    async edit(agriculturalHoldingId: number, data: EditAgriculturalHoldingDto): Promise<RequestResponse | GetAgriculturalHoldingDto> {
        const agriculturalHoldingIdFromBody = data.agriculturalHoldingId;

        // Validate data transfer object
        try { if (validateObjectPropertyType(data, editAgriculturalHoldingDtoTemplate)) { return new RequestResponse(5000, "Data transfer object is not correct") }; }
        catch (error) { return new RequestResponse(5000, "Data transfer object is not correct"); }

        // Data matching check for agricultural holding ids
        if (agriculturalHoldingId !== agriculturalHoldingIdFromBody) { return new RequestResponse(1090, "Id from body and URL not match") };

        // Find agricultural holding to database
        const agriculturalHoldingFromDatabase = await this.agriculturalHolding.findOne({ where: { agriculturalHoldingId: agriculturalHoldingId } });

        // Checking agricultural holding exist in database
        if (agriculturalHoldingFromDatabase === null || agriculturalHoldingFromDatabase === undefined) { return new RequestResponse(1091, "Agricultural holding not exist") }

        // Fill object for sent to database
        let agriculturalHoldingDataForSentToDatabase = {
            agriculturalHoldingId: agriculturalHoldingId,
            username: agriculturalHoldingFromDatabase.username,
            password: agriculturalHoldingFromDatabase.passwordHash,
            agriculturalHoldingName: data.agriculturalHoldingName,
            agriculturalHoldingNumber: data.agriculturalHoldingNumber,
            address: data.address,
            city: data.city,
            zipNumber: data.zipNumber,
            directorName: data.directorName,
            directorSurname: data.directorSurname,
            directorIdNum: data.directorIdNum,
            phone: data.phone,
            email: data.email,
        }

        // Save editing agricultural holding to database
        try {
            this.agriculturalHolding.save(agriculturalHoldingDataForSentToDatabase);
            let response = new GetAgriculturalHoldingDto();
            response.address = agriculturalHoldingDataForSentToDatabase.address;
            response.agriculturalHoldingId = agriculturalHoldingDataForSentToDatabase.agriculturalHoldingId;
            response.agriculturalHoldingName = agriculturalHoldingDataForSentToDatabase.agriculturalHoldingName;
            response.agriculturalHoldingNumber = agriculturalHoldingDataForSentToDatabase.agriculturalHoldingNumber;
            response.city = agriculturalHoldingDataForSentToDatabase.city;
            response.directorIdNum = agriculturalHoldingDataForSentToDatabase.directorIdNum;
            response.directorName = agriculturalHoldingDataForSentToDatabase.directorName;
            response.directorSurname = agriculturalHoldingDataForSentToDatabase.directorSurname;
            response.email = agriculturalHoldingDataForSentToDatabase.email;
            response.phone = agriculturalHoldingDataForSentToDatabase.phone;
            response.zipNumber = agriculturalHoldingDataForSentToDatabase.zipNumber;

            return response;
        } catch (error) {
            return new RequestResponse(1092, "Agricultural holding data is not saved");
        }
    }


    // Method for search agricultural holding by username
    async getByUsername(loginData: LoginAgriculturalHoldingDto): Promise<AgriculturalHolding | null | RequestResponse> {
        try {
            const user = await this.agriculturalHolding.findOne({ where: { username: loginData.username } });
            if (user !== null) { if (loginData.username !== user.username) { return null; } else { return await this.agriculturalHolding.findOne({ where: { username: loginData.username } }); } }
        }
        catch (e) { return new RequestResponse(1050, "Agricultural holding search is currently not possible"); }
    }

    // Method for search agricultural holding by agricultural holding id
    async getById(data: number): Promise<AgriculturalHolding | null | RequestResponse> {
        try { return await this.agriculturalHolding.findOne({ where: { agriculturalHoldingId: data } }); }
        catch (e) { return new RequestResponse(1051, "Agricultural holding search is currently not possible"); }
    }
}