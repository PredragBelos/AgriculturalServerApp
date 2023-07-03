import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_vehicles_agricultural_holding_id_garage_number", ["agriculturalHoldingId", "garageNumber"], { unique: true })
@Entity("vehicles", { schema: "agricultural_app" })

export class Vehicles {
  @PrimaryGeneratedColumn({ type: "int", name: "vehicles_id", unsigned: true })
  vehiclesId: number;

  @Column({ type: "int", name: "agricultural_holding_id", unsigned: true, default: () => "'0'", })
  agriculturalHoldingId: number;

  @Column({ type: "int", name: "garage_number", unsigned: true })
  garageNumber: number;

  @Column({ type: "varchar", length: 30 })
  type: string;

  @Column({ type: "varchar", length: 30 })
  mark: string;

  @Column({ type: "varchar", length: 30 })
  model: string;

  @Column({ type: "varchar", name: "vin_number", nullable: true, length: 17 })
  vinNumber: string | null;

  @Column({ type: "varchar", name: "registration_number", nullable: true, length: 15, })
  registrationNumber: string | null;

  @Column({ type: "int", unsigned: true, default: () => "'0'" })
  status: number;
}
