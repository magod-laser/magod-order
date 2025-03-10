import React, { startTransition, useEffect, useState } from "react";
import axios from "axios";
import magodlogo from "../../../../../../../../../../src/ML-LOGO.png";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
  tableContainerMain: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: "20px",
    marginLeft: "10px",
    border: 1,
    height: "95px",
    width: "570px",
  },

  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  globalfontwithbold: {
    fontSize: "8px",
    fontFamily: "Helvetica-Bold",
  },
  globalfontwithoutbold: {
    fontSize: "8px",
  },
  logo: {
    width: "40px",
    height: "50px",
    marginLeft: "10px"
  },

  tableDisplay: {
    width: "570px",
    // borderRight: 1,
    borderLeft: 1,
    marginLeft: "10px",
  },
  drawingname: {
    width: "100px",
    textAlign: "center",
    borderRight: 1,
    padding: "1px",
    borderBottom: 1,
  },
  drawingname01: {
    width: "100px",
    textAlign: "center",
    borderRight: 1,
    padding: "1px",
    // borderBottom: 1,
  },
  comments: {
    height: "150px",
    width: "569px",
    borderBottom: 1,
    borderRight: 1,
    marginLeft: "0px",
    fontSize: "9px",
    marginTop: "0px",
    padding: 1,
  },
  quantity: {
    width: "184px",
    borderRight: 1,
    padding: "1px",
    textAlign: "center",
    borderBottom: 1,
  },
  quantity01: {
    width: "195px",
    borderRight: 1,
    padding: "1px",
    textAlign: "center",
    borderBottom: 1,
  },
  Material: {
    width: "90px",
    textAlign: "center",
    borderRight: 1,
    padding: "1px",
    borderBottom: 1,
  },

  tableData01: {
    fontSize: "8px",
    fontFamily: "Helvetica-Bold",
    width: "285px",
    borderRight: 1,
    borderBottom: 1,
    // borderLeft: 1,
    // marginLeft: "5px",
    padding: 1,
    textAlign: "center",
  },
  tableData03: {
    fontSize: "8px",
    fontFamily: "Helvetica-Bold",
    width: "285px",
    borderBottom: 1,
    borderRight: 1,
    padding: 1,
    textAlign: "center",
  },
  tableInput01: {
    fontSize: "8px",
    width: "285px",
    borderRight: 1,
    borderBottom: 1,
    // borderLeft: 1,
    // marginLeft: "5px",
    padding: 1,
    flexWrap: "wrap",
    textAlign: "center",
  },
  tableInput03: {
    fontSize: "8px",
    width: "285px",
    borderRight: 1,
    borderBottom: 1,
    padding: 1,
    flexWrap: "wrap",
    textAlign: "center",
  },

  // *****************
  title1: {
    width: "100%",
    marginTop: "10px",
    marginLeft: "100px",
    fontSize: "12px",
    fontWeight: "bolder",
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
    // alignSelf: "center",
  },

  title2: {
    width: "100%",
    marginLeft: "140px",
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

const COForm = ({ formData, PDFData }) => {
  const renderContent = () => {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.tableContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image src={magodlogo} style={styles.logo} />

            <View>
              <View style={{ justifyContent: "center" }}>
                <Text style={[styles.title1, { textDecoration: "underline" }]}>
                  Laser Welding Job Parameter Sheet - CO2 Laser
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={styles.title2}>{PDFData.RegisteredName}</Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "130px" }}>
                  GSTIN: {PDFData.GST_No}, CIN: {PDFData.CIN_No}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "90px" }}>
                  {PDFData.RegistredOfficeAddress}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text style={{ ...styles.companyInfo, marginLeft: "50px" }}>
                  {PDFData.PhonePrimary} {PDFData.PhoneSecondary}
                  {PDFData.Email}
                  {PDFData.URL}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.tableContainerMain]}>
          <View style={styles.tableDisplay}>
            <View style={styles.row}>
              <View style={styles.drawingname}>
                <Text style={styles.globalfontwithbold}>Date </Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.globalfontwithoutbold}>
                  {formData.taskDate}
                </Text>
              </View>
              <View style={styles.Material}>
                <Text style={styles.globalfontwithbold}>Schedule No</Text>
              </View>
              <View style={styles.quantity01}>
                <Text style={styles.globalfontwithoutbold}>
                  {formData.taskNo}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.drawingname}>
                <Text style={styles.globalfontwithbold}>Machine</Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.globalfontwithoutbold}>
                  {formData.machine}
                </Text>
              </View>
              <View style={styles.Material}>
                <Text style={styles.globalfontwithbold}>nT</Text>
              </View>
              <View style={styles.quantity01}>
                <Text style={styles.globalfontwithoutbold}>{formData.nt}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.drawingname}>
                <Text style={styles.globalfontwithbold}>Joint</Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.globalfontwithoutbold}>
                  {formData.joint}
                </Text>
              </View>
              <View style={styles.Material}>
                <Text style={styles.globalfontwithbold}>Operator</Text>
              </View>
              <View style={styles.quantity01}>
                <Text style={styles.globalfontwithoutbold}>
                  {formData.operator}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.tableData01}>Material</Text>
              <Text style={styles.tableData03}>Thickness</Text>
            </View>

            {formData.materialTableData?.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.tableInput01}>{item.Material}</Text>
                <Text style={styles.tableInput03}>{item.Thickness}</Text>
              </View>
            ))}

            <View>
              {formData.parametersTableData.map((rowData, index) => (
                <React.Fragment key={index}>
                  {/* Table Row */}
                  <View style={styles.row}>
                    <View style={styles.drawingname01}>
                      <Text style={styles.globalfontwithbold}>Sr No</Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>Gas Type</Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Gas_Type}
                      </Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>
                        Flow/Pressure
                      </Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Flow_Pressure}
                      </Text>
                    </View>
                  </View>

                  {/* Beam Dia and Focus */}
                  <View style={styles.row}>
                    <View style={styles.drawingname01}>
                      <Text style={styles.globalfontwithbold}>{index + 1}</Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>
                        Beam Dia(mm)
                      </Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Bead_Dia}
                      </Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>Focus</Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Focus}
                      </Text>
                    </View>
                  </View>

                  {/* Power and Speed */}
                  <View style={styles.row}>
                    <View style={styles.drawingname01}>
                      <Text style={styles.globalfontwithbold}></Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>Power(W)</Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Power}
                      </Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>
                        Speed(mm/min)
                      </Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Speed}
                      </Text>
                    </View>
                  </View>

                  {/* Gap and Frequency */}
                  <View style={styles.row}>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}></Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>Gap(mm)</Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Gap}
                      </Text>
                    </View>
                    <View style={styles.drawingname}>
                      <Text style={styles.globalfontwithbold}>
                        Frequency(Hz)
                      </Text>
                    </View>
                    <View style={styles.quantity}>
                      <Text style={styles.globalfontwithoutbold}>
                        {rowData.Frequency}
                      </Text>
                    </View>
                  </View>

                  {/* Comments */}
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.comments}>
                        Comments: {rowData.Comments}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </Page>
    );
  };

  return <Document>{renderContent()}</Document>;
};

export default COForm;
