import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("parcel_owner_agricultural_holding_id_owner", ["agriculturalHoldingId", "ownerName", "ownerSurname"], { unique: true })
@Entity("parcel_owner", { schema: "agricultural_app" })

export class ParcelOwner {
  @PrimaryGeneratedColumn({ type: "int", name: "parcel_owners_id", unsigned: true, })
  parcelOwnersId: number;

  @Column({ type: "int", name: "agricultural_holding_id", unsigned: true, default: () => "'0'", })
  agriculturalHoldingId: number;

  @Column({ type: "varchar", name: "owner_name", length: 30 })
  ownerName: string;

  @Column({ type: "varchar", name: "owner_surname", length: 30 })
  ownerSurname: string;

  @Column({ type: "varchar", name: "identification_number", nullable: true, length: 13, })
  identificationNumber: string | null;

  @Column({ type: "varchar", name: "address", nullable: true, length: 50 })
  address: string | null;

  @Column({ type: "varchar", name: "zip_number", nullable: true, length: 5 })
  zipNumber: string | null;

  @Column({ type: "varchar", name: "city", nullable: true, length: 25 })
  city: string | null;

  @Column({ type: "varchar", name: "phone", nullable: true, length: 30 })
  phone: string | null;

  @Column({ type: "varchar", name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column({ type: "varchar", name: "note", nullable: true, length: 255 })
  note: string | null;
}