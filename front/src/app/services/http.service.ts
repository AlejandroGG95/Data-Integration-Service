import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { objectToArray } from '../utils/objectsUtils';
import { Jobs, usuarios } from '../pages/welcome/jobs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  listOfData: Jobs[];
  Desarrollo: boolean = true;
  url_dev: string = 'http://localhost:3000';
  url_prod: string = 'https://testdis.curieplatform.com';
  //listOfDataP: any;

  constructor(private http: HttpClient) { }

  async getTemplates() {
    const response = await this.http.get(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/listAllTemplates`).toPromise();
    return response;
  }

  async createNewFolder(origen_temp: string, new_name: string) {
    await this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/copyFolder`, { destino: "kerosur", origen: origen_temp, name: new_name }).toPromise();
  }

  async getListVariabel() {
    const serverResponse = await this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/listAllJobClientDetailed`, { client: "kerosur" }).toPromise();
    const response: any[] = JSON.parse(JSON.stringify(serverResponse));
    this.listOfData = response
    return this.listOfData
  }

  public editJob(name_job: string, obj: object) {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/updateJob`, { job: name_job, client: "kerosur", datos: obj }).toPromise();
  }

  public createFrecuency(name: string, object: Jobs) {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/createFrecuency`, { /* job: name, */ client: "kerosur", datos: object }).toPromise();
  }

  public updateFrecuency(name: string, object: Jobs) {
    console.log("SERVICE", object)
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/updateFrecuency`, { /* job: name, */ client: "kerosur", datos: object }).toPromise();
  }

  public searchLogsDB(name_job: string) {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/searchOneLogDB`, { name: name_job, client: "kerosur" }).toPromise();
  }

  public findAllLogs() {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/findAllLogs`, { client: "kerosur" }).toPromise();
  }

  public findAllHistory(name_job: string) {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/findAllHistory`, { client: "kerosur", job: name_job }).toPromise();
  }

  public deleteJobs(datos: any) {
    console.log(datos.name)
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/deleteJob`, { job: datos.name, client: "kerosur" }).toPromise();
  }

  public alterExecution(name: string, action_exec: string): any {
    console.log(name)
    this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/actionSpecificCron`, { job: name, action: action_exec, client: "kerosur" }).toPromise();
    return '';
  }

  public loginDIS(obj_user: usuarios) {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/microservice/login`, obj_user).toPromise();
  }

  //CODIGO DE EDUARDO

  public getAllRecords(): Observable<any[]> {
    return this.http.get(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/record`).pipe(
      map((e: any) => {
        const toConvert = e
        let mappedObject = objectToArray(toConvert);
        return mappedObject;
      })
    );
  }

  public createRecord(data: object): Observable<any> {
    return this.http.post(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/record`, data);
  }

  public updateRecord(id: string, data: object): Observable<any> {
    return this.http.put(`${(this.Desarrollo == true ? this.url_dev : this.url_prod)}/record/` + id, data);
  }

}