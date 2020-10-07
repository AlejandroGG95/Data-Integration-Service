import { SchedulerRegistry } from '@nestjs/schedule';
import { DiService } from './di.service';
export declare class CronService {
    private scheduler;
    private jobService;
    private readonly logger;
    constructor(scheduler: SchedulerRegistry, jobService: DiService);
    triggerNotifications(): void;
    setCorrectHour(date: Date, hours: number, minutes: number): Date;
    scheduleDay(): Promise<void>;
    updateNextDataBase(name: string, next: Date): void;
    addTimeout(name: string, date: Date, plan: Object): void;
    getNextDate(date: Date, plan: any): Date;
    getNextDateWeek(date: Date, plan: any): Date;
    getDayDifference(actualDay: string, nextDay: string, plan: any): number;
    addCronJob(name: string, time_data: any, data: any): void;
    deleteCron(name: string): void;
    getCronJob(id: string): any;
    getCronsID(): any[];
    restoreCrons(): Promise<void>;
    getTimeouts(): void;
}
