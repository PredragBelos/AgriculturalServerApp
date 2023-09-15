import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("driver", { schema: "agricultural_app" })

export class Driver {
    @PrimaryGeneratedColumn({ type: "int", name: "driver_id", unsigned: true })
    driverId: number;

    @Column({ type: "int", name: "agricultural_holding_id", unsigned: true, default: () => "'0'", })
    agriculturalHoldingId: number;

    @Column({ type: "varchar", name: "driver_name", length: 30 })
    driverName: string;

    @Column({ type: "varchar", name: "driver_surname", length: 30 })
    driverSurname: string;

    @Column({ type: "varchar", name: "driver_address", length: 50 })
    driverAddress: string;

    @Column({ type: "varchar", name: "driver_city", length: 25 })
    driverCity: string;

    @Column({ type: "varchar", name: "zip_code", length: 5 })
    zipCode: string;

    @Column({ type: "varchar", name: "driver_card_num", length: 20 })
    driverCardNum: string;

    @Column({ type: "varchar", name: "driver_phone", length: 30 })
    driverPhone: string;

    @Column({ type: "varchar", name: "driver_email", length: 100 })
    driverEmail: string;

    @Column({ type: "int", name:"driver_status", unsigned: true, default: () => "'0'" })
    driverStatus: number;
}
