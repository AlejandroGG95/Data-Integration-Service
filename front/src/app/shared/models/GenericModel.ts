import { Exclusion, IExportParams, RenameI } from '../typings/GenericModel';
/**
 * Tipo de dato para la clase madre
 * @author Ayoze Martín Hernández
 * @version 1.0
 */
export abstract class GenericModel {

  protected exclusions: Exclusion[];

  constructor() { }

  /**
   * Se encarga de parsear datos de un objeto plano a los atributos de la clase
   * @param data Parametros con los datos a parsear
   */
  protected constructorParse(data: object): void {
    if (data !== undefined) {
      Object.getOwnPropertyNames(this).forEach(e => {
        let exception: Exclusion;
        let classProperty = e;
        if (this.exclusions !== undefined) {
          classProperty = /^_\w*/.test(e) ? e.replace('_', '') : e;
          exception = this.exclusions.find(y => y.field === classProperty);
        }
        if (exception !== undefined) {
          exception.handler(data[classProperty]);
        } else {
          switch (true) {
            case data[classProperty] instanceof Date || /\d{4}-\d{2}-\d{2}/.test(data[classProperty]):
              this[e] = new Date(data[classProperty]);
              break;
            case Array.isArray(data[classProperty]):
              this[e] = [...data[classProperty]];
              break;
            case typeof data[classProperty] === 'object':
              this[e] = { ...data[classProperty] };
              break;
            default:
              // permite especificar valores por defecto
              if (this[e] === null) {
                this[e] = data[classProperty];
              }
              break;
          }
        }
      });
    }
  }

  /**
   * Convierte la clase en un objeto plano
   * @param reqField Parametros a incluir
   * @returns objeto plano con los datos pedidos
   */
  export(params?: IExportParams): object {
    const toReturn: object = {};
    if (params === undefined) {
      params = { delete: ['exclusions'] };
    } else {
      params.delete = params.delete === undefined ? ['exclusions'] : params.delete.concat(['exclusions']);
    }

    const selectedProperties: any[] = params.required !== undefined ? params.required : Object.getOwnPropertyNames(this);
    selectedProperties.forEach(e => {
      
      switch (true) {
        case Array.isArray(this[e]):
          toReturn[e] = [...this[e]];
          break;
        case typeof this[e] === 'object':
          toReturn[e] = { ...this[e] };
          break;
        default:
          toReturn[e] = this[e];
          break;
      }
    })

    if (params.delete !== undefined) {
      params.delete.forEach(e => {
        delete (toReturn[e]);
      });
    }

    if (params.rename !== undefined) {
      params.rename.forEach((e: RenameI) => {
        toReturn[e.to] = toReturn[e.from];
        delete (toReturn[e.from]);
      });
    }

    return toReturn;
  }

  /**
   * Verifica que los parametros minimos no están vacios
   * @param fields parametros requeridos
   */
  filledRequiredFields(fields: string[]): boolean {
    let correct = false;
    fields.forEach(e => {
      correct = this[e] !== undefined && this[e] !== null;
    });
    return correct;
  }

  /**
   * Calcula diferencias entre objetos
   * @param toCompare Objeto con el que comparar
   * @returns objeto con las propiedades diferentes
   */
  differences(toCompare: object): object {
    const aux: object = {};
    const thisObject = this.export();
    Object.keys(thisObject).forEach(e => {
      if (thisObject[e] !== toCompare[e]) {
        aux[e] = toCompare[e];
      } else if (Array.isArray(toCompare[e]) && toCompare[e].length > 0) {
        aux[e] = toCompare[e];
      }
    });
    return Object.keys(aux).length > 0 ? aux : null;
  }

  /**
   * Obtiene la lista de atributos de la clase
   * @return lista de atributos
   */
  getPropertyList(): string[] {
    return Object.getOwnPropertyNames(this);
  }

  /**
   * Clona un objeto de cualquier clase
   * @param instance objeto que clonar
   * @returns copia perfecta del objeto pasado por parametro
   */
  protected copy<T>(instance: T): T {
    const copy = new (instance.constructor as { new(): T })();
    Object.assign(copy, instance);
    return copy;
  }
}
