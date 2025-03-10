import React, { useEffect, useState } from "react";
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
import { postRequest } from "../../api/apiinstance";
import { endpoints } from "../../api/constants";
import magodlogo from "../../../../src/ML-LOGO.png";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
    marginTop: 30, // Adjust top margin for the whole page
    marginBottom: 50, // Adjust bottom margin for the whole page
    paddingBottom: 50, // Ensure there is enough space at the bottom
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
    width: "50px",
    height: "50px",
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
    marginLeft: "15px",
  },
  MagodTitle: {
    width: "70%",
  },
  titleBold: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: "15px",
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
    width: "25%",
    borderBottom: 1,
    borderTop: 1,
    borderLeft: 1,
  },
  scheduleViewSection1: {
    width: "25%",
    borderBottom: 1,
    borderTop: 1,
    borderLeft: 1,
  },
  scheduleViewSection2: {
    width: "45%",
    border: 1,
  },

  cornertableWidth: {
    width: "25%",
  },
  Schedule: {
    width: "50%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  Scheduledata: {
    width: "50%",
    paddingBottom: "3px",
  },
  delivarydate: {
    width: "50%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  delivarydatedata: {
    width: "50%",
    paddingBottom: "3px",
  },

  Schedule1: {
    width: "25%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  Scheduledata1: {
    width: "75%",
    paddingBottom: "3px",
  },
  delivarydate1: {
    width: "25%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  delivarydatedata1: {
    width: "75%",
    paddingBottom: "3px",
  },

  targetdateview: {
    width: "50%",
    marginLeft: 15,
    paddingBottom: "3px",
  },
  targerdatedata: {
    width: "50%",
    paddingBottom: "3px",
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
    marginTop: "10px",
    // borderBottom:1,
  },
  srl: {
    width: "10%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  drawingname: {
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
    width: "50%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
  },
  Inspection: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Packing: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Scheduled: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Produced: {
    width: "10%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },
  Delivered: {
    width: "20%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
  },

  scheduleNotable: {
    width: "15%",
    paddingBottom: "3px",
    textAlign: "center",
    paddingTop: "3px",
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
    width: "50%",
    paddingBottom: "3px",
    paddingTop: "3px",
    textAlign: "center",
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
    fontSize: "12px",
    fontFamily: "Helvetica-Bold",
  },
  globalfontwithoutbold: {
    fontSize: "12px",
  },
  titlePlace: {
    marginLeft: "50%",
  },
  instruction: {
    marginTop: "5px",
    width: "95%",
    marginLeft: "30px",
    borderBottom: 1,
    // borderLeft:1,
    // borderRight:1,
    height: "20%",
  },
  footer: {
    width: "80%",
    marginLeft: 10,
    marginTop: "15px",
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
});

