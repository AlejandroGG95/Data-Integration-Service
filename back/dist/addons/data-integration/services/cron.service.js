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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const date_utils_1 = require("../../../utils/date.utils");
const cron_1 = require("cron");
const di_service_1 = require("./di.service");
let CronService = CronService_1 = class CronService {
    constructor(scheduler, jobService) {
        this.scheduler = scheduler;
        this.jobService = jobService;
        this.logger = new common_1.Logger(CronService_1.name);
    }
    triggerNotifications() {
        console.log("Lanzamos trigger");
        this.scheduleDay();
    }
    setCorrectHour(date, hours, minutes) {
        console.log("Comocamos horas");
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
    async scheduleDay() {
        console.log("scheduleDay");
        let jobs;
        const actualDate = new Date();
        await this.jobService.findAll(true).then(values => {
            jobs = values;
        });
        for (let job of jobs) {
            if (job.plan.time_u !== 'hours-minute') {
                let jobDate = new Date(job.next_);
                console.log("CRON MAESTRO HOURS-MINUTE");
                if (jobDate.getTime() < ((actualDate).getTime())) {
                    let next_ = this.getNextDate(actualDate, job.frecuencia);
                    next_ = this.setCorrectHour(next_, job.next_.getHours(), job.next_.getMinutes());
                    this.updateNextDataBase(job._id.toHexString(), next_);
                }
                else {
                    console.log("CRON MAESTRO HOURS-MINUTE ELSE");
                    if (job.next_.getDate() === actualDate.getDate() &&
                        job.next_.getMonth() === actualDate.getMonth() &&
                        job.next_.getFullYear() === actualDate.getFullYear()) {
                        this.addTimeout(job._id.toHexString(), job.next_, job.frecuencia);
                    }
                }
            }
        }
    }
    updateNextDataBase(name, next) {
        this.jobService.findRecord(name).then(values => {
            const newFrecuencia = values;
            console.log(newFrecuencia);
            newFrecuencia.next_ = next;
            this.jobService.modifyRecord(name, newFrecuencia);
        });
    }
    addTimeout(name, date, plan) {
        let next_;
        const callback = () => {
            console.log("Se ejecuta bien");
            next_ = this.getNextDate(date, plan);
            this.updateNextDataBase(name, next_);
            console.log("CRON MAESTRO DATE", name, date, plan);
        };
        const actualDate = new Date();
        const seconds = date.getTime() - actualDate.getTime();
        console.log(seconds);
        const timeout = setTimeout(callback, seconds);
        this.scheduler.addTimeout(name, timeout);
    }
    getNextDate(date, plan) {
        console.log("getNextDate", plan);
        let newDate = new Date(date.getTime());
        switch (plan.time_u) {
            case 'day': {
                newDate.setDate(newDate.getDate() + Number(plan.time_n));
                console.log("dia", newDate);
                break;
            }
            case 'week': {
                newDate = this.getNextDateWeek(date, plan);
                console.log("semana", newDate);
                break;
            }
            case 'month': {
                newDate.setMonth(newDate.getMonth() + Number(plan.time_n));
                console.log("mes", newDate);
                break;
            }
            case 'year': {
                newDate.setFullYear(newDate.getFullYear() + Number(plan.time_n));
                console.log("año", newDate);
                break;
            }
            default: {
                break;
            }
        }
        return newDate;
    }
    getNextDateWeek(date, plan) {
        let arrDays = plan.time_data.repeat_on;
        const actualDay = date_utils_1.dayList[date.getDay()];
        let nextDay = 'Sunday';
        let dayDifference = 0;
        if (arrDays.length > 1) {
            if ((actualDay == arrDays[0]) && (arrDays[0] == 'Sunday')) {
                nextDay = arrDays[1];
                dayDifference += ((plan.time_n - 1) * 7);
            }
            else {
                if (date_utils_1.normalDayList.indexOf(actualDay) >= date_utils_1.normalDayList.indexOf(arrDays[arrDays.length - 1])) {
                    nextDay = arrDays[0];
                }
                else {
                    for (let day of arrDays) {
                        if (date_utils_1.normalDayList.indexOf(day) > date_utils_1.normalDayList.indexOf(actualDay)) {
                            if (date_utils_1.normalDayList.indexOf(day) < date_utils_1.normalDayList.indexOf(nextDay)) {
                                nextDay = day;
                            }
                        }
                    }
                }
            }
        }
        else {
            nextDay = actualDay;
            dayDifference += ((plan.time_n - 1) * 7);
        }
        dayDifference += this.getDayDifference(actualDay, nextDay, plan);
        if (nextDay === arrDays[0] && nextDay != 'Sunday') {
            dayDifference += ((plan.time_n - 1) * 7);
        }
        const nextDate = new Date(date.getTime());
        nextDate.setDate(date.getDate() + dayDifference);
        return nextDate;
    }
    getDayDifference(actualDay, nextDay, plan) {
        const actualIndex = date_utils_1.normalDayList.indexOf(actualDay);
        const nextIndex = date_utils_1.normalDayList.indexOf(nextDay);
        let difference;
        if (nextIndex <= actualIndex) {
            difference = (7 + nextIndex) - actualIndex;
        }
        else {
            difference = nextIndex - actualIndex;
        }
        return difference;
    }
    addCronJob(name, time_data, data) {
        let minutes;
        let hours;
        if (time_data.hourType === 'each one') {
            hours = '*';
        }
        else if (time_data.hourType === 'every') {
            hours = '*/' + time_data.hours;
        }
        else {
            hours = time_data.hours;
        }
        if (time_data.minuteType === 'each one') {
            minutes = '*';
        }
        else if (time_data.minuteType === 'every') {
            minutes = '*/' + time_data.minutes;
        }
        else {
            minutes = time_data.minutes;
        }
        let cronString = "0 ";
        cronString += minutes + ' ';
        cronString += hours + ' * * *';
        console.log(cronString);
        const job = new cron_1.CronJob(cronString, () => {
            this.logger.warn(`job ${name} to run!`);
            this.jobService.launchJob('kerosur', data.datos.name);
        });
        this.scheduler.addCronJob(name, job);
        job.start();
        this.logger.warn(`job ${name} added!`);
    }
    deleteCron(name) {
        console.log(name);
        this.scheduler.deleteCronJob(name);
        this.logger.warn(`job ${name} deleted!`);
    }
    getCronJob(id) {
        return this.scheduler.getCronJob(id);
    }
    getCronsID() {
        const jobs = this.scheduler.getCronJobs();
        let jobsId = [];
        jobs.forEach((value, key, map) => {
            jobsId.push(key);
        });
        return jobsId;
    }
    async restoreCrons() {
        let jobs;
        await this.jobService.findAll(true).then(values => {
            jobs = values;
        });
        for (let job of jobs) {
            if (job.frecuencia) {
                if (job.frecuencia.time_u === 'hours-minutes') {
                    console.log(job._id.toHexString());
                    this.addCronJob(job._id.toHexString(), job.frecuencia.time_data, '');
                }
            }
        }
        console.log(this.getCronsID());
    }
    getTimeouts() {
        const timeouts = this.scheduler.getTimeouts();
        timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
    }
};
__decorate([
    schedule_1.Cron('0 0 0 * * *', {
        name: 'master_cron',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "triggerNotifications", null);
CronService = CronService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        di_service_1.DiService])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map