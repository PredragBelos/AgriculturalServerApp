import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_agricultural_holding_id_parcel", ["agriculturalHoldingId", "manicipalityId", "cadastralManicipalityId", "parcelNumber",], { unique: true })
@Entity("parcel", { schema: "agricultural_app" })

export class Parcel {
  @PrimaryGeneratedColumn({ type: "int", name: "parcel_id", unsigned: true })
  parcelId: number;

  @Column({ type: "int", name: "agricultural_holding_id", unsigned: true })
  agriculturalHoldingId: number;

  @Column({ type: "varchar", name: "manicipality_id", length: 10 })
  manicipalityId: string;

  @Column({ type: "varchar", name: "manicipality_name", length: 30 })
  manicipalityName: string;

  @Column({ type: "varchar", name: "cadastral_manicipality_id", length: 10 })
  cadastralManicipalityId: string;

  @Column({ type: "varchar", name: "cadastral_manicipality_name", length: 30 })
  cadastralManicipalityName: string;

  @Column({ type: "varchar", name: "parcel_number", length: 15 })
  parcelNumber: string;

  @Column({ type: "varchar", name: "parcel_name", length: 50 })
  parcelName: string;

  @Column({ type: "varchar", name: "alternative_name", nullable: true, length: 50 })
  alternativeName: string | null;

  @Column({ type: "int", name: "area_meters", default: () => "'0'" })
  areaMeters: number;

  @Column({ type: "float", name: "area_hectars", precision: 12, default: () => "'0'", })
  areaHectars: number;

  @Column({ type: "float", name: "area_jutro", precision: 12, default: () => "'0'" })
  areaJutro: number;

  @Column({ type: "int", name: "usable_area_meters", default: () => "'0'" })
  usableAreaMeters: number;

  @Column({ type: "float", name: "usable_area_hectars", precision: 12, default: () => "'0'", })
  usableAreaHectars: number;

  @Column({ type: "float", name: "usable_area_jutro", precision: 12, default: () => "'0'" })
  usableAreaJutro: number;

  @Column({ type: "varchar", length: 10, default: () => "'0'" })
  class: string;

  @Column({ type: "int", name: "property_ownership", default: () => "'0'" })
  propertyOwnership: number;

  @Column({ type: "varchar", nullable: true, length: 50, default: () => "'0'", })
  rent: string | null;
}
