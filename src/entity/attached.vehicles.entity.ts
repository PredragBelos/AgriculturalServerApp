import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_attached_vehicles_agricultural_holding_id_garage_number", ["agriculturalHoldingId", "garageNumber"], { unique: true })
@Entity("attached_vehicles", { schema: "agricultural_app" })

export class AttachedVehicles {
  @PrimaryGeneratedColumn({ type: "int", name: "attached_vehicles_id", unsigned: true, })
  attachedVehiclesId: number;

  @Column({ type: "int", name: "agricultural_holding_id", unsigned: true, default: () => "'0'", })
  agriculturalHoldingId: number;

  @Column({ type: "int", name: "garage_number", unsigned: true, default: () => "'0'", })
  garageNumber: number;

  @Column({ type: "varchar", length: 30, default: () => "'0'" })
  type: string;

  @Column({ type: "varchar", length: 30, default: () => "'0'" })
  mark: string;

  @Column({ type: "varchar", length: 30, default: () => "'0'" })
  model: string;

  @Column({ type: "varchar", name: "vin_number", nullable: true, length: 17, default: () => "'0'", })
  vinNumber: string | null;

  @Column({ type: "varchar", name: "registration_number", nullable: true, length: 15, default: () => "'0'", })
  registrationNumber: string | null;

  @Column({ type: "int", unsigned: true, default: () => "'0'" })
  status: number;
}
