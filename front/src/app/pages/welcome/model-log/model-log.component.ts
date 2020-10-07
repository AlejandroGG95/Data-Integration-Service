import { Component, OnInit, Input } from '@angular/core';
import { jobsJson, Jobs } from '../jobs';
import { HttpService } from '../../../services/http.service';
import { Router } from '@angular/router';
import { ModalButtonOptions } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-model-log',
  templateUrl: './model-log.component.html',
  styleUrls: ['./model-log.component.css']
})
export class ModelLogComponent implements OnInit {

  @Input() dataLog: any;
  footer: any = [
    {
      label: 'Close',
      shape: 'primary',
      onClick: () => this.handleCancel()
    }
  ]

  data: any = [];

  constructor(private httpService: HttpService,
    private router: Router,
    private message: NzMessageService) { }

  ngOnInit(): void {
    console.log("Esto que tiene", this.dataLog);
    this.searchLog();
  }

  async searchLog() {
    try {
      console.log(this.dataLog.name)
      this.data = await this.httpService.searchLogsDB(this.dataLog.name);
      console.log(this.data);
      (this.data != null) ? this.data[0]["ENDDATE"] = this.convertDate(this.data[0]["ENDDATE"]) : this.data = [];
    } catch (erro) {
      console.log("Tenemos un error en el searchLog()", erro);
    }
  }

  //Convertimos la fecha de Date en un formato mas legible.
  convertDate(fecha: Date) {
    const date = new Date(fecha);
    date.setDate(date.getDate());
    date.setMonth(date.getMonth());
    date.setFullYear(date.getFullYear());
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  submitForm() {
    this.searchLog();
  }

  //Buttons

  isVisible = false;
  isOkLoading = false;
  @Input() buttonName: string;

  showModal(): void {
    this.searchLog();
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    this.isVisible = false;
    this.isOkLoading = false;
    this.submitForm();
    /* setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.submitForm()
    }, 1000); */
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  //Copia el contenido de Log text y lo deja en nuestro clipboard
  copyTextLog(log): void {
    log.select();
    this.message.info('Copy in clipboard');
    document.execCommand('copy');
    log.setSelectionRange(0, 0);
  }

  //Abre el contenido de Log text en otra pestaña del navegador
  otherPage(value) {
    let win = window.open("log text", "blank");
    console.log(value.value)
    win.document.write(`<pre>${value.value.replace(/(?:\[rn]|[\r\n]+)+/g, "\t\n")}</pre>`);
    win.document.close();
    win.focus();
  }

  async otherPageHistory(jobname) {
    let history = await this.httpService.findAllHistory(jobname);
    let win = window.open("log text", "blank");
    let format = "";
    console.log(history)
    if (history != null) {
      Object.values(history).forEach(element => {
        console.log(element);
        format += `<hr></hr>${element['LOGDATE']}<hr></hr>` + `<pre>${element['LOG_FIELD']}</pre>`;
      });
    }
    console.log(format)
    if (format != "") {
      win.document.write(format);
      win.document.close();
      win.focus();
    }
  }
}
