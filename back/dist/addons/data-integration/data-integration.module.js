"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../../auth/auth.module");
const microservice_controller_1 = require("./controllers/microservice.controller");
const di_service_1 = require("./services/di.service");
const users_module_1 = require("../../users/users.module");
const mongoose_1 = require("@nestjs/mongoose");
const clients_schema_1 = require("./models/clients.schema");
const users_schema_1 = require("../../users/users.schema");
const frecuencia_schema_1 = require("../data-integration/models/frecuencia.schema");
const cron_service_1 = require("./services/cron.service");
const schedule_1 = require("@nestjs/schedule");
const login_schema_1 = require("./models/login.schema");
let DataIntegrationModule = class DataIntegrationModule {
};
DataIntegrationModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            schedule_1.SchedulerRegistry,
            mongoose_1.MongooseModule.forRoot('mongodb://localhost/nest', { useFindAndModify: false }),
            mongoose_1.MongooseModule.forFeature([{ name: 'clients', schema: clients_schema_1.ClientInstanceSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'users', schema: users_schema_1.UsersInstanceSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'frecuencias', schema: frecuencia_schema_1.FrecuenciaInstanceSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'logins', schema: login_schema_1.LoginInstanceSchema }])
        ],
        controllers: [microservice_controller_1.MicroserviceController],
        providers: [di_service_1.DiService, cron_service_1.CronService],
    })
], DataIntegrationModule);
exports.DataIntegrationModule = DataIntegrationModule;
//# sourceMappingURL=data-integration.module.js.map