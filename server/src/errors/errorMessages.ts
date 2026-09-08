export const ErrorMessages = {

  createFailed: (entityName: string) => 
    `There was an error while creating new ${entityName.toLowerCase()}.`,

  notFoundById: (entityName: string, id?: string | number) =>
    id !== undefined
      ? `No ${entityName.toLowerCase()} with ID ${id} was found in database!`
      : `No ${entityName.toLowerCase()} was found in database!`,

  notFoundByField: (entityName: string, fieldName: string, value?: string | number) =>
    value !== undefined
      ? `No ${entityName.toLowerCase()} with such ${fieldName} (${value}) was found in database!`
      : `No ${entityName.toLowerCase()} with such ${fieldName} was found in database!`,

  alreadyExists: (entityName: string, fieldName?: string) =>
    fieldName
      ? `${entityName} with such ${fieldName} already exists.`
      : `${entityName} already exists.`,
};
