import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MicroserviceController } from './controllers/microservice.controller';
import { DiService } from './services/di.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientInstanceSchema } from './models/clients.schema';
import { UsersInstanceSchema } from '../../users/users.schema';
import { FrecuenciaInstanceSchema } from '../data-integration/models/frecuencia.schema';
import { CronService } from 'src/addons/data-integration/services/cron.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { LoginInstanceSchema } from './models/login.schema';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        SchedulerRegistry,
        MongooseModule.forRoot('mongodb://localhost/nest', { useFindAndModify: false }),
        MongooseModule.forFeature([{ name: 'clients', schema: ClientInstanceSchema }]),
        MongooseModule.forFeature([{ name: 'users', schema: UsersInstanceSchema }]),
        MongooseModule.forFeature([{ name: 'frecuencias', schema: FrecuenciaInstanceSchema }]),
        MongooseModule.forFeature([{ name: 'logins', schema: LoginInstanceSchema }])
    ],
    controllers: [MicroserviceController],
    providers: [DiService, CronService],
})
export class DataIntegrationModule { }
