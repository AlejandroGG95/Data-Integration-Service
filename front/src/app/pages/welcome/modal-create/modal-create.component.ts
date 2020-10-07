import { Component, OnInit, ViewChild, AfterViewInit, Input, ChangeDetectorRef, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Record, RecordJson } from '../record';
import { HttpService } from '../../../services/http.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


// Vista modal para crear un registro

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css']
})
export class ModalCreateComponent implements OnInit {

  @Output() eventoC = new EventEmitter();
  selectedOption: any;
  selected: any;
  name: string = "";

  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  /**
   * Cargamos los templates que tenemos disponibles.
   */
  async load() {
    this.selectedOption = await this.httpService.getTemplates();
    console.log("Esta opcion es la selecionada", this.selectedOption)
  }

  // Cuando se envía el formulario dependiendo del algoritmo de clustering con el que estemos
  // trabajando se rellenan los campos correspondientes y se crea un registro 
  async submitForm() {
    await this.httpService.createNewFolder(this.selected, this.name);
    await this.realizarComunicacion(this.selected);
  }

  //¿No seria buena idea solo buscar el job a cargar en lugar de cargarlos todos de nuevo? Pasamos el nombre del job creado lo buscamos y lo cargamos.
  async realizarComunicacion(job: string) {
    let newe = await this.httpService.getListVariabel();
    this.eventoC.emit({ element: newe });
  }

  isVisible = false;
  isOkLoading = false;
  @Input() buttonName: string;


  // Funciones que gestionan la vista modal

  showModal(): void {
    this.isVisible = true;

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
  }

}
