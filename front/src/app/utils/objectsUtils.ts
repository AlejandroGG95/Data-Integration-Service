/**
 * Convierte el objeto devuelto por el crm en un array de objetos
 * @param main objeto a convertir
 */
export const objectToArray = (main: object): object[] => {
  if (typeof main === 'string') {
    main = JSON.parse(main);
  }
  return Object.keys(main).map((e: any) => {
    const toReturn = { ...main[e] };
    if (toReturn.id === undefined) {
      toReturn.id = +e;
    }
    return toReturn;
  });
};


export const AddIsEmptyFunction = () => {
  Object.prototype['isEmpty'] = function () {
    return Object.values(this).length === 0;
  }
}
