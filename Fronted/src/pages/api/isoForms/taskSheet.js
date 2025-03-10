import { url } from "../API";

export const apipoints = {
  getData: `${url}/taskSheet/getData`,
  getJointType: `${url}/taskSheet/getJointType`,
  getWeldSide: `${url}/taskSheet/getWeldSide`,
  saveTaskSheetRegister: `${url}/taskSheet/saveTaskSheetRegister`,
  saveSolidStateParameters: `${url}/taskSheet/saveSolidStateParameters`,
  saveCo2Parameters: `${url}/taskSheet/saveCo2Parameters`,
  insertSubAssyDetails: `${url}/taskSheet/insertSubAssyDetails`,
  deleteSubAssyDetails: `${url}/taskSheet/deleteSubAssyDetails`,
  updateSubAssyDetails: `${url}/taskSheet/updateSubAssyDetails`,
  allTaskData: `${url}/taskSheet/allTaskData`,
  getNcIdData: `${url}/taskSheet/getNcIdData`,
};
