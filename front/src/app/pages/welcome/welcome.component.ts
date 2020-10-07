import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Jobs } from './jobs';
import { Record } from './record';
import { Router } from '@angular/router';
import { EventEmitter, element } from 'protractor';
import { getHumanReadableCron } from '../../utils/cronUtils';
import { NzMessageService } from 'ng-zorro-antd'

interface ParentItemData {
  key: number;
  name: string;
  type: string;
  each: string;
  from: string;
  next: string;
  model: string;
  algorithm: string;
  status: string;
  algorithm_data: {};
  expand: boolean;
}

@Component({
  selector: 'app-nz-demo-table-nested-table',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})


// Página principal

export class WelcomeComponent implements OnInit {

  @ViewChild('basicTable') public table: any;

  expandSet = new Set<string>();
  listOfParentData: ParentItemData[] = [];
  listData: any;

  dateFormat: any;
  statusInterfaces: any;

  keys(a: JSON): string[] { return Object.keys(a); }

  checked = false;
  loading = false;
  indeterminate = false;
  listOfCurrentPageData: Record[] = [];
  setOfCheckedId = new Set<string>();

  cronFormatUtil = getHumanReadableCron;

  constructor(private httpService: HttpService,
    private router: Router,
    private message: NzMessageService) { }

  async ngOnInit() {
    this.refreshButton("nada");
  }

  async reloadTable() {
    let datos = await this.httpService.getListVariabel();
    console.log("Servicio de recarga", datos);
    this.listData = datos
  }

  /**
   * Refresca un elemento de la tabla actualizando el elemento editado.
   * @param item 
   */
  async refresh(item) {
    try {
      this.listData.find(e => e.name === item.name).frecuencia = item.frecuencia;
      this.listData.find(e => e.name === item.name).next_ = this.makeDate(item);
      this.listData.find(e => e.name === item.name).arranque = "start"
      console.log("Refrescando", item);
    } catch (error) {
      console.log("Se ha producido un error al refrescar");
    }
  }

  /**
   * Botón de refresco de la pagina inicial.
   * @param evento 
   */
  async refreshButton(evento) {
    console.log(evento)
    //Pedimos las interfaces al back.
    this.listData = await this.httpService.getListVariabel();
    this.listData.map(element => {
      if (element.next_ != null) {
        let date1 = new Date(element.next_);
        element.next_ = date1;
      }
    })
    console.log("Valores de this.ListData", this.listData);
    //Carga todos los logs de las interfaces.
    this.statusInterfaces = await this.httpService.findAllLogs();
    console.log("Status interfaces", this.statusInterfaces);
  }

  /**
   * Botón para borrar una fila.
   * @param obj 
   */
  async deleteRow(obj: any) {
    console.log("Se va a borrar ->", obj);
    await this.httpService.deleteJobs(obj);
    this.reloadTable();
  }

  // Obtiene los ID de aquellos elementos seleccionados en el checkbox y llama a la función que los elimina
  async sendRequest() {
    this.loading = true;
    const requestData = this.listData.filter(data => this.setOfCheckedId.has(data.name));
    await this.deleteJobs(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
    this.reloadTable();
  }

  // Llama al servicio que elimina un registro por su ID seleccionandolos en el checkbox
  async deleteJobs(job: Jobs[]) {
    console.log("JOBS A BORRAR", job)
    for (let i = 0; i < job.length; i++) {
      await this.httpService.deleteJobs(job[i]);
    }
  }

  /**
   * Comprobación del status para saber que tipo de estado tiene cada interfaces.
   * @param name 
   */
  checkStatus(name: string) {
    let respuesta;
    try {
      if (this.statusInterfaces != undefined) {
        respuesta = this.statusInterfaces.find(item => item.hasOwnProperty("JOBNAME") && item.JOBNAME == name).STATUS;
        if (respuesta == undefined) {
          respuesta = "";
        }
      }
    } catch (error) {
      //console.log(error);
    }
    return respuesta;
  }

  /**
   * Cambia el formato de la fecha por un formato adecuado a la vista.
   * @param item 
   */
  makeDate(item) {
    let fecha = null;
    try {
      this.dateFormat = item.next_;
      let newDateFormat = new Date();
      newDateFormat.setDate(this.dateFormat.getDate());
      newDateFormat.setMonth(this.dateFormat.getMonth());
      newDateFormat.setFullYear(this.dateFormat.getFullYear());
      newDateFormat.setHours(this.dateFormat.getHours());
      newDateFormat.setMinutes(this.dateFormat.getMinutes());
      console.log("Formato Legible", newDateFormat)
      fecha = newDateFormat;
      return fecha;
    } catch (error) {
      return fecha = null
    }
  }

  /**
   * Alterna el estado de las interfaces y les otorga otro para cambiar la apariencia y la ejecución de los mismos.
   * @param option 
   * @param interface_name 
   */
  async altExecute(option, interface_name) {
    try {
      if (option == "start") {
        await this.httpService.alterExecution(interface_name, 'start');
        this.listData.map(e => {
          if (e.name == interface_name) {
            e['arranque'] = 'start';
          }
        });
        this.message.info(`Starting interface ${interface_name}`);
      } else if (option == "stop") {
        await this.httpService.alterExecution(interface_name, 'stop');
        this.listData.map(e => {
          if (e.name == interface_name) {
            e['arranque'] = 'stop';
          }
        });
        this.message.info(`Stopping interface ${interface_name}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Funciones para la vista, para gestionar la check box, la expansión de la información de los registros, etc
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onItemChecked(name: string, checked: boolean): void {
    console.log("onItemChecked", name + checked);
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      console.log("Se elimina ", name)
      this.setOfCheckedId.delete(name);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = listOfEnabledData.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
  }

  onCurrentPageDataChange(listOfCurrentPageData: Record[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.filter(({ disabled }) => !disabled).forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

}