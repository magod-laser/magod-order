/** @format */

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import { borderRight, padding, style, textAlign } from "@mui/system";
import { Table } from "react-bootstrap";
import { postRequest } from "../../../../../../../../api/apiinstance";
import { endpoints } from "../../../../../../../../api/constants";
import magodlogo from "../../../../../../../../../../src/ML-LOGO.png";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
    marginTop: 30,
    marginBottom: 50,
    paddingBottom: 50,
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
  },
  tableTitle: {
    marginLeft: "300px",
    marginTop: "20px",
    fontSize: 20,
    fontWeight: "bold",
  },
  code1: {
    fontFamily: "Helvetica-Bold",
    marginTop: "10px",
  },
  title2: {
    marginLeft: "100px",
  },
  shiftperiod: {
    marginLeft: "190px",
    marginTop: "10px",
  },
  boxdata: {
    border: "1px",
    padding: "10px",
    marginTop: "40px",
    width: "550px",
    marginLeft: "50px",
    marginRight: "100px",
  },
  tableview: {
    marginLeft: "30px",
    width: "750px",
  },
  Headingrow: {
    flexDirection: "row",
    width: "750px",
    alignItems: "Center",
    marginLeft: "20px",
    marginTop: 20,
    fontWeight: "bold",
  },
  Headingrow1: {
    flexDirection: "row",
    width: "800px",
    alignItems: "center",
    marginLeft: "20px",
    fontWeight: "bold",
  },
  machineHeading: {
    width: "80%",
  },
  operatorHeading: {
    width: "20%",
  },
  logo: {
    width: "36px",
    height: "54px",
    marginBottom: "10px",
  },
  logostyle: {
    marginTop: "15px",
    marginLeft: "40px",
  },
  code: {
    fontSize: "10px",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  codestyle: {
    marginLeft: "35px",
    marginTop: "15px",
  },
  MagodTitle: {
    width: "70%",
    marginTop: "20Px",
  },
  titleBold: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: "13px",
    marginTop: "25px",
  },
  typeofform: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: "15px",
  },
  tableContainer2: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: "15px",
    width: "160px",
  },
  quotationNumview: {
    fontSize: 12,
    width: "60px",
  },
  quotationNumDataview: {
    width: "100px",
  },
  quotesize: {
    fontSize: 12,
  },
  quotationNumData: {
    fontSize: 12,
  },
  dateview: {
    marginTop: "5px",
    fontSize: 12,
    width: "60px",
  },
  dateData: {
    width: "100px",
    marginTop: "4px",
  },
  datesize: {
    fontSize: 12,
  },
  validuptoView: {
    marginTop: "5px",
    fontSize: 12,
    width: "60px",
  },
  validuptodataView: {
    width: "100px",
    marginTop: "4px",
  },
  validsize: {
    fontSize: 12,
  },
  column: {
    flexDirection: "row",
  },
  text: {
    fontSize: 12,
  },
  pagenum: {
    width: 160,
    textAlign: "right",
  },
  scheduleViewSection: {
    marginLeft: "30px",
    width: "38%",
    borderBottom: 1,
    borderTop: 1,
    borderLeft: 1,
  },
  scheduleViewSection1: {
    width: "28%",
    borderBottom: 1,
    borderTop: 1,
    borderLeft: 1,
  },
  scheduleViewSection2: {
    width: "28%",
    border: 1,
    borderRight: 1,
  },

  cornertableWidth: {
    width: "25%",
  },
  POno: {
    width: "30%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center", // Vertically align items in the center
  },
  POnodata: {
    width: "70%",
    paddingBottom: "3px",
    flexWrap: "wrap",         // Ensures text wraps within the width
    whiteSpace: "pre-wrap",   // Maintains spacing and line breaks
    wordBreak: "break-word", 
  },  

  SalesContact: {
    width: "30%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center", // Vertically align items in the center
  },
  SalesContactData: {
    width: "70%",
    paddingBottom: "3px",
  },

  ScheduleDate: {
    width: "50%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center",
    marginLeft: "2%",
  },
  ScheduleDatedata: {
    width: "70%",
    paddingBottom: "3px",
    marginLeft: "2%",
  },
  DeliverDate: {
    width: "49%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center",
    marginLeft: "2%",
  },
  DeliverDatedata: {
    width: "70%",
  },

  TargetDate: {
    width: "50%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center",
    marginLeft: "2%",
  },
  TargetDatedata: {
    width: "70%",
    paddingBottom: "3px",
    marginLeft: "2%",
  },

  Instruction: {
    width: "33%",
    paddingBottom: "3px",
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between elements
    alignItems: "center", // Vertically align items in the center
    marginLeft: "1%",
  },
  InstructionData: {
    width: "70%",
    paddingBottom: "3px",
  },

  targetdateview: {
    width: "40%",
  },
  custScheduleNo: {
    width: "30%",
  },
  custName: {
    width: "70%",
  },
  taskNoStyle: {
    width: "30%",
  },
  custMaterialStyle: {
    width: "70%",
  },
  contactsection: {
    width: "25%",
    borderBottom: 1,
    borderTop: 1,
  },
  contactview: {
    width: "30%",
    paddingBottom: "3px",
  },
  contactdata: {
    width: "70%",
    paddingBottom: "3px",
  },
  teleview: {
    width: "30%",
    paddingBottom: "3px",
  },
  teledata: {
    width: "70%",
    paddingBottom: "3px",
  },

  maintableview: {
    width: "790px",
    marginLeft: "30px",
  },
  mainsidetableview: {
    width: "850px",
    marginLeft: "30px",
    marginTop: "20px",
  },
  datawithboldline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textDecoration: "underline",
  },
  datawithoutbline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  taskname: {
    marginLeft: "10px",
  },
  databox: {
    marginTop: "10px",
    width: "50%",
  },
  databox2: {
    marginTop: "30px",
    width: "50%",
  },
  materialdetailheading: {
    marginTop: "10px",
  },
  subdetails: {
    width: "50%",
    borderBottom: 1,
    borderLeft: 1,
    borderTop: 1,
  },
  subdetails2: {
    width: "50%",
    borderBottom: 1,
    borderRight: 1,
    borderTop: 1,
  },
  section1: {
    width: "50%",
  },
  section2: {
    width: "50%",
  },
  subsection1heading: {
    width: "70%",
    textAlign: "right",
  },
  subsection1data: {
    width: "30%",
    textAlign: "left",
  },
  subsection2heading: {
    width: "70%",
    textAlign: "right",
  },
  subsection2data: {
    width: "30%",
    textAlign: "left",
  },
  simtext: {
    fontSize: 10,
    padding: "3px",
  },
  simtextdata: {
    marginLeft: "5px",
    fontSize: 10,
    padding: "3px",
  },
  subsectionlastheading: {
    width: "100%",
    textAlign: "right",
  },
  subsectionlastdata: {
    width: "100%",
    textAlign: "left",
  },
  subdetailspart2: {
    width: "50%",
  },
  sectionpart2: {
    width: "50%",
  },
  subdetail2part2: {
    width: "50%",
  },
  subsectionpart2: {
    width: "50%",
  },
  jobwordview: {
    width: "50%",
    textAlign: "right",
  },
  jobworktext: {
    fontFamily: "Helvetica-Bold",
    fontSize: "12px",
    textAlign: "right",
  },
  jobworkdataview: {
    width: "40%",
    textAlign: "left",
  },
  boldtextbox: {
    marginTop: "20px",
  },
  tableDisplay: {
    width: "100%",
    // marginTop: "5px",
    borderBottom: 1,
  },
  srl: {
    width: "10%",
    paddingBottom: "3px",
    paddingTop: "1px",
    textAlign: "center",
  },
  drawingname: {
    width: "25%",
    paddingBottom: "3px",
    paddingTop: "1px",
    textAlign: "center",
  },
  taksno: {
    width: "20%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  sheetDetails: {
    width: "100%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  Inspection: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },
  Packing: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },
  Scheduled: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },
  Produced: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },
  Delivered: {
    width: "20%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },

  scheduleNotable: {
    width: "15%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "1px",
  },
  tableDataView: {
    width: "100%",
    borderBottom: 1,
  },
  tabletext: {
    fontSize: "10px",
  },

  srldata: {
    width: "10%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  drawingnamedata: {
    width: "25%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  taksno: {
    width: "20%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  sheetDetails: {
    width: "90%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
    fontSize: "12px",
    paddingBottom: "5px",
  },
  Inspectiondata: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Packingdata: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Scheduleddata: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Produceddata: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Delivereddata: {
    width: "20%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },

  scheduleNotabledata: {
    width: "15%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },

  PageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 10,
    left: 270,
    textAlign: "center",
    color: "gray",
  },
  totaltext: {
    fontFamily: "Helvetica-Bold",
    fontSize: "10px",
  },
  globalfontwithbold: {
    fontSize: "11px",
    fontFamily: "Helvetica-Bold",
    marginLeft: "1%",
  },
  globalfontwithoutbold: {
    fontSize: "11px",
  },
  titlePlace: {
    marginLeft: "50%",
  },
  ScheduleNO: {
    marginTop: "5px",
    width: "95%",
    marginLeft: "30px",
    borderBottom: 1,
    height: "20%",
  },
  footer: {
    width: "80%",
    marginLeft: 10,
  },
  sales: {
    width: "40%",
    border: 1,
    padding: "5px",
  },
  ncpgm: {
    width: "40%",
    borderTop: 1,
    borderBottom: 1,
    borderRight: 1,
    padding: "5px",
  },
  prod: {
    width: "40%",
    borderTop: 1,
    borderBottom: 1,
    borderRight: 1,
    padding: "5px",
  },

  salesdata: {
    width: "40%",
    borderBottom: 1,
    borderLeft: 1,
    borderRight: 1,
    padding: "5px",
  },
  ncpgmdata: {
    width: "40%",
    borderBottom: 1,
    borderRight: 1,
    padding: "5px",
  },
  proddata: {
    width: "40%",
    borderBottom: 1,
    borderRight: 1,
    padding: "5px",
  },

  scheduletime: {
    width: "120%",
    borderLeft: 1,
    borderRight: 1,
    borderTop: 1,
  },

  sidebox: {
    border: 1,
    width: "130px",
    marginLeft: "20px",
  },
  sideboxdata: {
    borderBottom: 1,
    borderTop: 1,
    borderRight: 1,
    width: "130px",
  },
  pospan: {
    marginLeft: "3px",
  },

  // *********************
  title1: {
    width: "100%",
    marginTop: "10px",
    fontSize: "15px",
    fontWeight: "bolder",
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
    textAlign: "center", // Center align text
  },

  title2: {
    width: "100%",
    fontSize: "12px",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textAlign: "center", // Center align text
  },

  companyInfo: {
    marginTop: "3px",
    width: "100%", // Use full width for better centering
    fontSize: "9px",
    textAlign: "center", // Center align text
    marginBottom: "2px"
  },
});

