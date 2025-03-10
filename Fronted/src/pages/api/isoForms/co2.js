import { url } from "../API";

export const apipoints = {
  getData: `${url}/co2/getData`,
  getJointType: `${url}/co2/getJointType`,
  saveCo2Parameters: `${url}/co2/saveCo2Parameters`,
  insertMaterialDetails: `${url}/co2/insertMaterialDetails`,
  deleteMaterialDetails: `${url}/co2/deleteMaterialDetails`,
  updateMaterialDetails: `${url}/co2/updateMaterialDetails`,

  insertParaDetails: `${url}/co2/insertParaDetails`,
  deleteParaDetails: `${url}/co2/deleteParaDetails`,
  updateParaDetails: `${url}/co2/updateParaDetails`,

  allCo2Data: `${url}/co2/allCo2Data`,
};
