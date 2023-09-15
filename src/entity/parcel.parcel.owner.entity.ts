import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("parcel_parcel_owner_parcel_id_parcel_owner_id", ["parcelId", "parcelOwnerId", "agriculturalHoldingId"], { unique: true })
@Entity("parcel_parcel_owner", { schema: "agricultural_app" })

export class ParcelParcelOwner {
  @PrimaryGeneratedColumn({ type: "int", name: "parcel_parcel_owner_id", unsigned: true, })
  parcelParcelOwnerId: number;

  @Column({ type: "int", name: "agricultural_holding_id", unsigned: true, default: () => "'0'", })
  agriculturalHoldingId: number;

  @Column({ type: "int", name: "parcel_id", unsigned: true })
  parcelId: number;

  @Column({ type: "int", name: "parcel_owner_id", unsigned: true })
  parcelOwnerId: number;

  @Column({ type: "int", name: "share_percentage", unsigned: true, default: () => "'0'",})
  sharePercentage: number;
}
