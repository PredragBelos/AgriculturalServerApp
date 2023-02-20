
export class RequestResponse {
    code: number;
    message: string;

    constructor(code: number, message: string) {
        try {
            if (!code) { throw new Error("Request code must be defined") }
            if (!message) { throw new Error("Request message must be defined") }
            if (typeof code !== "number") { throw new Error("Request code must be a number") }
            if (typeof message !== "string") { throw new Error("Request message must be a string") }

            this.code = code;
            this.message = message;

        } catch (error) {
            console.log(error.message);
        }
    }
}