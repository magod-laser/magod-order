import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

import magodlogo from "../../../../../../../../../../src/ML-LOGO.png";

export default function TaskSheetPdf({ formData, PDFData }) {
  const styles = StyleSheet.create({
    page: {
      fontSize: "9px",
      flexDirection: "column",
      // margin: "30px",
      marginTop: 30,
      marginBottom: 50,
      paddingBottom: 50,
    },
    tableContainer: {
      flexDirection: "column",
      flexWrap: "wrap",
      marginTop: "20px",
      marginLeft: "30px",
      border: 1,
      height: "95px",
      width: "540px",
    },
    tableContainer2: {
      flexDirection: "column",
      flexWrap: "wrap",
      marginLeft: "30px",
      borderBottom: 1,
      borderLeft: 1,
      borderRight: 1,
      height: "11px",
      width: "540px",
    },

    tableTitle: {
      marginTop: "20px",
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      marginBottom: "5px",
    },

    underline: {
      textDecoration: "underline",
    },

    logo: {
      width: "40px",
      height: "50px",
      marginLeft: "10px",
    },
    addresstext: {
      fontSize: 9,
      width: "190px",
      overflow: "hidden",
      marginLeft: "84px",
      marginTop: "20px",
    },

    column: {
      flexDirection: "column",
    },
    row: {
      flexDirection: "row",
    },
    sideheadingdata: {
      width: "140px",
      borderRight: 1,
    },
    sideheadingdata1: {
      width: "140px",
      // borderRight: 1,
    },

    globalfontwithbold: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
    },
    globalfontwithboldTitle: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
      color: "red",
    },
    globalfontwithoutbold: {
      fontSize: "8px",
    },
    tableData01: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
      width: "270px",
      borderRight: 1,
      borderBottom: 1,
      borderLeft: 1,
      marginLeft: "30px",
      padding: 1,
      textAlign: "center",
    },
    tableInput01: {
      fontSize: "8px",
      width: "270px",
      borderRight: 1,
      borderBottom: 1,
      borderLeft: 1,
      marginLeft: "30px",
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },

    tableInput02: {
      fontSize: "8px",
      width: "180px",
      borderRight: 1,
      borderBottom: 1,
      padding: 3,
      flexWrap: "wrap",
      textAlign: "center",
    },
    tableData03: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
      width: "270px",
      borderBottom: 1,
      borderRight: 1,
      padding: 1,
      textAlign: "center",
    },
    tableInput03: {
      fontSize: "8px",
      width: "270px",
      borderRight: 1,
      borderBottom: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
      textAlign: "center",
    },

    WeldingDetails: {
      width: "540px",
      borderBottom: 1,
      borderRight: 1,
      borderLeft: 1,
      textAlign: "center",
      marginLeft: "30px",
      height: "14px",
      padding: 1,
    },
    NDT: {
      width: "540px",
      borderBottom: 1,
      borderRight: 1,
      borderLeft: 1,
      marginLeft: "30px",
      height: "14px",
      padding: 1,
    },

    CheckBoxLabel01: {
      fontSize: "8px",
      width: "30px",
      fontFamily: "Helvetica-Bold",
      borderRight: 1,
      borderBottom: 1,
      borderLeft: 1,
      marginLeft: "30px",
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    CheckBox01: {
      fontSize: "8px",
      width: "18px",
      borderRight: 1,
      borderBottom: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    CheckBoxLabel02: {
      fontSize: "8px",
      width: "70px",
      fontFamily: "Helvetica-Bold",
      borderBottom: 1,
      borderRight: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    CheckBox02: {
      fontSize: "8px",
      width: "19px",
      borderRight: 1,
      borderBottom: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    CheckBoxLabel03: {
      fontSize: "8px",
      width: "30px",
      fontFamily: "Helvetica-Bold",
      borderBottom: 1,
      borderRight: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    CheckBox03: {
      fontSize: "8px",
      width: "17px",
      borderRight: 1,
      borderBottom: 1,
      padding: 2,
      flexWrap: "wrap",
      textAlign: "center",
    },
    weld01: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
      width: "226px",
      borderRight: 1,
      borderBottom: 1,
      borderLeft: 1,
      marginLeft: "30px",
      padding: 1,
      textAlign: "center",
    },
    first01: {
      fontSize: "8px",
      fontFamily: "Helvetica-Bold",
      width: "314px",
      borderBottom: 1,
      borderRight: 1,
      padding: 1,
      textAlign: "center",
    },
    tableSolidLable: {
      fontSize: "8px",
      width: "200px",
      borderRight: 1,
      borderBottom: 1,
      borderLeft: 1,
      marginLeft: "30px",
      padding: 3,
      flexWrap: "wrap",
      fontFamily: "Helvetica-Bold",
    },
    tableSolidData: {
      fontSize: "8px",
      width: "70px",
      borderRight: 1,
      borderBottom: 1,
      padding: 2,
      flexWrap: "wrap",
    },
    tableCOLable: {
      fontSize: "8px",
      width: "200px",
      borderBottom: 1,
      borderRight: 1,
      padding: 2,
      flexWrap: "wrap",
      fontFamily: "Helvetica-Bold",
    },
    comments: {
      height: "50px",
      width: "540px",
      borderBottom: 1,
      borderRight: 1,
      borderLeft: 1,
      padding: 3,
      marginLeft: "30px",
      flexWrap: "wrap",
      // fontFamily: "Helvetica-Bold",
      fontSize: "8px",
    },
    tableInput03: {
      fontSize: "8px",
      width: "270px",
      borderRight: 1,
      borderBottom: 1,
      padding: 3,
      flexWrap: "wrap",
      textAlign: "center",
    },

    // *********************
    title1: {
      width: "100%",
      marginTop: "10px",
      marginLeft: "120px",
      fontSize: "12px",
      fontWeight: "bolder",
      textDecoration: "underline",
      fontFamily: "Helvetica-Bold",
      // alignSelf: "center",
    },

    title2: {
      width: "100%",
      marginLeft: "120px",
      fontSize: "11px",
      fontWeight: "bold",
      // textDecoration: "underline",
      fontFamily: "Helvetica-Bold",
      // alignSelf: "center",
    },

    companyInfo: {
      marginTop: "4px",
      marginLeft: "18%",
      width: "65%",
      fontSize: "9px",
      alignSelf: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.tableContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image src={magodlogo} style={styles.logo} />

            <View>
              <View style={{ justifyContent: "center" }}>
                <Text style={[styles.title1, { textDecoration: "underline" }]}>
                  Task Sheet For Laser Welding
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={styles.title2}>{PDFData.RegisteredName}</Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "100px" }}>
                  GSTIN: {PDFData.GST_No}, CIN: {PDFData.CIN_No}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "70px" }}>
                  {PDFData.RegistredOfficeAddress}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "40px" }}>
                  {PDFData.PhonePrimary} {PDFData.PhoneSecondary}
                  {PDFData.Email}
                  {PDFData.URL}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Schedule No/Task No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.taskNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Date
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.taskDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableData01}>Sub-assy Part Name/No</Text>
          <Text style={styles.tableData03}>Qty Received</Text>
        </View>

        {formData.subAssyTableData?.map((item, index) => (
          <View key={index} style={styles.row}>
            {/* <Text style={styles.tableInput02}>{index + 1}</Text> */}
            <Text style={styles.tableInput01}>{item.Sub_Assy_Part_Name}</Text>
            <Text style={styles.tableInput03}>{item.Qty_Received}</Text>
          </View>
        ))}

        {formData.partsTable?.map((item, index) => (
          <View key={index} style={styles.row}>
            {/* <Text style={styles.tableInput02}>{index + 1}</Text> */}
            <Text style={styles.tableInput01}>{item.PartId}</Text>
            <Text style={styles.tableInput03}>
              {/* {item.QtyPerAssy * formData.qty} */}
              {item.QtyRequired}
            </Text>
          </View>
        ))}

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Any Defects
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.anyDeffects == 1
                    ? "Yes"
                    : formData.anyDeffects == 0
                    ? "No"
                    : formData.anyDeffects == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Material Thickness
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.mtrlThickness}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Machine/Model No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.machineNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  With Filler
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {/* {formData.withFiller === 1 ? "Yes" : "No"} */}
                  {formData.withFiller == 1
                    ? "Yes"
                    : formData.withFiller == 0
                    ? "No"
                    : formData.withFiller == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Program No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.programNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Filler Material
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.fillerMaterial}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Fixture Requirement
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {/* {formData.fixtureRequirement === 1 ? "Yes" : "No"} */}
                  {formData.fixtureRequirement == 1
                    ? "Yes"
                    : formData.fixtureRequirement == 0
                    ? "No"
                    : formData.fixtureRequirement == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Batch No/Charge No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.batchNo}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Lens distance in mm
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.lensDistance}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Machine Peak Power
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.machinePeakPower}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.weld01}>Weld Settings Verified By</Text>
          <Text style={styles.first01}>First Part Inspection</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.CheckBoxLabel01}>QC</Text>
          <Text style={styles.CheckBox01}>
            {formData.partInspectionQC === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel02}>Weld Engineer</Text>
          <Text style={styles.CheckBox02}>
            {formData.partInspectionWeldEngineer === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel02}>Incharge</Text>
          <Text style={styles.CheckBox02}>
            {formData.partInspectionIncharge === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel02}>Project Incharge</Text>
          <Text style={styles.CheckBox02}>
            {formData.partInspectionProjectManager === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel03}>QC</Text>
          <Text style={styles.CheckBox03}>
            {formData.weldSettingQC === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel02}>Weld Engineer</Text>
          <Text style={styles.CheckBox02}>
            {formData.weldSettingWeldEngineer === 1 ? "Yes" : ""}
          </Text>
          <Text style={styles.CheckBoxLabel02}>Incharge</Text>
          <Text style={styles.CheckBox02}>
            {formData.weldSettingIncharge === 1 ? "Yes" : ""}
          </Text>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Type Of Laser Equipment
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.laserEquipment}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Reweld Permitted
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {/* {formData.reweldPermitted === 1 ? "Yes" : "No"} */}
                  {formData.reweldPermitted == 1
                    ? "Yes"
                    : formData.reweldPermitted == 0
                    ? "No"
                    : formData.reweldPermitted == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Fixture No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.fixtureNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Controll Plan No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.controlPlanNo}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  WPS No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.wpsNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  PDF No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.pfdNo}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  WI No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.wiNo}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  PQR No
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.pqrNo}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Standard Parameter Ref
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.standardOfRef}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Gas Type
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.gasType}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Pre flow Gas in lpm
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.preFlowGas}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Post flow Gas in lpm
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.postFlowGas}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Design Type
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.designType}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Weld Side
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {formData.weldSide}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer2}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Backing
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {/* {formData.backing === 1 ? "Yes" : "No"} */}
                  {formData.backing == 1
                    ? "Yes"
                    : formData.backing == 0
                    ? "No"
                    : formData.backing == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.sideheadingdata}>
                <Text style={[styles.globalfontwithbold, { paddingLeft: 5 }]}>
                  Tack Weld
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.sideheadingdata1}>
                <Text
                  style={[styles.globalfontwithoutbold, { paddingLeft: 5 }]}
                >
                  {/* {formData.tackWeld === 1 ? "Yes" : "No"} */}
                  {formData.tackWeld == 1
                    ? "Yes"
                    : formData.tackWeld == 0
                    ? "No"
                    : formData.tackWeld == 2
                    ? "NA"
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.WeldingDetails}>
          <Text style={styles.globalfontwithboldTitle}>Welding Parameters</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableData01}>
            Solid State Laser - Parameters(PW)
          </Text>
          <Text style={styles.tableData03}>CO2 Laser - Parameters</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Power at focus Watts/volts</Text>
          <Text style={styles.tableSolidData}>{formData.sspoweratfocus}</Text>
          <Text style={styles.tableCOLable}>
            Power transmission efficiency in watts
          </Text>
          <Text style={styles.tableSolidData}>
            {formData.copowerTransmissionEfficiency}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Focus dia in mm</Text>
          <Text style={styles.tableSolidData}>{formData.ssfocusDia}</Text>
          <Text style={styles.tableCOLable}>Power in Watts</Text>
          <Text style={styles.tableSolidData}>{formData.copower}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Pulse duration in ms</Text>
          <Text style={styles.tableSolidData}>{formData.sspulseDuration}</Text>
          <Text style={styles.tableCOLable}>Frequency in Hz</Text>
          <Text style={styles.tableSolidData}>{formData.cofrequency}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Pulse frequency in Hz</Text>
          <Text style={styles.tableSolidData}>{formData.sspulseFrequency}</Text>
          <Text style={styles.tableCOLable}>Beam dia in mm</Text>
          <Text style={styles.tableSolidData}>{formData.cobeamDia}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Pulse shape No</Text>
          <Text style={styles.tableSolidData}>{formData.sspulseShapeNo}</Text>
          <Text style={styles.tableCOLable}>Focus in mm</Text>
          <Text style={styles.tableSolidData}>{formData.cofocus}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Gas pressure in lpm (Avg)</Text>
          <Text style={styles.tableSolidData}>{formData.ssgasPressure}</Text>
          <Text style={styles.tableCOLable}>Gas pressure in lpm (Avg)</Text>
          <Text style={styles.tableSolidData}>{formData.cogasPressure}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Feed rate in mm/min</Text>
          <Text style={styles.tableSolidData}>{formData.ssfeedRate}</Text>
          <Text style={styles.tableCOLable}>Feed rate in mm/min</Text>
          <Text style={styles.tableSolidData}>{formData.cofeedRate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>RPM</Text>
          <Text style={styles.tableSolidData}>{formData.ssrpm}</Text>
          <Text style={styles.tableCOLable}>RPM</Text>
          <Text style={styles.tableSolidData}>{formData.corpm}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Gas purity in %</Text>
          <Text style={styles.tableSolidData}>{formData.ssgasPurity}</Text>
          <Text style={styles.tableCOLable}>Gas purity in %</Text>
          <Text style={styles.tableSolidData}>{formData.cogasPurity}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>Gap Range in mm</Text>
          <Text style={styles.tableSolidData}>{formData.ssgapRange}</Text>
          <Text style={styles.tableCOLable}>Gap Range in mm</Text>
          <Text style={styles.tableSolidData}>{formData.cogapRange}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.tableSolidLable}>
            Gas flow orientation in deg
          </Text>
          <Text style={styles.tableSolidData}>
            {formData.ssgasFlowOrientation}
          </Text>
          <Text style={styles.tableCOLable}>Gas flow orientation in deg</Text>
          <Text style={styles.tableSolidData}>
            {formData.cogasFlowOrientation}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.comments}>
            <Text style={styles.globalfontwithbold}>Note: </Text>
            <Text style={styles.globalfontwithoutbold}>{formData.note}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.comments}>
            <Text style={styles.globalfontwithbold}>Prepared By:</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.comments}>
            <Text style={styles.globalfontwithbold}>
              Welding Operator Stamp:
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
