/**
 * Tipo de datos necesario al exportar datos de la clase
 */
export interface IExportParams {
  required?: string[];
  delete?: string[];
  rename?: RenameI[];
}

export interface RenameI {
  from: string;
  to: string;
}

/**
 * Estructura de datos para las exclusiones
 */
export interface Exclusion {
  field: string;
  handler: (param?: any) => void;
}

/**
 * Tipo de dato habitual
 */
export interface IdValueI {
  id: number;
  value: string;
}
