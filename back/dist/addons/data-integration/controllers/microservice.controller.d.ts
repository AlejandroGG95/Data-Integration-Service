import { DiService } from './../services/di.service';
import { CronService } from 'src/addons/data-integration/services/cron.service';
export declare class MicroserviceController {
    private readonly cronService;
    private readonly diService;
    constructor(cronService: CronService, diService: DiService);
    listAllJobTemplate(): any;
    copiFolderContent(data_folder: any): any;
    listAllJobClientDetailed(data: any): Promise<string>;
    updateJob(data: any): any;
    createFrecuency(data: any): Promise<import("../models/frecuencia.schema").FrecuenciaInstanceI>;
    updateFrecuency(data: any): Promise<import("../models/frecuencia.schema").FrecuenciaInstanceI>;
    deleteJob(data: any): void;
    searchOneLogDB(data: any): Promise<any>;
    findAllLogs(): Promise<any>;
    findAllHistory(log_data: any): Promise<any>;
    actionSpecificCron(datos: any): void;
    loginDIS(user_data: any): Promise<any>;
    registrarseDIS(user_data: any): Promise<import("../models/login.schema").LoginInstanceI>;
}
