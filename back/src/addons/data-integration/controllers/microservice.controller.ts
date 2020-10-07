import { Controller, Request, Post, Get, UseGuards, Redirect, Query, Req, Body } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import { DiService } from './../services/di.service';
import { CronService } from 'src/addons/data-integration/services/cron.service';

const fs = require('fs');

@Controller('microservice')
export class MicroserviceController {

    constructor(private readonly cronService: CronService,
        private readonly diService: DiService) {
        // Llama a la función que relanza todos los cron dinámicos de tipo 'hours-minutes'
        cronService.restoreCrons();
    }

    @Get('listAllTemplates')
    listAllJobTemplate(): any {
        try {
            return this.diService.listAllJobTemplate().then(function (result) {
                //console.log(result);
                return result;
            });
        } catch (Exception) {
            return Exception;
        }
    }

    /**
     * Cuando creamos un nuevo Job apartir de un template copiamos dicho template y lo pegamos en la carpeta 
     * del cliente con el nombre elegido.
     * @param data_folder json
     */
    @Post('copyFolder')
    copiFolderContent(@Body() data_folder): any {
        try {
            return this.diService.copiFolderContent(data_folder);
        } catch (Exception) {
            return Exception;
        }
    }

    /**
     * Devuelve un array con todos los Job siguiendo la estructura de la interface Job.
     * @param data json de datos
     */
    @Post('listAllJobClientDetailed')
    listAllJobClientDetailed(@Body() data): Promise<string> {
        return this.diService.listAllJobClientDetailed(data);
    }

    /**
     * Para actualizar un job seleccionado desde la vista.
     * @param data json de datos
     */
    @Post('updateJob')
    updateJob(@Body() data) {
        try{
        return this.diService.updateJob(data);
        }catch(error){
            console.log(error);
            return error
        }
    }

    /**
     * Siguiendo un formato de freciencia añadimos dicha freciencia al mongo asociada al un cliente y un job.
     * @param data 
     */
    @Post('createFrecuency')
    createFrecuency(@Body() data) {
        const jobs = this.cronService.getCronsID();
        if (jobs.includes(data.datos.name)) {
            this.cronService.deleteCron(data.datos.name)
        }
        if (data.datos.frecuencia.time_u == 'hours-minutes') {
            console.log("Añadir a hours-minutes")
            this.cronService.addCronJob(data.datos.name, data.datos.frecuencia.time_data, data);
        }
        return this.diService.createFrecuency(data);
    }

    /**
     * Actualizamos la freciencia en el mongo de el job de un cliente.
     * @param data json
     */
    @Post('updateFrecuency')
    updateFrecuency(@Body() data) {
        const jobs = this.cronService.getCronsID();
        console.log("El CAMBIO DE FRECUENCIA ANTES DEL CRON", jobs);
        console.log("El CAMBIO DE FRECUENCIA ANTES DEL CRON", data);
        if (jobs.includes(data.datos.name)) {
            this.cronService.deleteCron(data.datos.name)
        }
        if (data.datos.frecuencia.time_u == 'hours-minutes') {
            console.log("Añadir a hours-minutes")
            this.cronService.addCronJob(data.datos.name, data.datos.frecuencia.time_data, data);
        }
        return this.diService.updateFrecuency(data);
    }

    /**
     * Borramos la carpeta de Job seleccionada asi como los registros en mongo.
     * @param data 
     */
    @Post('deleteJob')
    deleteJob(@Body() data) {
        return this.diService.deleteJob(data);
    }

    @Post('searchOneLogDB')
    searchOneLogDB(@Body() data) {
        return this.diService.searchOneLogDB(data)
    }

    @Post('findAllLogs')
    findAllLogs() {
        return this.diService.findAllLogs();
    }

    @Post('findAllHistory')
    findAllHistory(@Body() log_data) {
        return this.diService.findAllHistory(log_data);
    }

    @Post('actionSpecificCron')
    actionSpecificCron(@Body() datos) {
        console.log(datos.job)
        console.log(datos.action)
        this.diService.actionSpecificCron(datos.job, datos.action);
    }

    @Post('login')
    loginDIS(@Body() user_data) {
        return this.diService.login(user_data).then(res => {
            console.log("Respuesta", res)
            return res
        });
    }

    @Post('registrar')
    registrarseDIS(@Body() user_data) {
        return this.diService.registrarse(user_data);
    }
}
