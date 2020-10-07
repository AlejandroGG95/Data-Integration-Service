import { PlanJson } from "src/utils/plan.interface";
export interface JobsI {
    name: string;
    description: string;
    created_date: string;
    modified_date: string;
    frecuencia: PlanJson;
    next_?: Date;
    ktrs?: any[];
    arranque: any;
    variables: any[];
}
