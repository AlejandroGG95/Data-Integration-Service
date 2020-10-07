import { Module } from '@nestjs/common';
import { MicroserviceController } from './addons/data-integration/controllers/microservice.controller';
import { DiService } from './addons/data-integration/services/di.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DataIntegrationModule } from './addons/data-integration/data-integration.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DataIntegrationModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule { }
