import { Module } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'src/config/database.configuration';
import { AgriculturalHoldingController } from './controller/agricultural_holding/agricultural.holding.controller';
import { AuthAgriculturalHoldingController } from './controller/agricultural_holding/auth.agricultural.holding.controller';
import { ParcelCoordinateController } from './controller/parcel.coordinate/parcel.coordinate.controller';
import { ParcelOwnersController } from './controller/parcel.owner/parcel.owner.controller';
import { ParcelController } from './controller/parcel/parcel.controller';
import { AgriculturalHolding } from './entity/agricultural.holding.entity';
import { ParcelCoordinate } from './entity/parcel.coordinate.entity';
import { Parcel } from './entity/parcel.entity';
import { ParcelOwner } from './entity/parcel.owner.entity';
import { ParcelParcelOwner } from './entity/parcel.parcel.owner.entity';
import { AgriculturalHoldingMiddleware } from './middleware/agricultural.holding.middleware';
import { AgriculturalHoldingService } from './service/agricultural_holding/agricultural.holding.service';
import { ParcelCoordinateService } from './service/parcel.coordinate/parcel.coordinate.service';
import { ParcelOwnersService } from './service/parcel.owner/parcel.owner.service';
import { ParcelParcelOwnerService } from './service/parcel.parcel.owner/parcel.parcel.owner.service';
import { ParcelService } from './service/parcel/parcel.service';
import { ParcelParcelOwnersController } from './controller/parcel.parcel.owner/parcel.parcel.owner.controller';
import { AttachedMachines } from './entity/attached.machines.entity';
import { AttachedVehicles } from './entity/attached.vehicles.entity';
import { Vehicles } from './entity/vehicles.entity';
import { VehiclesController } from './controller/vehicles/vehicles.controller';
import { AttachedVehiclesController } from './controller/attached.vehicles/attached.vehicles.controller';
import { AttachedMachinesController } from './controller/attached.machines/attached.machines.controller';
import { VehiclesService } from './service/vehicles/vehicles.service';
import { AttachedVehiclesService } from './service/attached.vehicles/attached.vehicles.service';
import { AttachedMachinesService } from './service/attached.machines/attached.machines.service';
import { Driver } from './entity/driver.entity';
import { DriverController } from './controller/driver/driver.controller';
import { DriverService } from './service/driver/driver.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: DatabaseConfiguration.hostname,
      port: DatabaseConfiguration.port,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        AgriculturalHolding,
        Parcel,
        ParcelOwner,
        ParcelCoordinate,
        ParcelParcelOwner,
        Vehicles,
        AttachedVehicles,
        AttachedMachines,
        Driver,
      ],
    }),
    TypeOrmModule.forFeature(
      [
        AgriculturalHolding,
        Parcel,
        ParcelOwner,
        ParcelCoordinate,
        ParcelParcelOwner,
        Vehicles,
        AttachedVehicles,
        AttachedMachines,
        Driver,
      ]
    )
  ],
  controllers: [
    AgriculturalHoldingController,
    AuthAgriculturalHoldingController,
    ParcelController,
    ParcelOwnersController,
    ParcelCoordinateController,
    ParcelParcelOwnersController,
    VehiclesController,
    AttachedVehiclesController,
    AttachedMachinesController,
    DriverController,
  ],
  providers: [
    AgriculturalHoldingService,
    ParcelService,
    ParcelOwnersService,
    ParcelCoordinateService,
    ParcelParcelOwnerService,
    VehiclesService,
    AttachedVehiclesService,
    AttachedMachinesService,
    DriverService,
  ],
  exports: [
    AgriculturalHoldingService,
    ParcelService,
    ParcelOwnersService,
    ParcelCoordinateService,
    ParcelParcelOwnerService,
    VehiclesService,
    AttachedVehiclesService,
    AttachedMachinesService,
    DriverService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AgriculturalHoldingMiddleware)
      .exclude('agricultural-holding/auth/login')
      .forRoutes(
        { path: 'holding', method: RequestMethod.ALL },
        { path: 'holding/*', method: RequestMethod.ALL },
        { path: 'parcels', method: RequestMethod.ALL },
        { path: 'parcels/*', method: RequestMethod.ALL },
        { path: 'parcel-owners', method: RequestMethod.ALL },
        { path: 'parcel-owners/*', method: RequestMethod.ALL },
        { path: 'parcel-coordinate', method: RequestMethod.ALL },
        { path: 'parcel-coordinate/*', method: RequestMethod.ALL },
        { path: 'parcel-parcel-owners', method: RequestMethod.ALL },
        { path: 'parcel-parcel-owners/*', method: RequestMethod.ALL },
        { path: 'vehicles', method: RequestMethod.ALL },
        { path: 'vehicles/*', method: RequestMethod.ALL },
        { path: 'attached-vehicles', method: RequestMethod.ALL },
        { path: 'attached-vehicles/*', method: RequestMethod.ALL },
        { path: 'attached-machines', method: RequestMethod.ALL },
        { path: 'attached-machines/*', method: RequestMethod.ALL },
        { path: 'driver', method: RequestMethod.ALL },
        { path: 'driver/*', method: RequestMethod.ALL },
      )
  }
}
