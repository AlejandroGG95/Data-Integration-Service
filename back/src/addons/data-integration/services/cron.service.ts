import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { JobsI } from '../models/jobs.interfaces'
import { FrecuenciaInstanceI } from '../models/frecuencia.schema';
import { dayList, normalDayList } from '../../../utils/date.utils';
import { CronJob } from 'cron';
import { DiService } from './di.service';
import { pathToFileURL } from 'url';

@Injectable()
export class CronService {

    private readonly logger = new Logger(CronService.name);

    constructor(private scheduler: SchedulerRegistry,
        private jobService: DiService) { }

    @Cron('0 0 0 * * *', {
        name: 'master_cron',
    })
    triggerNotifications() {
        console.log("Lanzamos trigger")
        this.scheduleDay()
    }

    // Actualiza una variable date a una hora y minutos dados
    setCorrectHour(date: Date, hours: number, minutes: number) {
        console.log("Comocamos horas")
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date
    }

    // Planifica aquellos registros que tengan que ejecutarse en algún momento del día actual, de entre aquellos
    // que no sean tiempo 'hours-minute'
    async scheduleDay() {
        console.log("scheduleDay")
        let jobs: Array<any>;
        const actualDate = new Date();
        await this.jobService.findAll(true).then(values => {
            jobs = values
        });
        for (let job of jobs) {
            if (job.plan.time_u !== 'hours-minute') {
                let jobDate = new Date(job.next_)
                console.log("CRON MAESTRO HOURS-MINUTE")
                if (jobDate.getTime() < ((actualDate).getTime())) {
                    // Aquí se haría la llamada a aquel código que queramos ejecutar en la planificación,
                    // en mi caso algorimos de machine learning
                    let next_: Date = this.getNextDate(actualDate, job.frecuencia)
                    next_ = this.setCorrectHour(next_, job.next_.getHours(), job.next_.getMinutes())
                    this.updateNextDataBase(job._id.toHexString(), next_)

                    //No lo tengo claro, posiblemente si es solución deberia solicitar el nombre tambien del ficho este.
                    //this.jobService.launchJob('kerosur', data.datos.name)
                }
                else {
                    console.log("CRON MAESTRO HOURS-MINUTE ELSE")
                    if (job.next_.getDate() === actualDate.getDate() &&
                        job.next_.getMonth() === actualDate.getMonth() &&
                        job.next_.getFullYear() === actualDate.getFullYear()) {
                        this.addTimeout(job._id.toHexString(), job.next_, job.frecuencia)
                    }

                }
            }
        }
    }

    // Actualiza la database con la nueva fecha
    updateNextDataBase(name: string, next: Date) {
        this.jobService.findRecord(name).then(values => {
            const newFrecuencia: FrecuenciaInstanceI = values
            console.log(newFrecuencia)
            newFrecuencia.next_ = next
            this.jobService.modifyRecord(name, newFrecuencia)
        });
    }


    // Añade un timeout para la eecución de los registros que el cron maestro
    // haya seleccionado para ejecutar hoy
    addTimeout(name: string, date: Date, plan: Object) {
        let next_: Date;

        const callback = () => {
            console.log("Se ejecuta bien")
            next_ = this.getNextDate(date, plan);
            this.updateNextDataBase(name, next_)
            console.log("CRON MAESTRO DATE", name, date, plan)
            // console.log("next ", next_)
            // this.setNextDataBase(name, next_)
            // this.deleteTimeout(name)
            // this.addTimeout(name, next_, plan);
        };

        const actualDate = new Date()
        const seconds = date.getTime() - actualDate.getTime()
        console.log(seconds)
        const timeout = setTimeout(callback, seconds);
        this.scheduler.addTimeout(name, timeout);
    }

    // Calcula la siguiente fecha en la que el cron maestro debe ejecutar un registro
    // no aplica para registros com time_u 'hours-minute'
    getNextDate(date: Date, plan) {
        console.log("getNextDate", plan)
        let newDate = new Date(date.getTime());
        switch (plan.time_u) {
            case 'day': {
                newDate.setDate(newDate.getDate() + Number(plan.time_n))
                console.log("dia", newDate)
                break;
            }
            case 'week': {
                newDate = this.getNextDateWeek(date, plan)
                console.log("semana", newDate)
                break;
            }
            case 'month': {
                newDate.setMonth(newDate.getMonth() + Number(plan.time_n))
                console.log("mes", newDate)
                break;
            }
            case 'year': {
                newDate.setFullYear(newDate.getFullYear() + Number(plan.time_n))
                console.log("año", newDate)
                break;
            }
            default: {
                break;
            }
        }
        return newDate;
    }

