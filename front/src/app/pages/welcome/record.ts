import { GenericModel } from '../../shared/models/GenericModel';

export interface RecordJson{
    /**Nombre o ID representativo */
    "name":string,
    /**Tipo de Inteligencia que se ha elegido (ej.:Clustering) */
    //"type":string,
    /**Tiempo numeral (1,2,3,etc) */
    "time_n":number,
    /**Tiempo en unidades (horas,días,semanas) */
    "time_u":string,
    /**Primera vez que se ejecuta el programa */
    "first":Date,
    /**BD a la que se ataca */
    "model_":string,
    /**Algoritmo usado (ej.:K-Means) */
    "algorithm":string,
    /**Parámetros del algoritmo escogído */
    "algorithm_data":{},
    /**Estado del programa 0-4 (Error, Activo, Desactivado, Procesando, Wargning) */
    "status"?:number
}

export class Record extends GenericModel {

    name: string = null;
    //type: string = null;
    time_n: number = null;
    time_u: string = null;
    time_: string = null;
    first: Date = null;
    next_: Date = null;
    model_: string = null; 
    algorithm: string = null; 
    algorithm_data: {} = null;
    status: number = null;
    _id: string = null;
    __v: number = null;
    disabled: boolean = null;

    constructor(params?: any){
        super()
        this.exclusions = [
            {
                field: 'time_',
                handler: () => {
                    if (params.time_ === undefined){
                        this.time_ = this.time_n + " " + this.time_u;
                    }
                    else{
                        this.time_ = params.time_;
                    }
                }
            },
            {
                field: 'next_',
                handler: () => {
                    if (params.first !== undefined){
                        this.next_ = this.next() 
                    }
                }
            },
            {
                field: '_id',
                handler: () => {
                    console.log("id", params._id)
                    this._id = params._id;
                }
            }
        ]
        this.constructorParse(params);
        this._id = params._id
    }

    time():number{
        let aux=this.time_n;
        switch(this.time_u.toLowerCase()){
            case 'days':
            case 'day':
            case 'días':
            case 'día':
            case 'dia':
            case 'dias':
            case 'd':
                aux*=24;
            break;
            case 'weeks':
            case 'week':
            case 'semanas':
            case 'semana':
            case 's':
            case 'w':
                aux*=24*7
            break;
        }
        return aux;
    }

    next():Date{
        if(this.time_n > 0){
            const n = this.time();
            const aux = new Date(this.first.getTime());
            const current = new Date();
            while(aux<current){
                aux.setTime(aux.getTime() + (n*60*60*1000));
            }
            return aux;
        }
        return new Date();
    }

    export(){
        const toReturn: any = super.export();
        toReturn.first = new Date(this.first.getTime());
        toReturn.next_ = new Date(this.next_.getTime())
        return toReturn;
    }

}