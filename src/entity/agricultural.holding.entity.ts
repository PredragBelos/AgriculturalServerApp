import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_agricultural_holding_agricultural_holding_name", ["agriculturalHoldingName"], { unique: true })
@Index("uq_agricultural_holding_agricultural_holding_number", ["agriculturalHoldingNumber"], { unique: true })
@Index("uq_agricultural_holding_username", ["username"], { unique: true })
@Entity("agricultural_holding", { schema: "agricultural_app" })

export class AgriculturalHolding {
    @PrimaryGeneratedColumn({ type: "int", name: "agricultural_holding_id", unsigned: true, })
    agriculturalHoldingId: number;

    @Column({ type: "varchar", unique: true, length: 30 })
    username: string;

    @Column({ type: "varchar", name: "password_hash", length: 255 })
    passwordHash: string;

    @Column({ type: "varchar", name: "agricultural_holding_name", unique: true, length: 30, })
    agriculturalHoldingName: string;

    @Column({ type: "varchar", name: "agricultural_holding_number", unique: true, length: 12, })
    agriculturalHoldingNumber: string;

    @Column({ type: "varchar", length: 50 })
    address: string;

    @Column({ type: "varchar", length: 25 })
    city: string;

    @Column({ type: "varchar", name: "zip_number", length: 5 })
    zipNumber: string;

    @Column({ type: "varchar", name: "director_name", length: 30 })
    directorName: string;

    @Column({ type: "varchar", name: "director_surname", length: 30 })
    directorSurname: string;

    @Column({ type: "varchar", name: "director_id_num", length: 13 })
    directorIdNum: string;

    @Column({ type: "varchar", length: 30 })
    phone: string;

    @Column({ type: "varchar", length: 100 })
    email: string;
}