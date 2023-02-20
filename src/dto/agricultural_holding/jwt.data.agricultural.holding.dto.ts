export class JwtDataAgriculturalHoldingDto {
    agriculturalHoldingId: number;
    username: string;
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            agriculturalHoldingId: this.agriculturalHoldingId,
            username: this.username,
            ip: this.ip,
            ua: this.ua,
        }
    }
}