const PrintPDF = ({ formdata }) => {
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
    // Use template literals to format the date
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    postRequest(
      endpoints.PrintSchedulePDF,
      { formdata },
      (response) => {
        // console.log("response is",response);
        setTabledata(response);
      }
    );
  }, []);

  //get customer Name
  const[custname,setCustname]=useState('')
  useEffect(() => {
    postRequest(
      endpoints.getCustNamePDF,
      { formdata },
      (response) => {
          setCustname(response[0].Cust_name);
      }
    );
  }, [formdata]);
  
  return (
    <Document>
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={[styles.page, pageIndex === 0 ? styles.firstPage : null]}
          orientation="landscape"
        >
          {/* <View style={styles.codestyle}>
            <Text style={styles.code}>F 32 Rev 3</Text>
          </View> */}

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

                    <View style={styles.MagodTitle}>
                      <View>
                        <Text
                          style={[styles.titleBold, { marginLeft: "20px" }]}
                        >
                          Magod Laser Machining Pvt Ltd
                        </Text>
                        <View style={styles.titlePlace}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { fontSize: "15px" },
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
                    </View>

                    <View style={styles.tableContainer2}>
                      <View>
                        <View
                          style={[
                            styles.pageNumberContainer,
                            { textAlign: "right" },
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
                          <View style={styles.Schedule}>
                            <Text style={styles.globalfontwithbold}>
                              PO No{" "}
                            </Text>
                          </View>
                          <View style={styles.Scheduledata}>
                            <Text style={styles.globalfontwithbold}>
                              :&nbsp;&nbsp;{formdata.PO}
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
                          <View style={styles.delivarydate}>
                            <Text style={styles.globalfontwithoutbold}>
                              Sales Contact
                            </Text>
                          </View>
                          <View style={styles.delivarydatedata}>
                            <Text style={styles.globalfontwithbold}>
                              {" "}
                              : {formdata.SalesContact}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.scheduleViewSection1}>
                        <View style={styles.column}>
                          <View style={styles.Schedule}>
                            <Text style={styles.globalfontwithoutbold}>
                              Schedule Date{" "}
                            </Text>
                          </View>
                          <View style={styles.Scheduledata}>
                            <Text style={styles.globalfontwithbold}>
                              :&nbsp;&nbsp;{formatDate(formdata.ScheduleDate)}
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
                          <View style={styles.targetdateview}>
                            <Text style={styles.globalfontwithoutbold}>
                              Delivery Date
                            </Text>
                          </View>
                          <View style={styles.targerdatedata}>
                            <Text style={styles.globalfontwithbold}>
                              :&nbsp;&nbsp; {formatDate(formdata.Delivery_Date)}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.column}>
                          <View style={styles.targetdateview}>
                            <Text style={styles.globalfontwithoutbold}>
                              Target Date
                            </Text>
                          </View>
                          <View style={styles.targerdatedata}>
                            <Text style={styles.globalfontwithbold}>
                              :&nbsp;&nbsp;{formatDate(formdata.schTgtDate)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.scheduleViewSection2}>
                        <View style={styles.column}>
                          <View style={styles.Schedule1}>
                            <Text style={styles.globalfontwithbold}>
                              Instruction :
                            </Text>
                          </View>
                          <View style={styles.Scheduledata1}>
                            <Text style={styles.globalfontwithbold}>
                              {formdata.Special_Instructions}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.instruction}>
                      <View style={styles.column}>
                        <View style={styles.targetdateview}>
                          <Text style={styles.datawithoutbline}>
                            Schedule NO: {formdata.OrdSchNo}
                          </Text>
                        </View>
                        {/* <View style={styles.targerdatedata}>
        <Text style={styles.datawithoutbline}>234105 01
</Text>
      </View> */}

                        <View style={styles.targetdateview}>
                          <Text style={styles.datawithoutbline}>
                            Customer Name : {custname}
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

              {Tabledata.slice(
                pageIndex * recordsPerPage,
                (pageIndex + 1) * recordsPerPage
              ).map((item, index) => (
                <View key={index} style={styles.tableDataView}>
                  <View style={[styles.row, { borderBottom: 1 }]}>
                    <View style={styles.sheetDetails}>
                      <Text
                        style={[
                          styles.tabletext,
                          { fontSize: "12px", paddingBottom: "5px" },
                        ]}
                      >
                        Task No : {item.taskNo}
                      </Text>
                    </View>
                  
                    <View style={styles.sheetDetails}>
                      <Text
                        style={[
                          styles.tabletext,
                          {
                            fontSize: "12px",
                            paddingBottom: "5px",
                            width: "500px",
                          },
                        ]}
                      >
                        Material:{item.Mtrl_Code}/{item.Mtrl_Source}/{item.Operation}
                      </Text>
                    </View>

                    <View style={styles.sheetDetails}>
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
                    </View>

                    <View style={styles.sheetDetails}>
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
                    </View>
                  </View>

                  <View style={[styles.tableDisplay, { marginTop: "10px" }]}>
                    <View style={styles.column}>
                      <View style={styles.srl}>
                        <Text style={styles.datawithoutbline}>Srl</Text>
                      </View>

                      <View style={styles.drawingname}>
                        <Text style={styles.datawithoutbline}>
                          Drawing name
                        </Text>
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
                          {item.taskno}
                        </Text>
                      </View>
                    </View>
                  </View>

            {item.otherdetails.map((detail, subIndex) => (
                  <View style={styles.row}>
                    <View style={styles.srldata}>
                      <Text style={styles.tabletext}>{subIndex + 1}</Text>
                    </View>

                    <View style={styles.drawingnamedata}>
                      <Text style={styles.tabletext}>{detail.DwgName}</Text>
                    </View>

                    <View style={styles.Inspectiondata}>
                      <Text style={styles.tabletext}>{detail.InspLevel}</Text>
                    </View>

                    <View style={styles.Packingdata}>
                      <Text style={styles.tabletext}>{detail.PackingLevel}</Text>
                    </View>

                    <View style={styles.Scheduleddata}>
                      <Text style={styles.tabletext}>{detail.QtyScheduled}</Text>
                    </View>

                    <View style={styles.Produceddata}>
                      <Text style={styles.tabletext}>{detail.QtyProduced}</Text>
                    </View>

                    <View style={styles.Delivereddata}>
                      <Text style={styles.tabletext}>{detail.QtyDelivered}</Text>
                    </View>

                    <View style={styles.scheduleNotabledata}>
                      <Text style={styles.tabletext}></Text>
                    </View>
                  </View>
                   ))}
                </View>
              ))}


            
              <View style={styles.mainsidetableview}>
                <View style={styles.column}>
                  <View>
                    <View style={[styles.row]}>
                      <View>
                        <View
                          style={{
                            fontFamily: "Helvetica-Bold",
                            fontSize: "12px",
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
                                  textAlign: "center",
                                },
                              ]}
                            >
                              Invoice No :{" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "center",
                                },
                              ]}
                            >
                              Invoice Date :{" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "center",
                                },
                              ]}
                            >
                              Quantity :{" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "center",
                                },
                              ]}
                            >
                              Invoice Value :{" "}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                {
                                  marginBottom: "5px",
                                  borderBottom: 1,
                                  textAlign: "center",
                                },
                              ]}
                            >
                              Production Time:{" "}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.globalfontwithbold,
                                { marginBottom: "5px", textAlign: "center" },
                              ]}
                            >
                              MPHR :{" "}
                            </Text>
                          </View>
                        </View>

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
                <View style={{ marginLeft: "40px", marginTop: "10px" }}>
                  <Text style={styles.globalfontwithbold}>{formdata.SalesContact}</Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PrintPDF;
