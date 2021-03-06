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
const mongoose_1 = require("@nestjs/mongoose");
const mongoosee = require("mongoose");
const mongoose_2 = require("mongoose");
const path = require("path");
const schedule_1 = require("@nestjs/schedule");
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
require('dotenv').config();
const db = mysql({
    config: {
        host: process.env.DB_DEV_HOST,
        port: process.env.DB_DEV_PORT,
        database: process.env.DB_DEV_DATABASE,
        user: process.env.DB_DEV_USER,
        password: process.env.DB_DEV_PASSWORD
    }
});
const db_prod = mysql({
    config: {
        host: 'localhost',
        port: '3306',
        database: 'logs_entry',
        user: 'root',
        password: '1234'
    }
});
let DiService = class DiService {
    constructor(schedulelerRegistry, frequencyModel, loginModel) {
        this.schedulelerRegistry = schedulelerRegistry;
        this.frequencyModel = frequencyModel;
        this.loginModel = loginModel;
        this.logger = new common_1.Logger();
        this.path_ktr_trabaja = (process.env.SystemRoot !== 'C:\\WINDOWS' ? path.join('/root', 'curie', 'jobs') : path.join('src', 'assets', 'jobs'));
        this.path_ktr_client = (process.env.SystemRoot !== 'C:\\WINDOWS' ? path.join('/root', 'curie', 'clientes') : path.join('src', 'assets', 'clientes'));
    }
    async findAll(orderByDate) {
        if (orderByDate != undefined) {
            return await this.frequencyModel.find().sort([["next_", 1]]);
        }
        else {
            return await this.frequencyModel.find();
        }
    }
    async findRecord(id) {
        this.logger.debug(`Search coleccion with ID ${id}`);
        return await this.frequencyModel.findOne({ _id: id });
    }
    async modifyRecord(name_job, frecuencia) {
        this.logger.debug(`modify frequency of ${name_job} to ${frecuencia}`);
        return await this.frequencyModel.findOneAndUpdate({ name: name_job }, frecuencia);
    }
    async createFrecuency(data_frecuency) {
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
        }
        catch (eorr) {
            this.logger.error(eorr);
        }
    }
    async updateFrecuency(data_frecuency) {
        this.logger.debug(`modify frequency of ${data_frecuency.name} to ${data_frecuency.datos}`);
        return this.frequencyModel.findOneAndUpdate({ name: data_frecuency.datos.name }, { plan: data_frecuency.datos.frecuencia, next_: data_frecuency.datos.next_ });
    }
    async listAllJobTemplate() {
        let array = [];
        await new Promise((resolve, reject) => {
            try {
                fs.readdirSync(`${this.path_ktr_trabaja}`).forEach(async (e) => {
                    array.push(e);
                });
                resolve(array);
                return array;
            }
            catch (error) {
                this.logger.error(error);
                reject(error);
            }
        });
        this.logger.debug(`Templates actuales -> ${array}`);
        return array;
    }
    async listAllJobClientDetailed(data) {
        let client_folder = data.client;
        let array_general = [];
        let frecuencia;
        frecuencia = await this.findAll();
        await new Promise(async (resolve, reject) => {
            await fs.readdirSync(path.join(this.path_ktr_client, client_folder)).forEach(async (e) => {
                let config_file = await xml2js.parseStringPromise(fs.readFileSync(path.join(this.path_ktr_client, client_folder, e, e + '.kjb')));
                let variables = {};
                let array_variables = [];
                config_file["job"]["entries"][0]["entry"].map(e => {
                    if (e["type"] == 'SET_VARIABLES') {
                        variables = {
                            name: e.name[0],
                            fields: e["fields"][0]
                        };
                        array_variables.push(variables);
                    }
                });
                array_variables.forEach(e => {
                    e["fields"]["field"].forEach(elem => {
                        elem["variable_name"] = elem["variable_name"][0];
                        elem["variable_value"] = elem["variable_value"][0];
                        elem["variable_type"] = elem["variable_type"][0];
                    });
                });
                let f, n, p;
                try {
                    f = frecuencia.find(element => element.name === e).plan;
                    n = frecuencia.find(element => element.name === e).next_;
                    p = frecuencia.find(element => element.name === e).arranque;
                }
                catch (err) {
                    console.log(err);
                    f = null;
                    n = null;
                }
                let obj = {
                    name: config_file["job"]["name"][0],
                    description: config_file["job"]["description"][0],
                    created_date: config_file["job"]["created_date"][0],
                    modified_date: config_file["job"]["modified_date"][0],
                    frecuencia: (f) ? f : null,
                    next_: (n) ? n : null,
                    arranque: (p) ? p : null,
                    variables: array_variables
                };
                array_general.push(obj);
            });
            resolve(array_general);
            return array_general;
        });
        this.logger.debug(array_general);
        return array_general;
    }
    async updateJob(data) {
        let name_job = data.job;
        let client_folder = data.client;
        let data_edit = data.datos;
        let array_source = [];
        console.log("Los datos que se van a añadir son:", data);
        data_edit.variables.forEach(e => {
            console.log(e["fields"]["field"].forEach(element => {
                array_source.push(element);
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
                            let p = array_source.find(ele => ele.variable_name == variable["variable_name"][0]);
                            variable["variable_value"][0] = p["variable_value"];
                        });
                    });
                }
                ;
            });
            let new_write = new xml2js.Builder().buildObject(edit_file);
            fs.writeFileSync(path.join(this.path_ktr_client, client_folder, name_job, name_job + '.kjb'), new_write);
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    deleteJob(data) {
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
        }
        catch (err) {
            console.log(err);
        }
        try {
            this.frequencyModel.deleteOne({ name: name_job }, function (err) {
                if (err)
                    console.log(err);
                console.log("Successful deletion");
            });
            this.logger.debug("Successful deletion");
        }
        catch (err) {
            this.logger.error(err);
        }
    }
    copiFolderContent(data_folder) {
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
                    if (err)
                        console.log('ERROR: ' + err);
                });
            });
        }
        catch (error) {
            this.logger.error(`No se pudo copiar la carpeta -> ${error}`);
        }
    }
    async searchOneLogDB(data) {
        try {
            (process.env.DEBUG == 'true') ? this.logger.debug(`The code is being used to ${process.env.OS_DEBUG}`) : this.logger.debug(`The code is being used to ${process.env.OS_PROD}`);
            if (process.env.DEBUG == 'true') {
                let result = await db.query(escape `select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`);
                await db.end();
                console.log("El resultado de la busqueda a la base de datos ", result);
                return result;
            }
            else {
                let result = await db_prod.query(escape `select * from logs_db where JOBNAME=${data.name} && ID_JOB=(select MAX(ID_JOB) from logs_db where JOBNAME=${data.name});`);
                await db_prod.end();
                console.log("El resultado de la busqueda a la base de datos ", result);
                return result;
            }
        }
        catch (error) {
            this.logger.error(`Fallo al recuperar el logs de la base de datos -> ${error}`);
        }
    }
    async findAllLogs() {
        try {
            if (process.env.DEBUG == 'true') {
                let result = await db.query(escape `select * from logs_db`);
                await db.end();
                return result;
            }
            else {
                let result = await db_prod.query(escape `select * from logs_db`);
                await db_prod.end();
                return result;
            }
        }
        catch (error) {
            this.logger.error(`Fallo al recuperar los logs de la base de datos -> ${error}`);
        }
    }
    async findAllHistory(log_data) {
        try {
            if (process.env.DEBUG == 'true') {
                let result = await db.query(escape `select * from logs_db where JOBNAME=${log_data.job}`);
                await db.end();
                console.log("Result", result);
                return result;
            }
            else {
                const result = await db_prod.query(escape `select * from logs_db where JOBNAME=${log_data.job}`);
                await db_prod.end();
                console.log("Result", result);
                return result;
            }
        }
        catch (error) {
            this.logger.error(`History error -> ${error}`);
        }
    }
    launchJob(client, job) {
        let pathToPentaho = path.join(__dirname, '../../../../../data-integration', 'Kitchen.bat');
        let pathToPentahoUbuntu = path.join('/root', 'curie', 'Proyecto-DIS', 'data-integration', 'kitchen.sh');
        try {
            if (process.env.DEBUG == 'true') {
                this.logger.debug(`Se esta ejecutando -> ${pathToPentaho} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`);
                exec(`${pathToPentaho} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`, function (error, stdout, stderr) {
                    if (stdout) {
                        console.log(stdout);
                    }
                    ;
                    if (stderr) {
                        console.log(stderr);
                    }
                    ;
                    console.log(stdout);
                });
            }
            else {
                this.logger.debug(`Se esta ejecutando -> sh ${pathToPentahoUbuntu} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`);
                exec(`sh ${pathToPentahoUbuntu} -file=${path.join(this.path_ktr_client, client, job, job + ".kjb")}`, function (error, stdout, stderr) {
                    if (stdout) {
                        console.log(stdout);
                    }
                    ;
                    if (stderr) {
                        console.log(stderr);
                    }
                    ;
                    console.log(stdout);
                });
            }
        }
        catch (error) {
            this.logger.error(`Error to launch -> ${error}`);
        }
    }
    async actionSpecificCron(interface_select, action) {
        if (action == 'stop') {
            try {
                this.logger.debug(`La interface a detener es -> ${interface_select} ...`);
                const job = this.schedulelerRegistry.getCronJob(interface_select);
                job.stop();
                this.logger.debug(`**Se ha detenido -> ${interface_select} **`);
            }
            catch (error) {
                this.logger.error(error);
            }
            try {
                await this.frequencyModel.findOneAndUpdate({ name: interface_select }, { arranque: 'stop' });
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        else if (action == 'start') {
            try {
                this.logger.debug(`La interface a iniciado es -> ${interface_select} ...`);
                const job = this.schedulelerRegistry.getCronJob(interface_select);
                job.start();
                this.logger.debug(`**Se ha inciado -> ${interface_select} **`);
            }
            catch (error) {
                this.logger.error(error);
            }
            await this.frequencyModel.findOneAndUpdate({ name: interface_select }, { arranque: 'start' });
        }
    }
    async registrarse(user_data) {
        console.log(user_data);
        let result = "";
        let dataUser;
        await this.loginModel.findOne({ userName: user_data.userName }, function (err, user) {
            try {
                if (user.userName == user_data.userName) {
                    result = "Error, already exists";
                }
            }
            catch (err) {
                if (!user) {
                    let id = mongoosee.Types.ObjectId();
                    const expiresIn = 24 * 60 * 60;
                    const accessToken = jwt.sign({ id: id }, SECRET_KEY, {
                        expiresIn: expiresIn
                    });
                    console.log(accessToken);
                    dataUser = [Object.assign(Object.assign({}, user_data), { accessToken: accessToken, expiresIn: expiresIn, _id: id })];
                    console.log(dataUser);
                }
            }
        });
        if (!dataUser)
            console.log("DATA", dataUser);
        return await (new this.loginModel(dataUser[0])).save();
    }
    async login(user_data) {
        console.log(user_data);
        let data_result;
        await this.loginModel.findOne({ userName: user_data.userName, password: user_data.password }, function (err, user) {
            if (err)
                return console.log(err);
            if (!user) {
                return "Algo esta mal";
            }
            else {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
                const dataUser = {
                    name: user.userName,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                };
                console.log("El usuario existe y estos son sus datos", dataUser);
                data_result = dataUser;
            }
        });
        return data_result;
    }
};
DiService = __decorate([
    common_1.Injectable(),
    __param(1, mongoose_1.InjectModel('frecuencias')),
    __param(2, mongoose_1.InjectModel('logins')),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        mongoose_2.Model,
        mongoose_2.Model])
], DiService);
exports.DiService = DiService;
//# sourceMappingURL=di.service.js.map