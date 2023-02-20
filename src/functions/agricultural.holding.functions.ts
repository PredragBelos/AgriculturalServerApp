import { AgriculturalHolding } from "src/entity/agricultural.holding.entity";
import { RequestResponse } from "src/objects/response/request.response";

// Function for checking AgriculturalHolding objects property length
export const checkAgriculturalHoldingProperyLength = (agriculturalHolding: AgriculturalHolding): RequestResponse => {
    let checker: boolean = true;

    for (const property in agriculturalHolding) {
        if (`${property}` === 'username' && `${agriculturalHolding[property]}`.length > 30) {
            checker = false;
            return new RequestResponse(1004, 'The length of the property - username - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'passwordHash' && `${agriculturalHolding[property]}`.length > 255) {
            checker = false;
            return new RequestResponse(1005, 'The length of the property - passwordHash - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'agriculturalHoldingName' && `${agriculturalHolding[property]}`.length > 30) {
            checker = false;
            return new RequestResponse(1006, 'The length of the property - agriculturalHoldingName - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'agriculturalHoldingNumber' && `${agriculturalHolding[property]}`.length > 12) {
            checker = false;
            return new RequestResponse(1007, 'The length of the property - agriculturalHoldingNumber - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'address' && `${agriculturalHolding[property]}`.length > 50) {
            checker = false;
            return new RequestResponse(1008, 'The length of the property - address - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'city' && `${agriculturalHolding[property]}`.length > 25) {
            checker = false;
            return new RequestResponse(1009, 'The length of the property - city - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'zipNumber' && `${agriculturalHolding[property]}`.length > 5) {
            checker = false;
            return new RequestResponse(1010, 'The length of the property - zipNumber - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'directorName' && `${agriculturalHolding[property]}`.length > 30) {
            checker = false;
            return new RequestResponse(1011, 'The length of the property - directorName - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'directorSurname' && `${agriculturalHolding[property]}`.length > 30) {
            checker = false;
            return new RequestResponse(1012, 'The length of the property - directorSurname - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'directorIdNum' && `${agriculturalHolding[property]}`.length > 13) {
            checker = false;
            return new RequestResponse(1013, 'The length of the property - directorIdNum - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'phone' && `${agriculturalHolding[property]}`.length > 30) {
            checker = false;
            return new RequestResponse(1014, 'The length of the property - phone - object AgriculturalHolding is longer than allowed');
        }
        if (`${property}` === 'email' && `${agriculturalHolding[property]}`.length > 100) {
            checker = false;
            return new RequestResponse(1015, 'The length of the property - email - object AgriculturalHolding is longer than allowed');
        }
    }
    if (checker) {
        return new RequestResponse(200, 'AgriculturalHolding property length are good length');
    }
}