import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { dayList } from '../../../utils/dateUtils';
import { PlanJson, Jobs, jobsJson } from '../jobs';
import { HttpService } from '../../../services/http.service';

// Vista modal para crear un registro

@Component({
  selector: 'app-modal-plan',
  templateUrl: './modal-plan.component.html',
  styleUrls: ['./modal-plan.component.css']
})
export class ModalPlanComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  @Input() dataPlan: Jobs;
  @Output() someEvent = new EventEmitter();
  @ViewChild('basicData') public fecha: any;

  periodicityType = 'daily or more';
  plan: PlanJson;
  time: Date;
  date: Date;
  next_ = null;
  hourType = 'each one';
  minuteType = 'each one';
  hourFromStart: Date = new Date();
  hourFromEnd: Date = new Date();
  minuteFromStart: Date = new Date();
  minuteFromEnd: Date = new Date();
  hourEvery = 1;
  minuteEvery = 1;
  arranque = "start";

  isVisible: boolean = false;
  isOkLoading: boolean = false;
  @Input() buttonName: string;

  // Booleanos para escoger horas específicas
  hourBoolean = {
    '00': false, '01': false, '02': false,
    '03': false, '04': false, '05': false,
    '06': false, '07': false, '08': false,
    '09': false, 10: false, 11: false,
    12: false, 13: false, 14: false,
    15: false, 16: false, 17: false,
    18: false, 19: false, 20: false,
    21: false, 22: false, 23: false
  };

  // Booleanos para escoger días específicos
  weekBoolean = {
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  };


  // Inicializa los valores que apareceran por defecto en los valores de frecuencia del modal,
  // Si el registro ya está planificado aparecerán los valores preexistentes del mismo
  // En caso contrario los por defecto
  ngOnInit() {
    this.initializeWeek();
    this.initializeHours();
    this.initializeMinutes();
    if (this.dataPlan.frecuencia !== null) {
      //let date = new Date(this.dataPlan.next_);
      this.plan = {
        time_n: this.dataPlan.frecuencia.time_n,
        time_u: this.dataPlan.frecuencia.time_u,
        time_data: null
      };
      if (this.plan.time_u === 'hours-minutes') {
        this.periodicityType = 'less than daily';
      }
      /*  this.time = date;
       this.date = date; */
      this.time = this.dataPlan.next_;
      this.date = this.dataPlan.next_;
    }
    else {
      this.plan = {
        time_n: 1,
        time_u: 'day',
        time_data: null
      };
      this.time = null;
      this.date = null;
    }
  }

  // Obtiene las keys de un objeto
  keys(a: any): string[] { return Object.keys(a); }

  // Inicializa los valores del booleano de días, si el registro ya está planificado tendrá
  // los valores de este, si no tendrá a true únicamente el día de la semana en el que nos
  // encontremos actualmente
  initializeWeek() {
    if (this.dataPlan.frecuencia !== null) {
      if (this.dataPlan.frecuencia.time_u === 'week') {
        for (const day in this.dataPlan.frecuencia.time_data.repeat_on) {
          this.weekBoolean[this.dataPlan.frecuencia.time_data.repeat_on[day]] = true;
        }
      }
    }
    else {
      const date = new Date();
      const dateDay = date.getDay();
      this.weekBoolean[dayList[dateDay]] = true;
    }
  }

  // Inicializa el campo de horas para aquellos registros que sean de tipo 'hours-minutes'
  initializeHours() {
    if (this.dataPlan.frecuencia !== null) {
      if (this.dataPlan.frecuencia.time_u === 'hours-minutes') {
        this.hourType = this.dataPlan.frecuencia.time_data.hourType;
        switch (this.hourType) {
          case 'at':
            this.hourFromStart.setHours(Number(this.dataPlan.frecuencia.time_data.hours));
            break;
          case 'from':
            const arrFrom = this.dataPlan.frecuencia.time_data.hours.split('-');
            this.hourFromStart.setHours(Number(arrFrom[0]));
            this.hourFromStart.setHours(Number(arrFrom[1]));
            break;
          case 'every':
            const every = this.dataPlan.frecuencia.time_data.hours;
            this.hourEvery = Number(every);
            break;
          case 'specific':
            const arrHours = this.dataPlan.frecuencia.time_data.hours.split(',');
            for (const hour of arrHours) {
              this.hourBoolean[hour] = true;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // Inicializa el campo de minutos para aquellos registros que sean de tipo 'hours-minutes'
  initializeMinutes() {
    if (this.dataPlan.frecuencia !== null) {
      if (this.dataPlan.frecuencia.time_u === 'hours-minutes') {
        this.minuteType = this.dataPlan.frecuencia.time_data.minuteType;
        switch (this.minuteType) {
          case 'at':
            this.minuteFromStart.setMinutes(Number(this.dataPlan.frecuencia.time_data.minutes));
            break;
          case 'from':
            const arrFrom = this.dataPlan.frecuencia.time_data.minutes.split('-');
            this.minuteFromStart.setMinutes(Number(arrFrom[0]));
            this.minuteFromStart.setMinutes(Number(arrFrom[1]));
            break;
          case 'every':
            const every = this.dataPlan.frecuencia.time_data.minutes;
            this.minuteEvery = Number(every);
            break;
          default:
            break;
        }
      }
    }
  }

  // Devuelve la fecha inicial del registro en función de los valores obtenidos en el formulario
  makeDate() {
    const date = new Date();
    date.setDate(this.date.getDate());
    date.setMonth(this.date.getMonth());
    date.setFullYear(this.date.getFullYear());
    date.setHours(this.time.getHours());
    date.setMinutes(this.time.getMinutes());
    date.setSeconds(0);
    date.setMilliseconds(0);
    console.log("Fecha a poner en Next", date)
    this.next_ = new Date(date);
  }

  // Cambia el valor de un día en el array de días en función de si el usuario marca o no
  // la casilla de ese día
  checkChangeWeek(e: boolean, day: string): void {
    this.weekBoolean[day] = e;
  }

  // Cambia el valor de un día en el array de días en función de si el usuario marca o no
  // la casilla de ese día
  checkChange(e: boolean, day: string): void {
    this.weekBoolean[day] = e;
    //console.log(this.weekBoolean[day]);
  }

  // Cambia el valor de una hora en el array de horas en función de si el usuario marca o no
  // la casilla de ese día
  checkChangeHour(e: boolean, hour: string): void {
    this.hourBoolean[hour] = e;
  }

  // Crea un array de strings con los días que tengan un valor de true en el array de booleanos
  // solo se utiliza en caso de que la frecuencia sea de tipo 'week'
  addDaysWeek() {
    const arrDays = [];
    for (const day in this.weekBoolean) {
      if (this.weekBoolean[day] === true) {
        arrDays.push(day);
      }
    }
    if (arrDays.length > 0) {
      this.plan.time_data = { repeat_on: arrDays };
    }
  }

  // Crea un array de strings con las horas que tengan un valor de true en el array de booleanos
  // solo se utiliza en caso de que la frecuencia sea de tipo 'hours-minutes'
  addHoursDay() {
    let hourString = '';
    // tslint:disable-next-line: forin
    for (const hour in this.hourBoolean) {
      console.log(hour);
      console.log(this.hourBoolean[hour]);
      if (this.hourBoolean[hour] === true) {
        console.log(true);
        hourString += hour;
        hourString += ',';
      }
    }
    if (hourString.length > 0) {
      hourString = hourString.substring(0, hourString.length - 1);
    }
    console.log(hourString);
    return hourString;
  }

  // Devuelve un string con el formato apropiado para el campo 'hours' de plan.time_data que
  // será usado para el cron en el back
  setHours() {
    let hourString = '';
    switch (this.hourType) {
      case 'each one':
        hourString = null;
        break;
      case 'at':
        hourString += this.hourFromStart.getHours().toString();
        break;
      case 'from':
        hourString += this.hourFromStart.getHours().toString();
        console.log('start', this.hourFromStart);
        hourString += '-';
        hourString += this.hourFromEnd.getHours().toString();
        break;
      case 'every':
        hourString += this.hourEvery.toString();
        break;
      case 'specific':
        hourString = this.addHoursDay();
        break;
      default:
        break;
    }
    return hourString;
  }

  // Devuelve un string con el formato apropiado para el campo 'minutes' de plan.time_data que
  // será usado para el cron en el back
  setMinutes() {
    let minuteString = '';
    switch (this.minuteType) {
      case 'each one':
        minuteString = null;
        break;
      case 'at':
        minuteString += this.minuteFromStart.getMinutes().toString();
        break;
      case 'from':
        minuteString += this.minuteFromStart.getMinutes().toString();
        minuteString += '-';
        minuteString += this.minuteFromEnd.getMinutes().toString();
        break;
      case 'every':
        minuteString += this.minuteEvery.toString();
        break;
      default:
        break;
    }
    return minuteString;
  }

  // Se se ha pasado la opción 'create' se planifica el registro
  // En caso contrario (opción 'delete') se elimina la planificación
  async submitForm(option: string) {
    console.log('this plan', this.plan);
    if (option === 'create' /* && this.dataPlan.frecuencia == null *//* && this.next_ == null */) {
      console.log("Periodo de ejecucion: ", this.periodicityType)
      if (this.periodicityType === 'less than daily') {
        console.log("IF hours-minutes 1")
        this.plan.time_u = 'hours-minutes';
      }
      if (this.plan.time_u === 'hours-minutes') {
        console.log("IF hours-minutes 2")
        this.plan.time_data = {
          hourType: this.hourType,
          minuteType: this.minuteType,
          hours: this.setHours(),
          minutes: this.setMinutes()
        };
        this.plan.time_n = null;
        this.next_ = null;
      }
      else {
        console.log("ELSE !hours-minutes")
        this.makeDate();
        if (this.plan.time_u === 'week') {
          this.addDaysWeek();
        }
      }
      //console.log("This is the plan", this.plan);
      const localPlanJson: jobsJson = {    // Se crea un Json copia del registro pasado y se le añade la planificación
        ...this.dataPlan,                    // obtenida en el formulario
        next_: this.next_,
        frecuencia: this.plan,
      };
      localPlanJson['arranque'] = this.arranque
      const localPlan: Jobs = new Jobs(localPlanJson);    // Se crea un registro y se manda al back para update
      localPlan.frecuencia = this.plan;
      localPlan.next_ = this.next_;
      localPlan['arranque'] = this.arranque
      console.log("Esta es la FRECUENCIA que enviamos al back", localPlan)
      this.sendPlan(localPlan, option);
    }
    else {
      const localPlanJson: jobsJson = {        // Se crea un JSON copia del registro pasado, se elimina la planificación
        ...this.dataPlan,                        // y se envía al back para update
      };
      const localPlan: Jobs = new Jobs(localPlanJson);
      localPlan.frecuencia = this.plan;
      localPlan.next_ = this.next_;
      console.log("Este es tu localPlan", localPlan);
      this.sendPlan(localPlan, option);
    }
    this.refresh();
  }

  refresh() {
    const res: jobsJson = {    // Se crea un Json copia del registro pasado y se le añade la planificación
      ...this.dataPlan,                    // obtenida en el formulario
      next_: this.next_,
      frecuencia: this.plan,
      arranque: 'start'
    };
    setTimeout(() => {
      this.callParent(res);
    }, 1000);
  }

  // Hace la petición de update al back
  async sendPlan(plan: Jobs, option) {
    //await this.httpService.updateRecord(this.dataPlan._id, plan.export()).toPromise();
    if (option === 'create' && this.dataPlan.frecuencia === null/*  && this.next_ == null */) {
      plan.export();
      console.log("Esto envio al servicio crear", plan);
      //console.log(this.dataPlan);
      await this.httpService.createFrecuency(plan.name, plan);
    } else {
      console.log("UPDATE BIEN", plan)
      await this.httpService.updateFrecuency(plan.name, plan);
    }
  }

  // Refresca la página
  callParent(res) {
    console.log("Event emit data", res);
    this.someEvent.emit(res);
  }

  // Funciones que gestionan la vista modal

  showModal(): void {
    this.isVisible = true;
  }

  /* handleOk(option: string): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.submitForm(option);
      this.isOkLoading = false;
      this.isVisible = false;
    }, 1000);

  } */
  handleOk(option: string) {
    this.isOkLoading = true;
    console.log('options: ', option);
    console.log('event: ', event);
    this.submitForm(option).then(e => {
      this.isOkLoading = !this.isOkLoading;
      this.isOkLoading = false
      this.isVisible = false;
    }
    )
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isOkLoading = false;
  }

}
