import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_parcel_coordinate_parcel_id_x_coordinate_y_coordinate",["parcelId", "xCoordinate", "yCoordinate", "agriculturalHoldingId"],{ unique: true })
@Entity("parcel_coordinate", { schema: "agricultural_app" })

export class ParcelCoordinate {
  @PrimaryGeneratedColumn({ type: "int", name: "parcel_coordinate_id", unsigned: true, })
  parcelCoordinateId: number;

  @Column({type: "int", name: "agricultural_holding_id",unsigned: true,default: () => "'0'",})
  agriculturalHoldingId: number;

  @Column("int", { name: "parcel_id", unsigned: true })
  parcelId: number;

  @Column("float", { name: "x_coordinate", precision: 12, default: () => "'0'", })
  xCoordinate: number;

  @Column("float", { name: "y_coordinate", precision: 12, default: () => "'0'", })
  yCoordinate: number;
}
