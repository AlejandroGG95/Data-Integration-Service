import { Injectable, Options, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FrecuenciaInstanceI } from '../models/frecuencia.schema';
import { LoginInstanceI } from '../models/login.schema';
import { JobsI } from '../../data-integration/models/jobs.interfaces';
import * as mongoosee from 'mongoose';
import { Model } from 'mongoose';
import path = require('path');
import { SchedulerRegistry } from '@nestjs/schedule';


const fs = require('fs');
const xml2js = require('xml2js');
const { execSync, exec } = require('child_process');
const mongoose = require('mongoose');
const ncp = require('ncp');
ncp.limit = 16;
const mysql = require('serverless-mysql');
const escape = require('sql-template-strings');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123456';

//require('dotenv').config({ path: '/root/program/.env' });
require('dotenv').config();

const db = mysql({
    config: {
        host: process.env.DB_DEV_HOST,
        port: process.env.DB_DEV_PORT,
        database: process.env.DB_DEV_DATABASE,
        user: process.env.DB_DEV_USER,
        password: process.env.DB_DEV_PASSWORD
    }
})

const db_prod = mysql({
    config: {
        host: 'localhost',
        port: '3306',
        database: 'logs_entry',
        user: 'root',
        password: '1234'
    }
})

/* 
const db_prod = mysql({
    config: {
        host: process.env.DB_PROD_HOST,
        port: process.env.DB_PROD_PORT,
        database: process.env.DB_PROD_DATABASE,
        user: process.env.DB_PROD_USER,
        password: process.env.DB_PROD_PASSWORD
    }
})
 */
@Injectable()
export class DiService {

    private readonly logger = new Logger();

    constructor(
        private schedulelerRegistry: SchedulerRegistry,
        @InjectModel('frecuencias') private frequencyModel: Model<FrecuenciaInstanceI>,
        @InjectModel('logins') private loginModel: Model<LoginInstanceI>
    ) { }

    path_ktr_trabaja = (process.env.SystemRoot !== 'C:\\WINDOWS' ? path.join('/root', 'program', 'jobs') : path.join('src', 'assets', 'jobs'));
    path_ktr_client = (process.env.SystemRoot !== 'C:\\WINDOWS' ? path.join('/root', 'program', 'clientes') : path.join('src', 'assets', 'clientes'));

    /* Las siguientes funciones son las correspondientes a las ejecuciones del cron */

    /**
     * Lista todos los cron que se han definido en el mongoose
     * @param orderByDate 
     */
    async findAll(orderByDate?: boolean): Promise<FrecuenciaInstanceI[]> {
        if (orderByDate != undefined) {
            return await this.frequencyModel.find().sort([["next_", 1]]);
        } else {
            return await this.frequencyModel.find();
        }
    }

    /**
     * Lista en concreto la frecuencia de un cron creado.
     * @param id 
     */
    async findRecord(id: string): Promise<FrecuenciaInstanceI> {
        this.logger.debug(`Search coleccion with ID ${id}`);
        return await this.frequencyModel.findOne({ _id: id });
    }

    /**
     * Se modifica la frecuencia de un cron creado.
     * @param name_job 
     * @param frecuencia 
     */
    async modifyRecord(name_job: string, frecuencia: FrecuenciaInstanceI): Promise<FrecuenciaInstanceI> {
        this.logger.debug(`modify frequency of ${name_job} to ${frecuencia}`);
        return await this.frequencyModel.findOneAndUpdate({ name: name_job }, frecuencia);
    }

    /**
     * Añadimos a mongodb la frecuencia del archivo que hemos indicado en el cliente que se ha pasado como parametro.
     * @param data_frecuency 
     */
    async createFrecuency(data_frecuency: any) {
        try {
            const newFrequency = new this.frequencyModel({
                name: data_frecuency.datos.name,
                client: data_frecuency.client,
                plan: data_frecuency.datos.frecuencia,
                next_: data_frecuency.datos.next_,
                arranque: data_frecuency.datos.arranque
            });
            this.logger.debug(`Nueva frecuencia creada --> ${newFrequency}`);
            return await newFrequency.save();
        } catch (eorr) {
            this.logger.error(eorr);
        }
    }

