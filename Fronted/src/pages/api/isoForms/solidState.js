import { url } from "../API";

export const apipoints = {
  getData: `${url}/solidState/getData`,
  getJointType: `${url}/solidState/getJointType`,
  saveSolidStateParameters: `${url}/solidState/saveSolidStateParameters`,
  insertMaterialDetails: `${url}/solidState/insertMaterialDetails`,
  deleteMaterialDetails: `${url}/solidState/deleteMaterialDetails`,
  updateMaterialDetails: `${url}/solidState/updateMaterialDetails`,
  insertParaDetails: `${url}/solidState/insertParaDetails`,
  deleteParaDetails: `${url}/solidState/deleteParaDetails`,
  updateParaDetails: `${url}/solidState/updateParaDetails`,
  allSolidStateData: `${url}/solidState/allSolidStateData`,
};