    // Para el caso de time_u == 'week' calcula el siguiente día en el que debe ejecutarse
    // el registro
    getNextDateWeek(date: Date, plan) {
        let arrDays = plan.time_data.repeat_on;
        const actualDay = dayList[date.getDay()]
        let nextDay = 'Sunday';
        let dayDifference: number = 0

        if (arrDays.length > 1) {
            if ((actualDay == arrDays[0]) && (arrDays[0] == 'Sunday')) {
                nextDay = arrDays[1];
                dayDifference += ((plan.time_n - 1) * 7)
            }
            else {
                if (normalDayList.indexOf(actualDay) >= normalDayList.indexOf(arrDays[arrDays.length - 1])) {
                    nextDay = arrDays[0];
                }
                else {
                    for (let day of arrDays) {
                        // Que nextDay tenga por defecto 'Sunday' es por esto
                        if (normalDayList.indexOf(day) > normalDayList.indexOf(actualDay)) {
                            if (normalDayList.indexOf(day) < normalDayList.indexOf(nextDay)) {
                                nextDay = day;
                            }
                        }
                    }
                }

            }
        }
        else {
            nextDay = actualDay;
            dayDifference += ((plan.time_n - 1) * 7)
        }

        dayDifference += this.getDayDifference(actualDay, nextDay, plan);
        if (nextDay === arrDays[0] && nextDay != 'Sunday') {
            dayDifference += ((plan.time_n - 1) * 7)
        }

        const nextDate: Date = new Date(date.getTime())
        nextDate.setDate(date.getDate() + dayDifference)

        return nextDate;

    }

    // Obtiene la cantidad de días que separan a dos días de una semana
    getDayDifference(actualDay: string, nextDay: string, plan) {
        const actualIndex: number = normalDayList.indexOf(actualDay)
        const nextIndex: number = normalDayList.indexOf(nextDay)
        let difference: number;
        if (nextIndex <= actualIndex) {
            difference = (7 + nextIndex) - actualIndex;
        }
        else {
            difference = nextIndex - actualIndex;
        }


        return difference
    }

    // Añade un cron dinámico de un registro
    // Solo aplica para los de time_u == 'hours-minute'
    // El resto son gestionados mediante el cron maestro
    addCronJob(name: string, time_data, data: any) {
        let minutes: string;
        let hours: string;

        if (time_data.hourType === 'each one') {
            hours = '*'
        }
        else if (time_data.hourType === 'every') {
            hours = '*/' + time_data.hours;
        }
        else {
            hours = time_data.hours;
        }

        if (time_data.minuteType === 'each one') {
            minutes = '*'
        }
        else if (time_data.minuteType === 'every') {
            minutes = '*/' + time_data.minutes;
        }
        else {
            minutes = time_data.minutes
        }

        let cronString: string = "0 ";
        cronString += minutes + ' ';
        cronString += hours + ' * * *'
        console.log(cronString)
        const job = new CronJob(cronString, () => {
            this.logger.warn(`job ${name} to run!`);
            this.jobService.launchJob('kerosur', data.datos.name)
        });

        this.scheduler.addCronJob(name, job);
        job.start();

        this.logger.warn(
            `job ${name} added!`,
        );
    }

    // Elimina un cron dinámico
    // Solo aplica para los de time_u == 'hours-minute'
    deleteCron(name: string) {
        console.log(name);
        this.scheduler.deleteCronJob(name);
        this.logger.warn(`job ${name} deleted!`);
    }

    // Obtiene un cron por su id
    getCronJob(id: string) {
        return this.scheduler.getCronJob(id)
    }

    // Obtiene un array con todos los IDs de los cron activos
    getCronsID() {
        const jobs = this.scheduler.getCronJobs();
        let jobsId = []
        jobs.forEach((value, key, map) => {
            jobsId.push(key)
        });
        return jobsId;
    }

    // Se utiliza para relanzar los crons dinámicos de los registros de tipo time_u == 'hours-minutes'
    async restoreCrons() {
        let jobs: Array<any>;
        await this.jobService.findAll(true).then(values => {
            jobs = values
        });
        for (let job of jobs) {
            if (job.frecuencia) {
                if (job.frecuencia.time_u === 'hours-minutes') {
                    console.log(job._id.toHexString());
                    this.addCronJob(job._id.toHexString(), job.frecuencia.time_data, '')
                }
            }
        }
        console.log(this.getCronsID())
    }

    getTimeouts() {
        const timeouts = this.scheduler.getTimeouts();
        timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
      }
      
}