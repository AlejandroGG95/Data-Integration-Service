import { Component, OnInit, ViewChild, AfterViewInit, Input, ChangeDetectorRef, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { jobsJson, Jobs } from '../jobs';
import { HttpService } from '../../../services/http.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


// Componente vista modal para editar un registro


@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent {

  time_u = "weeks";
  time_n = 4;
  date_ = new Date();
  name;

  //RECIBIMOS UN OBJETO DE TIPO JOBS
  @Input() dataUpdate1: Jobs;

  name_job: string;
  created_date: string;
  description: string;
  modified_date: string;
  selectObject: any = [];
  selected: any = "";
  list_of_ktr: any;
  variables: any;

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.filldata1(this.dataUpdate1);
  }

  //Recoge los datos enviados desde la tabla al modal mediante la variable dataUpdate1.
  async filldata1(jobs: Jobs) {

    this.name_job = this.dataUpdate1.name;
    this.description = this.dataUpdate1.description;
    this.created_date = this.dataUpdate1.created_date;
    this.modified_date = this.dataUpdate1.modified_date;
    this.list_of_ktr = this.dataUpdate1.ktrs;
    this.variables = this.dataUpdate1.variables;

  }

  rand_name() {
    this.name = Math.random().toString(36).substring(5);
  }

  keys(a: any): string[] { return Object.keys(a); }

  //Utiliza el contenido de las variables que hemos introducido para crear un objeto que enviarle al back
  updateRecord1() {
    let json_data: jobsJson = {
      "name": this.name_job,
      "description": this.description,
      "created_date": this.created_date,
      "modified_date": this.modified_date,
      "variables": this.dataUpdate1.variables
    }
    const jobJson = new Jobs(json_data)
    return jobJson
  }

  change(v) {
    console.log(v)
  }

  // Una vez terminado el formulario de edición se actualiza el registro en la database
  submitForm() {
    const jobs_: Jobs = this.updateRecord1();
    console.log("Objeto convertido a texto plano->", jobs_.export())
    this.sendJobs(jobs_);
  }

  // Función que hace uso del servicio de updatear un registro
  async sendJobs(job: Jobs) {
    await this.httpService.editJob(this.dataUpdate1.name, job.export());
  }

  isVisible = false;
  isOkLoading = false;
  @Input() buttonName: string;


  // Funciones que gestionan la vista modal

  showModal(): void {
    this.isVisible = true;
    this.selected = '';
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.submitForm()
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selected = '';
  }

}