    /**
     * Escribir el fichero de frecuencia con la frecuencia que se ha definido a la hora de editar.
     * @param data_frecuency 
     */
    async updateFrecuency(data_frecuency: any) {
        this.logger.debug(`modify frequency of ${data_frecuency.name} to ${data_frecuency.datos}`);
        return this.frequencyModel.findOneAndUpdate({ name: data_frecuency.datos.name }, { plan: data_frecuency.datos.frecuencia, next_: data_frecuency.datos.next_ });
    }

    /**Se hace hasta aqui */

    /**
     * Listar todos los Jobs de las carpetas de templates.
     */
    async listAllJobTemplate() {
        let array = [];
        await new Promise((resolve, reject) => {
            try {
                fs.readdirSync(`${this.path_ktr_trabaja}`).forEach(async e => {
                    array.push(e);
                });
                resolve(array);
                return array
            } catch (error) {
                this.logger.error(error);
                reject(error)
            }
        });
        this.logger.debug(`Templates actuales -> ${array}`);
        return array;
    }

    /**
     * Lista el contenido de los Jobs de un cliente pero mas detallado devolviendo tambien las variables a editar
     * @param data 
     */
    async listAllJobClientDetailed(data: any): Promise<any> {
        /* let name_job = data.job; */
        let client_folder = data.client;
        let array_general = [];
        let frecuencia: any;

        frecuencia = await this.findAll();
        await new Promise(async (resolve, reject) => {
            await fs.readdirSync(path.join(this.path_ktr_client, client_folder)).forEach(async e => {
                let config_file = await xml2js.parseStringPromise(fs.readFileSync(path.join(this.path_ktr_client, client_folder, e, e + '.kjb')));
                let variables = {}
                let array_variables = [];
                config_file["job"]["entries"][0]["entry"].map(e => {
                    if (e["type"] == 'SET_VARIABLES') {
                        variables = {
                            name: e.name[0],
                            fields: e["fields"][0]
                        }
                        array_variables.push(variables);
                    }
                });
                array_variables.forEach(e => {
                    e["fields"]["field"].forEach(elem => {
                        elem["variable_name"] = elem["variable_name"][0]
                        elem["variable_value"] = elem["variable_value"][0]
                        elem["variable_type"] = elem["variable_type"][0]
                    })
                })
                let f, n, p;
                try {
                    f = frecuencia.find(element => element.name === e).plan
                    n = frecuencia.find(element => element.name === e).next_
                    p = frecuencia.find(element => element.name === e).arranque
                } catch (err) {
                    console.log(err)
                    f = null;
                    n = null;
                }
                let obj: JobsI = {
                    name: config_file["job"]["name"][0],
                    description: config_file["job"]["description"][0],
                    created_date: config_file["job"]["created_date"][0],
                    modified_date: config_file["job"]["modified_date"][0],
                    frecuencia: (f) ? f : null,
                    next_: (n) ? n : null,
                    arranque: (p) ? p : null,
                    variables: array_variables
                }
                array_general.push(obj);
            });
            resolve(array_general);
            return array_general
        });
        this.logger.debug(array_general);
        return array_general;

    }

