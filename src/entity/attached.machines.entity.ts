import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_attached_machines_agricultural_holdin_id_garage_number", ["agriculturalHoldinId", "garageNumber"], { unique: true })
@Entity("attached_machines", { schema: "agricultural_app" })

export class AttachedMachines {
  @PrimaryGeneratedColumn({ type: "int", name: "attached_machines_id", unsigned: true, })
  attachedMachinesId: number;

  @Column({ type: "int", name: "agricultural_holdin_id", unsigned: true })
  agriculturalHoldinId: number;

  @Column({ type: "int", name: "garage_number", unsigned: true })
  garageNumber: number;

  @Column({ type: "varchar", length: 30, default: () => "'0'" })
  type: string;

  @Column({ type: "varchar", length: 30 })
  mark: string;

  @Column({ type: "varchar", length: 30 })
  model: string;

  @Column({ type: "int", unsigned: true, default: () => "'0'" })
  status: number;
}
