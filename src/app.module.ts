import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'src/config/database.configuration';
import { AgriculturalHoldingController } from './controller/agricultural_holding/agricultural.holding.controller';
import { AuthAgriculturalHoldingController } from './controller/agricultural_holding/auth.agricultural.holding.controller';
import { AgriculturalHolding } from './entity/agricultural.holding.entity';
import { AgriculturalHoldingService } from './service/agricultural_holding/agricultural.holding.service';

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
      ],
    }),
    TypeOrmModule.forFeature(
      [
        AgriculturalHolding,
      ]
    )
  ],
  controllers: [
    AgriculturalHoldingController,
    AuthAgriculturalHoldingController,
  ],
  providers: [
    AgriculturalHoldingService,
  ],
})
export class AppModule { }