    /**
     * Actualiza uno de los jobs que modificamos en la vista.
     * @param data 
     */
    async updateJob(data: any) {
        let name_job = data.job;
        let client_folder = data.client;
        let data_edit = data.datos
        let array_source = [];

        console.log("Los datos que se van a añadir son:", data);

        data_edit.variables.forEach(e => {
            console.log(e["fields"]["field"].forEach(element => {
                array_source.push(element)
            }));
        });
        try {
            let edit_file = await xml2js.parseStringPromise(fs.readFileSync(path.join(this.path_ktr_client, client_folder, name_job, name_job + '.kjb')));
            edit_file["job"]["name"][0] = data_edit["name"];
            edit_file["job"]["description"][0] = data_edit["description"];
            edit_file["job"]["entries"][0]["entry"].map(e => {
                if (e["type"] == 'SET_VARIABLES') {
                    e["fields"].forEach(element => {
                        element["field"].forEach(variable => {
                            let p = array_source.find(ele => ele.variable_name == variable["variable_name"][0])
                            variable["variable_value"][0] = p["variable_value"]
                        });
                    });
                };
            });
            let new_write = new xml2js.Builder().buildObject(edit_file);
            fs.writeFileSync(path.join(this.path_ktr_client, client_folder, name_job, name_job + '.kjb'), new_write);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Borramos de la base de datos de mongodb la frecuencia que le hemos indicado desde la vista.
     * @param data 
     */
    deleteJob(data: any) {
        this.logger.debug(`Se va a proceder a borrar de la DDBB: ${data}`);
        let name_job = data.job;
        let client_folder = data.client;
        let ruta = path.join(this.path_ktr_client, client_folder, name_job);
        try {
            if (fs.existsSync(ruta)) {
                fs.readdirSync(ruta).forEach(function (file) {
                    fs.unlinkSync(path.join(ruta, file));
                });
                fs.rmdirSync(ruta);
            }
            this.logger.debug("The route existed and has been deleted");
        } catch (err) {
            console.log(err);
        }
        try {
            this.frequencyModel.deleteOne({ name: name_job }, function (err) {
                if (err) console.log(err);
                console.log("Successful deletion");
            });
            this.logger.debug("Successful deletion");
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Copia la carpeta del template pasado por parametro y lo copia en el cliente indicado tambien por parametro.
     * @param data_folder This json contain the name of the cliente folder to destine and the name of the job folder to copy
     */
    copiFolderContent(data_folder: any) {
        let job_template_name = data_folder.origen;
        let client_folder = data_folder.destino;
        let new_name = data_folder.name;
        try {
            ncp(path.join(this.path_ktr_trabaja, job_template_name), path.join(this.path_ktr_client, client_folder, new_name), async (err) => {
                let conf = await xml2js.parseStringPromise(fs.readFileSync(path.join(this.path_ktr_client, client_folder, new_name, job_template_name + '.kjb')));
                conf["job"]["name"][0] = new_name;
                conf = new xml2js.Builder().buildObject(conf);
                await fs.writeFileSync(path.join(this.path_ktr_client, client_folder, new_name, job_template_name + '.kjb'), conf);
                if (err) {
                    this.logger.error(`Error while copying folder contents ${err}`);
                    return;
                }
                await fs.rename(path.join(this.path_ktr_client, client_folder, new_name, job_template_name + '.kjb'), path.join(this.path_ktr_client, client_folder, new_name, new_name + '.kjb'), function (err) {
                    if (err) console.log('ERROR: ' + err);
                });
            });
        } catch (error) {
            this.logger.error(`No se pudo copiar la carpeta -> ${error}`);
        }
    }

    /**
     * Nos conectamos al mysql para obtener el registro log deseado.
     */
    async searchOneLogDB(data) {
        try {
            (process.env.DEBUG == 'true') ? this.logger.debug(`The code is being used to ${process.env.OS_DEBUG}`) : this.logger.debug(`The code is being used to ${process.env.OS_PROD}`);
            if (process.env.DEBUG == 'true') {
                //console.log(`Se esta realizando la consulta = select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`)
                let result = await db.query(escape`select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`)
                await db.end();
                console.log("El resultado de la busqueda a la base de datos ", result)
                return result
            } else {
                //console.log(`select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`);
                let result = await db_prod.query(escape`select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`)
                await db_prod.end();
                console.log("El resultado de la busqueda a la base de datos ", result)
                return result
            }
        } catch (error) {
            this.logger.error(`Fallo al recuperar el logs de la base de datos -> ${error}`);
        }
    }

    /**
     * Solicitamos a la base de datos todos los logs que tenemos disponible en la base de datos.
     */
    async findAllLogs() {
        try {
            if (process.env.DEBUG == 'true') {
                let result = await db.query(escape`select * from logs_db`)
                await db.end();
                return result
            } else {
                let result = await db_prod.query(escape`select * from logs_db`)
                await db_prod.end();
                return result
            }
        } catch (error) {
            this.logger.error(`Fallo al recuperar los logs de la base de datos -> ${error}`);
        }
    }

    /**
     * Listar el historico de todos los logs pertenecientes a un determinado Job
     * @param log_data 
     */
    async findAllHistory(log_data) {
        try {
            if (process.env.DEBUG == 'true') {
                let result = await db.query(escape`select * from logs_db where JOBNAME=${log_data.job}`)
                await db.end();
                console.log("Result", result);
                return result
            } else {
                const result = await db_prod.query(escape`select * from logs_db where JOBNAME=${log_data.job}`)
                await db_prod.end();
                console.log("Result", result);
                return result
            }
        } catch (error) {
            this.logger.error(`History error -> ${error}`);
        }
    }

    /**
     * Lanzar el script que ejecuta le Job en pentaho local
     */
    launchJob(client: string, job: string) {
        let pathToPentaho = path.join(__dirname, '../../../../../data-integration', 'Kitchen.bat');
        let pathToPentahoUbuntu = path.join('/root', 'program', 'Proyecto-DIS', 'data-integration', 'kitchen.sh');

        try {
            if (process.env.DEBUG == 'true') {
                this.logger.debug(`Se esta ejecutando -> ${pathToPentaho} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`);
                exec(`${pathToPentaho} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`, function (error, stdout, stderr) {
                    if (stdout) { console.log(stdout) };
                    if (stderr) { console.log(stderr) };
                    console.log(stdout);
                });
            } else {
                this.logger.debug(`Se esta ejecutando -> sh ${pathToPentahoUbuntu} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`);
                exec(`sh ${pathToPentahoUbuntu} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`, function (error, stdout, stderr) {
                    if (stdout) { console.log(stdout) };
                    if (stderr) { console.log(stderr) };
                    console.log(stdout);
                });
            }
        } catch (error) {
            this.logger.error(`Error to launch -> ${error}`);
        }
        /* file=/home/pentaho/pentaho-server/data-integration/jobs/Progreso.kjb - level=Minimal */
    }

    /**
     * Inicia o detiene una interfaces segun se requiera y almacena su estado en mongodb
     * @param interface_select 
     * @param action 
     */
    async actionSpecificCron(interface_select, action) {
        if (action == 'stop') {
            try {
                this.logger.debug(`La interface a detener es -> ${interface_select} ...`);
                const job = this.schedulelerRegistry.getCronJob(interface_select);
                job.stop();
                this.logger.debug(`**Se ha detenido -> ${interface_select} **`);

            } catch (error) {
                this.logger.error(error);
            }
            try {
                await this.frequencyModel.findOneAndUpdate({ name: interface_select }, { arranque: 'stop' });
            } catch (error) {
                this.logger.error(error);
            }
        } else if (action == 'start') {
            try {
                this.logger.debug(`La interface a iniciado es -> ${interface_select} ...`);
                const job = this.schedulelerRegistry.getCronJob(interface_select);
                job.start();
                this.logger.debug(`**Se ha inciado -> ${interface_select} **`);
            } catch (error) {
                this.logger.error(error);
            }
            await this.frequencyModel.findOneAndUpdate({ name: interface_select }, { arranque: 'start' });
        }
    }

    /*Funcionalidades de login y registry*/

    /**
     * Registra un nuevo usuario en la base de datos con encriptado
     * @param user_data Datos del usuario que se va a registrar
     */
    async registrarse(user_data) {
        console.log(user_data);
        let result = "";
        let dataUser;
        /* const resultPassword = bcrypt.compareSync(user_data.password) */
        await this.loginModel.findOne({ userName: user_data.userName }, function (err, user) {
            try {
                if (user.userName == user_data.userName) { result = "Error, already exists" }
            } catch (err) {
                if (!user) {
                    /* if (err) return console.log(err); */
                    let id: mongoosee.Types.ObjectId = mongoosee.Types.ObjectId();
                    const expiresIn = 24 * 60 * 60;
                    const accessToken = jwt.sign({ id: id },
                        SECRET_KEY, {
                        expiresIn: expiresIn
                    });
                    console.log(accessToken)
                    dataUser = [{ ...user_data, accessToken: accessToken, expiresIn: expiresIn, _id: id }];
                    console.log(dataUser);
                }
            }
        });
        if (!dataUser)
            console.log("DATA", dataUser)
        return await (new this.loginModel(dataUser[0])).save();
    }

    /**
     * Funcion de Login 
     * @param user_data 
     */
    async login(user_data) {
        console.log(user_data);
        let data_result;
        /* const resultPassword = bcrypt.compareSync(user_data.password) */
        await this.loginModel.findOne({ userName: user_data.userName, password: user_data.password }, function (err, user) {
            if (err) return console.log(err);
            if (!user) {
                return "Algo esta mal";
            } else {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
                const dataUser = {
                    name: user.userName,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                console.log("El usuario existe y estos son sus datos", dataUser)
                data_result = dataUser;
            }
        });
        return data_result
    }
}