"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const di_service_1 = require("./../services/di.service");
const cron_service_1 = require("../services/cron.service");
const fs = require('fs');
let MicroserviceController = class MicroserviceController {
    constructor(cronService, diService) {
        this.cronService = cronService;
        this.diService = diService;
        cronService.restoreCrons();
    }
    listAllJobTemplate() {
        try {
            return this.diService.listAllJobTemplate().then(function (result) {
                return result;
            });
        }
        catch (Exception) {
            return Exception;
        }
    }
    copiFolderContent(data_folder) {
        try {
            return this.diService.copiFolderContent(data_folder);
        }
        catch (Exception) {
            return Exception;
        }
    }
    listAllJobClientDetailed(data) {
        return this.diService.listAllJobClientDetailed(data);
    }
    updateJob(data) {
        try {
            return this.diService.updateJob(data);
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    createFrecuency(data) {
        const jobs = this.cronService.getCronsID();
        if (jobs.includes(data.datos.name)) {
            this.cronService.deleteCron(data.datos.name);
        }
        if (data.datos.frecuencia.time_u == 'hours-minutes') {
            console.log("Añadir a hours-minutes");
            this.cronService.addCronJob(data.datos.name, data.datos.frecuencia.time_data, data);
        }
        return this.diService.createFrecuency(data);
    }
    updateFrecuency(data) {
        const jobs = this.cronService.getCronsID();
        console.log("El CAMBIO DE FRECUENCIA ANTES DEL CRON", jobs);
        console.log("El CAMBIO DE FRECUENCIA ANTES DEL CRON", data);
        if (jobs.includes(data.datos.name)) {
            this.cronService.deleteCron(data.datos.name);
        }
        if (data.datos.frecuencia.time_u == 'hours-minutes') {
            console.log("Añadir a hours-minutes");
            this.cronService.addCronJob(data.datos.name, data.datos.frecuencia.time_data, data);
        }
        return this.diService.updateFrecuency(data);
    }
    deleteJob(data) {
        return this.diService.deleteJob(data);
    }
    searchOneLogDB(data) {
        return this.diService.searchOneLogDB(data);
    }
    findAllLogs() {
        return this.diService.findAllLogs();
    }
    findAllHistory(log_data) {
        return this.diService.findAllHistory(log_data);
    }
    actionSpecificCron(datos) {
        console.log(datos.job);
        console.log(datos.action);
        this.diService.actionSpecificCron(datos.job, datos.action);
    }
    loginDIS(user_data) {
        return this.diService.login(user_data).then(res => {
            console.log("Respuesta", res);
            return res;
        });
    }
    registrarseDIS(user_data) {
        return this.diService.registrarse(user_data);
    }
};
__decorate([
    common_1.Get('listAllTemplates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], MicroserviceController.prototype, "listAllJobTemplate", null);
__decorate([
    common_1.Post('copyFolder'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MicroserviceController.prototype, "copiFolderContent", null);
__decorate([
    common_1.Post('listAllJobClientDetailed'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MicroserviceController.prototype, "listAllJobClientDetailed", null);
__decorate([
    common_1.Post('updateJob'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "updateJob", null);
__decorate([
    common_1.Post('createFrecuency'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "createFrecuency", null);
__decorate([
    common_1.Post('updateFrecuency'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "updateFrecuency", null);
__decorate([
    common_1.Post('deleteJob'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "deleteJob", null);
__decorate([
    common_1.Post('searchOneLogDB'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "searchOneLogDB", null);
__decorate([
    common_1.Post('findAllLogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "findAllLogs", null);
__decorate([
    common_1.Post('findAllHistory'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "findAllHistory", null);
__decorate([
    common_1.Post('actionSpecificCron'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "actionSpecificCron", null);
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "loginDIS", null);
__decorate([
    common_1.Post('registrar'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MicroserviceController.prototype, "registrarseDIS", null);
MicroserviceController = __decorate([
    common_1.Controller('microservice'),
    __metadata("design:paramtypes", [cron_service_1.CronService,
        di_service_1.DiService])
], MicroserviceController);
exports.MicroserviceController = MicroserviceController;
//# sourceMappingURL=microservice.controller.js.map