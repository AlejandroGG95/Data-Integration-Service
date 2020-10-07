import { GenericModel } from '../../shared/models/GenericModel';

export interface TimeData {
    'repeatOn': number;
}

export interface PlanJson {
    'time_n': number;
    'time_u': string;
    'time_data': {
        'repeat_on'?: string[];
        'hourType'?: string;
        'hours'?: string;
        'minuteType'?: string;
        'minutes'?: string;
    };
}

export interface jobsJson {

    "name": string,
    "description": string;
    "created_date": string,
    "modified_date": string;
    'next_'?: Date;
    "frecuencia"?: PlanJson;
    "ktrs"?: any;
    "variables": any;
    "arranque"?: any;

}

export interface usuarios {

    "userName": string,
    "password": string,
    "remember": true

}

export class Jobs extends GenericModel {

    name: string = null;
    created_date: string = null;
    description: string = null;
    modified_date: string = null;
    next_?: Date;
    frecuencia?: PlanJson;
    ktrs?: any = null;
    variables: any = null;
    arranque?: any = null;

    constructor(params?: any) {
        super();
        this.exclusions = [
            {
                field: 'next_',
                handler: () => {
                    if (params.next_ != null) {
                        this.next_ = new Date(params.next_);
                    }
                }
            },
            {
                field: 'plan',
                handler: () => {
                    if (params.plan != null) {
                        this.frecuencia = params.frecuencia;
                    }
                }
            }
        ];
        this.constructorParse(params);
    }


}
