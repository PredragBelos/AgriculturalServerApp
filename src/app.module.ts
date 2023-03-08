import { Module } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'src/config/database.configuration';
import { AgriculturalHoldingController } from './controller/agricultural_holding/agricultural.holding.controller';
import { AuthAgriculturalHoldingController } from './controller/agricultural_holding/auth.agricultural.holding.controller';
import { AgriculturalHolding } from './entity/agricultural.holding.entity';
import { AgriculturalHoldingMiddleware } from './middleware/agricultural.holding.middleware';
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
  exports: [
    AgriculturalHoldingService,
  ]
})
export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AgriculturalHoldingMiddleware)
    .exclude('agricultural-holding/auth/login')
    .forRoutes(
      {path: 'holding', method: RequestMethod.ALL},
      {path: 'holding/*', method: RequestMethod.ALL},
    )
  }
}