const ServicePDF = ({ formdata, PDFData }) => {
  const [Tabledata, setTabledata] = useState([]);
  const [index, setIndex] = useState(0);

  const recordsPerPage = 10;
  const totalPages = Math.ceil(Tabledata.length / recordsPerPage);

  const firstItemData = Tabledata[0];

  //date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const day = date.getDate().toString().padStart(2, "0");

    // Return date in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    postRequest(endpoints.pdfdata, { formdata }, (response) => {
      // console.log("response is",response);
      setTabledata(response);
    });
  }, []);

  //get customer Name
  const [custname, setCustname] = useState("");
  useEffect(() => {
    postRequest(endpoints.getCustName, { formdata }, (response) => {
      setCustname(response[0].Cust_name);
    });
  }, [formdata]);

  // //Location Details
  // const[location,setlocation]=useState([]);
  // useEffect(()=>{
  //   axios
  //   .post(baseURL + "/location/getlocation", {})
  //   .then((response) => {
  //     setlocation(response.data);
  //   });
  // },[])

  // console.log('formdata.Cust_name', formdata[0].Cust_name);

  return (
    <Document>
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={[styles.page, pageIndex === 0 ? styles.firstPage : null]}
          orientation="landscape"
        >
          <View style={styles.codestyle}>
            <Text style={styles.code}>F 32 Rev 3</Text>
          </View>

          <View style={styles.tableContainer}>
            {Tabledata.map((item, index) => (
              <View key={index}>
                {index === 0 && (
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <View style={styles.row}>
                        <View style={styles.logostyle}>
                          <Image src={magodlogo} style={styles.logo} />
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        marginLeft:'-50px'
                      }}
                    >
                      <Text
                        style={[styles.title1, { textDecoration: "underline" }]}
                      >
                        Production Schedule Form
                      </Text>

                      <Text style={styles.title2}>
                        {PDFData.RegisteredName}
                      </Text>

                      <Text style={styles.companyInfo}>
                        GSTIN: {PDFData.GST_No}, CIN: {PDFData.CIN_No}
                      </Text>

                      <Text style={styles.companyInfo}>
                        {PDFData.RegistredOfficeAddress}
                      </Text>

                      <Text style={styles.companyInfo}>
                        {PDFData.PhonePrimary} {PDFData.PhoneSecondary}{" "}
                        {PDFData.Email} {PDFData.URL}
                      </Text>
                    </View>

                    {/* ------------------------------------------------------------- */}

                    {/* <View style={styles.MagodTitle}>
                      <View>
                        <Text
                          style={[styles.titleBold, { marginLeft: "20px" }]}
                        >
                          Magod Laser Machining Pvt Ltd
                        </Text>
                        <Text
                          style={[{ marginTop: "1%", textAlign: "center" }]}
                        >
                          Jigani
                        </Text>
                        <Text
                          style={[
                            {
                              marginTop: "1%",
                              textAlign: "center",
                              fontFamily: "Helvetica-Bold",
                            },
                          ]}
                        >
                          Production Schedule Form
                        </Text>
                        <View style={styles.titlePlace}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { fontSize: "11px" },
                            ]}
                          >
                            {item.location}
                          </Text>
                        </View>

                        <Text
                          style={[styles.typeofform, { marginLeft: "20px" }]}
                        >
                          {item.typeofform}
                        </Text>
                      </View>
                    </View> */}

                    {/* ----------------------------------------------------------------------- */}

                    <View style={styles.tableContainer2}>
                      <View>
                        <View
                          style={[
                            styles.pageNumberContainer,
                            { marginRight:'10px' },
                          ]}
                        >
                          <Text
                            style={styles.pageNumberText}
                            render={({ pageNumber }) => `${pageNumber}`}
                            fixed
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {Tabledata.map((item, index) => (
              <View key={index}>
                {pageIndex === 0 && index === 0 && (
                  <View>
                    <View style={styles.row}>
                      <View style={styles.scheduleViewSection}>
                        <View style={styles.column}>
                          <View style={styles.POno}>
                            <Text style={styles.globalfontwithbold}>PO No</Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.POnodata}>
                            <Text style={styles.globalfontwithbold}>
                              {formdata[0].PO}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.column}>
                          <View style={styles.delivarydate}>
                            <Text style={styles.globalfontwithoutbold}> </Text>
                          </View>
                          <View style={styles.delivarydatedata}>
                            <Text style={styles.globalfontwithbold}> </Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.SalesContact}>
                            <Text style={styles.globalfontwithoutbold}>
                              Sales Contact
                            </Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.SalesContactData}>
                            <Text style={styles.globalfontwithbold}>
                              {formdata[0].SalesContact}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.scheduleViewSection1}>
                        <View style={styles.column}>
                          <View style={styles.ScheduleDate}>
                            <Text style={styles.globalfontwithoutbold}>
                              Schedule Date
                            </Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.ScheduleDatedata}>
                            <Text style={styles.globalfontwithbold}>
                              &nbsp;&nbsp;
                              {formatDate(formdata[0].ScheduleDate)}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.delivarydate}>
                            <Text style={styles.globalfontwithoutbold}></Text>
                          </View>
                          <View style={styles.delivarydatedata}>
                            <Text style={styles.globalfontwithbold}></Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.DeliverDate}>
                            <Text style={styles.globalfontwithoutbold}>
                              Delivery Date
                            </Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.DeliverDatedata}>
                            <Text style={styles.globalfontwithbold}>
                              &nbsp;&nbsp;{" "}
                              {formatDate(formdata[0].Delivery_Date)}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.TargetDate}>
                            <Text style={styles.globalfontwithoutbold}>
                              Target Date
                            </Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.TargetDatedata}>
                            <Text style={styles.globalfontwithbold}>
                              &nbsp;&nbsp;{formatDate(formdata[0].schTgtDate)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.scheduleViewSection2}>
                        <View style={styles.column}>
                          <View style={styles.Instruction}>
                            <Text style={styles.globalfontwithbold}>
                              Instruction
                            </Text>
                            <Text>:</Text>
                          </View>
                          <View style={styles.InstructionData}>
                            <Text style={styles.globalfontwithbold}>
                              {formdata[0].Special_Instructions}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.ScheduleNO}>
                      <View style={styles.column}>
                        <View style={[styles.custScheduleNo]}>
                          <Text
                            style={[
                              styles.datawithoutbline,
                              { fontSize: "11px" },
                            ]}
                          >
                            Schedule No: {item.otherdetails[0].ScheduleNo}
                          </Text>
                        </View>
                        {/* <View style={styles.targerdatedata}>
        <Text style={styles.datawithoutbline}>234105 01
</Text>
      </View> */}

                        <View style={styles.custName}>
                          <Text
                            style={[
                              styles.datawithoutbline,
                              { fontSize: "11px" },
                            ]}
                          >
                            Customer Name : {formdata[0].Cust_name}
                          </Text>
                        </View>
                        {/* <View style={styles.targerdatedata}>
        <Text style={styles.datawithoutbline}>SEALTITE DICHTUNGS PVT, LTD.</Text>
      </View> */}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
            <View style={styles.maintableview}>
              <View
                style={[
                  styles.tableDisplay,
                  { marginBottom: "10px" },
                ]}
              >
                <View style={styles.column}>
                  <View style={styles.srl}>
                    <Text style={styles.datawithoutbline}>Srl</Text>
                  </View>

                  <View style={styles.drawingname}>
                    <Text style={styles.datawithoutbline}>Drawing name</Text>
                  </View>

                  <View style={styles.Inspection}>
                    <Text style={styles.datawithoutbline}>Inspection</Text>
                  </View>

                  <View style={styles.Packing}>
                    <Text style={styles.datawithoutbline}>Packing</Text>
                  </View>

                  <View style={styles.Scheduled}>
                    <Text style={styles.datawithoutbline}>Scheduled</Text>
                  </View>

                  <View style={styles.Produced}>
                    <Text style={styles.datawithoutbline}>Produced</Text>
                  </View>
                  <View style={styles.Delivered}>
                    <Text style={styles.datawithoutbline}>Delivered</Text>
                  </View>
                  <View style={styles.scheduleNotable}>
                    <Text style={styles.datawithoutbline}>
                      {/* {item.taskno} */}
                    </Text>
                  </View>
                </View>
              </View>
              {Tabledata.slice(
                pageIndex * recordsPerPage,
                (pageIndex + 1) * recordsPerPage
              ).map((item, index) => (
                <>
                  <View>
                    <View style={[styles.row, { borderBottom: 1 }]}>
                      <View style={styles.taskNoStyle}>
                        <Text
                          style={[
                            styles.tabletext,
                            {
                              fontSize: "12px",
                              paddingBottom: "5px",
                            },
                          ]}
                        >
                          Task No : {item.taskNo}
                        </Text>
                      </View>

                      <View style={styles.custMaterialStyle}>
                        <Text
                          style={[
                            styles.tabletext,
                            {
                              fontSize: "12px",
                              paddingBottom: "5px",
                            },
                          ]}
                        >
                          Material: {item.Mtrl_Code}/{item.Mtrl_Source}/
                          {item.Operation}
                        </Text>
                      </View>

                      {/* <View style={styles.sheetDetails}>
                      <Text
                        style={[
                          styles.tabletext,
                          {
                            fontSize: "12px",
                            paddingBottom: "5px",
                            fontFamily: "Helvetica-Bold",
                          },
                        ]}
                      ></Text>
                    </View> */}

                      {/* <View style={styles.sheetDetails}>
                      <Text
                        style={[
                          styles.tabletext,
                          {
                            fontSize: "12px",
                            paddingBottom: "5px",
                            fontFamily: "Helvetica-Bold",
                          },
                        ]}
                      ></Text>
                    </View> */}
                    </View>
                  </View>
                  <View key={index} style={styles.tableDataView}>
                    {item.otherdetails.map((detail, subIndex) => (
                      <View style={styles.row}>
                        <View style={styles.srldata}>
                          <Text style={styles.tabletext}>{index + 1}</Text>
                        </View>

                        <View style={styles.drawingnamedata}>
                          <Text style={styles.tabletext}>{detail.DwgName}</Text>
                        </View>

                        <View style={styles.Inspectiondata}>
                          <Text style={styles.tabletext}>
                            {detail.InspLevel}
                          </Text>
                        </View>

                        <View style={styles.Packingdata}>
                          <Text style={styles.tabletext}>
                            {detail.PackingLevel}
                          </Text>
                        </View>

                        <View style={styles.Scheduleddata}>
                          <Text style={styles.tabletext}>
                            {detail.QtyScheduled}
                          </Text>
                        </View>

                        <View style={styles.Produceddata}>
                          <Text style={styles.tabletext}></Text>
                        </View>

                        <View style={styles.Delivereddata}>
                          <Text style={styles.tabletext}></Text>
                        </View>

                        <View style={styles.scheduleNotabledata}>
                          <Text style={styles.tabletext}></Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ))}

              <View style={styles.mainsidetableview}>
                <View style={styles.column}>
                  <View>
                    <View style={[styles.row]}>
                      <View>
                        <View
                          style={{
                            fontFamily: "Helvetica-Bold",
                            fontSize: "11px",
                            width: "230px",
                          }}
                        >
                          <Text>Production Approved and Scheduled By</Text>
                        </View>
                      </View>

                      <View style={{ width: "220px", marginLeft: "30px" }}>
                        <View style={[styles.column]}>
                          <View style={styles.scheduletime}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "40px" },
                              ]}
                            >
                              Schedule Time Estmates
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.column]}>
                          <View style={styles.sales}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "20px" },
                              ]}
                            >
                              Sales
                            </Text>
                          </View>

                          <View style={styles.ncpgm}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "17px" },
                              ]}
                            >
                              NC Pgm
                            </Text>
                          </View>

                          <View style={styles.prod}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "20px" },
                              ]}
                            >
                              Prod
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.column]}>
                          <View style={styles.salesdata}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "30px" },
                              ]}
                            >
                              {" "}
                              :{" "}
                            </Text>
                          </View>

                          <View style={styles.ncpgmdata}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "30px" },
                              ]}
                            >
                              {" "}
                              :{" "}
                            </Text>
                          </View>

                          <View style={styles.proddata}>
                            <Text
                              style={[
                                styles.datawithoutbline,
                                { paddingLeft: "30px" },
                              ]}
                            >
                              {" "}
                              :{" "}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.row}>
                        <View style={[styles.sidebox]}>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "left",
                                },
                              ]}
                            >
                              Invoice No
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "left",
                                },
                              ]}
                            >
                              Invoice Date
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "left",
                                },
                              ]}
                            >
                              Quantity
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "left",
                                },
                              ]}
                            >
                              Invoice Value
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "left",
                                },
                              ]}
                            >
                              Production Time
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", textAlign: "left" },
                              ]}
                            >
                              MPHR
                            </Text>
                          </View>
                        </View>

                        {/* <View style={[styles.sideboxdata]}>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px" },
                              ]}
                            >
                            </Text>
                          </View>
                        </View> */}
                        <View style={[styles.sideboxdata]}>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", borderBottom: 1 },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px" },
                              ]}
                            >
                              {" "}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <View style={{ marginLeft: "40px" }}>
                  <Text style={styles.globalfontwithbold}>
                    {formdata[0].SalesContact}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ServicePDF;
