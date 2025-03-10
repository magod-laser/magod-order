
Imports System.IO
Imports MySql.Data.MySqlClient


Public Class Order

    Public FormOK As Boolean = False
    Private schLoaded As Boolean = False
    Dim OrderNo As String = ""
    Dim order_Srl As Integer
    Dim Da_order, DA_OrderDetails, DA_ProFarma, DA_ProfarmaDetails, DA_ProfarmaTax As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim DA_Schedule, DA_SchDetails, DA_custDwg As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim update_record As Integer = 0
    Dim flag As Integer = 0
    Dim OrderFolder, custCode As String
    Dim dxfName As String

    Private OrderRow As Magod.Orders.Order_ListRow
    Private tblOrderDetails As New magod.Orders.Order_DetailsDataTable
    Dim defaultPara As DefaultPara
    Dim insertCmd As MySql.Data.MySqlClient.MySqlCommand
    Dim cmdOrderDetailsInsert As String
    Dim model As WW.Cad.Model.DxfModel
    Private MS As magod.SigmaNest.Sigma
    '**** Intiation

#Region "Order Main"

    Public Sub New(ByVal OrdNo As String)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        '**** Connect to Server 
        '****Exit if OrderNo does not exist
        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@OrderNo", OrdNo)
            .CommandText = "SELECT COUNT(*) FROM magodmis.order_list WHERE Order_No=@OrderNo;"
            .Connection.Open()
            Dim count As Integer = .ExecuteScalar
            If count = 0 Then Exit Sub
            .Connection.Close()
        End With
        OrderNo = OrdNo
      
        Try
            OrderFolder = Orders.getDBLink.getPath("WorkOrder") & "\" & OrderNo
            setUpData()
            BS_SalesContact = Orders.salesExecList
            BS_Operation.DataSource = Orders.getOperationsList
            With Me.cmb_dealingeng
                ' BS_SalesContact.Filter = "Skill_name='Sales'"
                .DataSource = BS_SalesContact
                .DisplayMember = "Name"
                .ValueMember = "Name"
            End With
            With Me.cmb_material
                .DataSource = Orders.getMtrlCode
                .DisplayMember = "Mtrl_Code"
                .ValueMember = "Mtrl_code"
            End With
            BS_InspLevel.DataSource = Orders.getInspLevel
            Select Case OrderRow.Type
                Case "Profile"
                    BS_Operation.DataSource = Orders.getProfileOperations
                    TabControl_DwgDetails.SelectedTab = TabPageDrawing
                    Me.DGV_OrderDetails.Columns("LOC").Visible = True
                    Me.DGV_OrderDetails.Columns("Pierces").Visible = True
                Case "Service"
                    BS_Operation.DataSource = Orders.getServiceOperations
                    TabControl_DwgDetails.SelectedTab = TabPageDetails
                Case "Fabrication"
                    BS_Operation.DataSource = Orders.getFabricationProcessList
                    TabControl_DwgDetails.SelectedTab = TabPageDrawing
                Case "Misc"


            End Select
         
            BS_Tolerance.DataSource = Orders.getTolerance
            BS_PkngLevel.DataSource = Orders.getPkngLevel
            Bs_PartsList.DataSource = tblOrderDetails
            defaultPara = New DefaultPara

         
            flag = 1
            FormOK = True
            setUpInsertCmd()

        Catch ex As Exception
            MsgBox(ex.Message)
        End Try

    End Sub
 
    Private Sub Form_Order_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        Me.WindowState = FormWindowState.Maximized
        flag = 0
        setOrderSrlStatus()
        setStatusButtons()
        setOrderValue()
    End Sub

#End Region

#Region "Data Setup"
    Private Sub setUpInsertCmd()
        insertCmd = Orders.getDBLink.getCommand
        cmdOrderDetailsInsert = "Insert Into magodmis.order_details(order_no,order_srl ,cust_code,dwgname ,Dwg_Code, " _
                        & "mtrl_code , operation, mtrl_source, qty_ordered, insplevel , " _
                        & "packinglevel, delivery_date, JwCost,mtrlcost,Dwg,Tolerance,HasBOM,LOC,Holes) " _
                        & "values (@order_no,@order_srl ,@cust_code,@dwgname ,@Dwg_Code, " _
                        & "@mtrl_code , @operation, @mtrl_source, @qty_ordered, @insplevel , " _
                        & "@packinglevel, @delivery_date, @JwCost,@mtrlcost,@Dwg,@Tolerance,@HasBOM,@LOC,@Holes); "
        With insertCmd
            .CommandText = cmdOrderDetailsInsert
            With .Parameters
                .AddWithValue("@order_no", OrderRow.Order_No)
                .Add("@order_srl", MySqlDbType.VarChar, 3, "order_srl")
                .AddWithValue("@cust_code", OrderRow.Cust_Code)
                .Add("@dwgname", MySqlDbType.VarChar, 50, "dwgname")
                .Add("@Dwg_Code", MySqlDbType.VarChar, 50, "Dwg_Code")
                .Add("@mtrl_code", MySqlDbType.VarChar, 40, "mtrl_code")
                .Add("@operation", MySqlDbType.VarChar, 50, "operation")
                .Add("@mtrl_source", MySqlDbType.VarChar, 10, "mtrl_source")
                .Add("@qty_ordered", MySqlDbType.Int32, 10, "qty_ordered")
                .Add("@insplevel", MySqlDbType.VarChar, 50, "insplevel")
                .Add("@packinglevel", MySqlDbType.VarChar, 50, "packinglevel")
                .Add("@delivery_date", MySqlDbType.Date, 50, "delivery_date")
                .Add("@JWCost", MySqlDbType.Double, 20, "JWCost")
                .Add("@MtrlCost", MySqlDbType.Double, 20, "MtrlCost")
                .Add("@Dwg", MySqlDbType.Int16, 5, "Dwg")
                .Add("@HasBOM", MySqlDbType.Int16, 5, "HasBOM")
                .Add("@Tolerance", MySqlDbType.VarChar, 40, "Tolerance")
                .Add("@LOC", MySqlDbType.Double, 20, "LOC")
                .Add("@Holes", MySqlDbType.Int32, 5, "Holes")

            End With
        End With
    End Sub
    Private Sub setUpData()

        set_DaOrder()
        set_DaOrderDetails()
        set_DaSchedule()
        set_DAProfarma()
    End Sub
    Private Sub reloadOrderDetails()
        Orders1.Order_Details.Clear()
        With DA_OrderDetails
            .SelectCommand.Parameters("@order_no").Value = OrderNo
            .Fill(Orders1.Order_Details)
        End With
        If Orders1.Order_Details.Count > 0 Then
            order_Srl = Aggregate srl In Orders1.Order_Details Into Max(srl.Order_Srl)
        Else
            order_Srl = 0
        End If
    End Sub
    Private Sub set_DaOrder()
        Da_order = Orders.getDBLink.getMySqlDataAdopter
        With Da_order
            '**** Set Dataadopter Parameters
            With Da_order

                With .SelectCommand
                    .CommandText = "SELECT o.*,c.Cust_name,c.dwgloc FROM magodmis.order_list o,magodmis.cust_data c " _
                                    & "WHERE Order_No=@Order_No AND o.cust_code=c.cust_code ;"
                    .Parameters.AddWithValue("@Order_No", OrderNo)
                End With

                With .UpdateCommand
                    .CommandText = "UPDATE magodmis.order_list o SET o.Dealing_Engineer=@Dealing_Engineer, " _
                                    & "o.Delivery_Date=@Delivery_Date,o.Order_Status=@Order_Status, " _
                                    & "o.Special_Instructions=@Special_Instructions, o.Delivery=@Delivery, o.Del_Place=@Del_Place, " _
                                    & "o.Del_Mode=@Del_Mode,o.TptCharges =@TptCharges" _
                                   & " WHERE o.Order_No=@Order_No;"
                    With .Parameters
                        .Add("@Dealing_Engineer", MySqlDbType.VarChar, 50, "dealing_engineer")
                        .Add("@Delivery_Date", MySqlDbType.Date, 200, "Delivery_Date")
                        .Add("@Order_Status", MySqlDbType.VarChar, 20, "Order_status")
                        .Add("@Special_Instructions", MySqlDbType.VarChar, 200, "Special_Instructions")
                        .Add("@Delivery", MySqlDbType.Int16, 10, "Delivery")
                        .Add("@Del_Place", MySqlDbType.VarChar, 200, "Del_Place")
                        .Add("@Del_Mode", MySqlDbType.VarChar, 40, "Del_Mode")
                        .Add("@TptCharges", MySqlDbType.VarChar, 40, "TptCharges")
                        .Add("@Order_No", MySqlDbType.VarChar, 15, "Order_No")
                    End With
                End With
                .Fill(Orders1.Order_List)
                If Not Orders1.Order_List.Rows.Count = 0 Then
                    OrderRow = Orders1.Order_List.Rows(0)
                    Me.Label_header.Text += String.Format("{3} - {0}       {1} ({2}) ", OrderRow.Order_No, OrderRow.Cust_name, OrderRow.Cust_Code, OrderRow.Type)
                Else
                    MsgBox(String.Format("{0} : No such Order No currently exists in OrderList", OrderNo))
                    Me.Close()
                    Exit Sub
                End If
            End With

        End With
        '***** See Customer Drawings
        DA_custDwg = Orders.getDBLink.getMySqlDataAdopter
        With DA_custDwg
            With .SelectCommand
                .CommandText = " SELECT d.`Dwg_Code`, d.`Cust_Code`, d.`DwgName`, d.`Mtrl_Code`, d.`MtrlCost`," _
                & "d.`JobWorkCost`,Cast(right( `Dwg_Code`,4) as UNSIGNED) as codeSrl,d.`MProcess` , d.`Operation`, 0 as HasBOM " _
                & "FROM magodmis.dwg_data d WHERE cust_code=@cust_code " _
                & "UNION " _
                & "SELECT c.`MagodCode` as Dwg_Code,c.`Cust_Code`, c.`AssyCust_PartId`as DwgName," _
                & "'Undefined' as Mtrl_Code, c.`MtrlCost`, c.`JobWorkCost`, 0 as codeSrl,'Undefined' as MProcess,'Undefined' as Operation, 1 as HasBOM " _
                & "FROM magodmis.cust_assy_data c WHERE c.`Cust_Code` =@cust_code " _
                & " UNION " _
                & "SELECT c.`MagodPartId` as Dwg_Code, c.`Cust_code`, c.`PartId` as DwgName," _
                & "'Undefined' as Mtrl_Code, 0 as `MtrlCost`, 0 as `JobWorkCost`, 0 as codeSrl,'Undefined' as MProcess," _
                & "'Undefined' as Operation, 0 as HasBOM " _
                & "FROM magodmis.cust_bomlist c WHERE c.`Cust_code`=@Cust_code;"

                .Parameters.AddWithValue("@cust_code", OrderRow.Cust_Code)

            End With
            'Dwg_Code, Cust_Code, DwgName, Mtrl_Code, DxfLoc, DwgLoc, 
            'File_Ref, Rvsn_Date, LOC, Holes, MProcess,
            'Part_Wt, PartArea, RectWt, RectArea, MtrlCost, JobWorkCost, Invoice_Price
            With .InsertCommand
                .CommandText = "INSERT INTO magodmis.dwg_data(Dwg_Code,Cust_Code, " _
                & "DwgName, Mtrl_Code, DxfLoc,Operation,MtrlCost,JobWorkCost) " _
                & "VALUES(@Dwg_Code,@Cust_Code, " _
                & "@DwgName, @Mtrl_Code, @DxfLoc,@Operation,@MtrlCost,@JobWorkCost);"
                With .Parameters
                    .Add("@Dwg_Code", MySqlDbType.VarChar, 10, "Dwg_Code")
                    .Add("@Cust_Code", MySqlDbType.VarChar, 10, "Cust_Code")
                    .Add("@DwgName", MySqlDbType.VarChar, 200, "DwgName")
                    .Add("@Mtrl_Code", MySqlDbType.VarChar, 50, "Mtrl_Code")
                    .Add("@DxfLoc", MySqlDbType.VarChar, 200, "DxfLoc")
                    .Add("@Operation", MySqlDbType.VarChar, 50, "Operation")
                    .Add("@MtrlCost", MySqlDbType.Double, 20, "MtrlCost")
                    .Add("@JobWorkCost", MySqlDbType.VarChar, 10, "JobWorkCost")
                End With
            End With

            With .UpdateCommand
                .CommandText = "UPDATE magodmis.dwg_data SET  " _
                & "Mtrl_Code=@Mtrl_Code, DxfLoc=@DxfLoc,Operation=@Operation,MtrlCost=@MtrlCost,JobWorkCost=@JobWorkCost " _
                & "WHERE Dwg_Code =@Dwg_Code;"
                With .Parameters
                    .Add("@Mtrl_Code", MySqlDbType.VarChar, 50, "Mtrl_Code")
                    .Add("@DxfLoc", MySqlDbType.VarChar, 200, "DxfLoc")
                    .Add("@Operation", MySqlDbType.VarChar, 50, "Operation")
                    .Add("@MtrlCost", MySqlDbType.Double, 20, "MtrlCost")
                    .Add("@JobWorkCost", MySqlDbType.VarChar, 10, "JobWorkCost")
                    .Add("@Dwg_Code", MySqlDbType.VarChar, 10, "Dwg_Code")
                End With
            End With

            .Fill(Orders1.dwg_data)
        End With
    End Sub
    Private Sub set_DaSchedule()
        DA_Schedule = Orders.getDBLink.getMySqlDataAdopter
        With DA_Schedule
            '**************SCHEDULE********
            With DA_Schedule


                With.SelectCommand
                    .CommandText = "SELECT c.cust_name, o.*,m.indent_no,m.indentstatus " _
                                & "FROM magodmis.cust_data c, magodmis.orderschedule o " _
                                & "left join magodmis.mtrl_indent_register m on o.`ScheduleID`=m.`scheduleId`" _
                                & "WHERE o.Order_No=@Order_No AND c.cust_code=o.cust_code;"
                    .CommandText = "SELECT c.cust_name, o.* " _
                               & "FROM magodmis.cust_data c, magodmis.orderschedule o " _
                               & "WHERE o.Order_No=@Order_No AND c.cust_code=o.cust_code;"
                    .Parameters.AddWithValue("@Order_No", OrderNo)
                End With

             

                With .DeleteCommand
                    .CommandText = "DELETE FROM magodmis.orderschedule WHERE Scheduleid=@ScheduleID;"
                    .Parameters.Add("@ScheduleID", MySqlDbType.Int32, 20, "ScheduleID")
                End With

                With .UpdateCommand
                    .CommandText = "Update magodmis.orderschedule SET Schedule_status=@Schedule_status WHERE ScheduleId=@ScheduleId;"
                    .Parameters.Add("@Schedule_status", MySqlDbType.VarChar, 30, "Schedule_Status")
                    .Parameters.Add("@ScheduleId", MySqlDbType.Int32, 20, "ScheduleID")
                End With
            End With
            .Fill(Orders1.orderschedule)

            '***** Schedule Details

            DA_SchDetails = Orders.getDBLink.getMySqlDataAdopter
            With DA_SchDetails

                With .SelectCommand
                    .CommandText = "SELECT * FROM magodmis.orderscheduledetails o WHERE o.ScheduleId=@ScheduleId"
                    .Parameters.Add("@ScheduleId", MySqlDbType.Int32)
                End With

            End With
        End With
        '***** Update Order Parts List with Quantities from Schedule Part List


    End Sub
    ''' <summary>
    ''' Order Schedule details Data Adopter
    ''' </summary>
    Private Sub set_DaOrderDetails()

        Dim SQL As String
        'SQL = "UPDATE magodmis.order_details o, "
        'SQL = SQL & "(SELECT   sum(o.`QtyProduced`) as QtyProduced, sum( o.`QtyPacked`) as qtyPacked,
        '    sum(o.`QtyDelivered`) as QtyDelivered, o.`OrderDetailID` "
        'SQL = SQL & "FROM magodmis.orderscheduledetails o
        '        WHERE o.`Order_No`=@Order_No GROUP BY o.`OrderDetailID`) as A "
        'SQL = SQL & "SET o.qtypacked=a.qtypacked,o.qtyproduced=a.qtyproduced,o.qtydelivered=a.qtydelivered " _
        '& "WHERE o.orderdetailid=a.orderdetailid;"

        'With Orders.getCommand
        '    .Connection.Open()
        '    .CommandText = SQL
        '    .Parameters.Clear()
        '    .Parameters.Add("@Order_No", MySqlDbType.VarChar).Value = OrderNo
        '    '  .ExecuteNonQuery()
        '    .Connection.Close()
        '    .Parameters.Clear()
        'End With

        DA_OrderDetails = Orders.getDBLink.getMySqlDataAdopter
        With DA_OrderDetails
            With DA_OrderDetails


                With .SelectCommand
                    .CommandText = " SELECT o.* FROM magodmis.order_details o " _
                                                & "WHERE o.order_no=@order_no;"
                    .Parameters.Add("@order_no", MySqlDbType.VarChar).Value = OrderNo
                End With


                With .UpdateCommand
                    .CommandText = "UPDATE magodmis.order_details o " _
                                    & "SET o.Dwg_Code=@Dwg_Code, o.DwgName=@DwgName, o.Mtrl_Code=@Mtrl_Code, " _
                                    & " o.Operation=@Operation, o.Mtrl_Source=@Mtrl_Source,  o.LOC=@LOC, o.Holes=@Holes," _
                                    & "o.Qty_Ordered=@Qty_Ordered, o.InspLevel=@InspLevel, o.PackingLevel=@PackingLevel," _
                                    & "o.Delivery_Date=@Delivery_Date, o.JWCost=@JWCost, o.MtrlCost=@MtrlCost ,o.dwg=@dwg, " _
                                    & " o.`Tolerance`= @Tolerance, o.`HasBOM`= @HasBOM WHERE o.OrderDetailID=@OrderDetailID;"
                    With .Parameters
                        .Add("@Dwg_Code", MySqlDbType.VarChar, 50, "Dwg_Code")
                        .Add("@DwgName", MySqlDbType.VarChar, 200, "DwgName")
                        .Add("@Mtrl_Code", MySqlDbType.VarChar, 100, "Mtrl_Code")
                        .Add("@Operation", MySqlDbType.VarChar, 50, "Operation")
                        .Add("@Mtrl_Source", MySqlDbType.VarChar, 10, "Mtrl_Source")
                        .Add("@Qty_Ordered", MySqlDbType.Int32, 10, "Qty_Ordered")
                        .Add("@InspLevel", MySqlDbType.VarChar, 50, "InspLevel")
                        .Add("@PackingLevel", MySqlDbType.VarChar, 50, "PackingLevel")
                        .Add("@Delivery_Date", MySqlDbType.Date, 50, "Delivery_Date")
                        .Add("@JWCost", MySqlDbType.Double, 20, "JWCost")
                        .Add("@MtrlCost", MySqlDbType.Double, 20, "MtrlCost")
                        .Add("@Dwg", MySqlDbType.Int16, 5, "Dwg")
                        .Add("@LOC", MySqlDbType.Double, 20, "LOC")
                        .Add("@Holes", MySqlDbType.Int32, 5, "Holes")
                        .Add("@Tolerance", MySqlDbType.VarChar, 40, "Tolerance")
                        .Add("@HasBOM", MySqlDbType.Int16, 5, "HasBOM")
                        .Add("@OrderDetailID", MySqlDbType.Int32, 20, "OrderDetailID")
                    End With
                End With


                With .DeleteCommand
                    .CommandText = "DELETE FROM magodmis.order_details WHERE OrderDetailID=@OrderDetailID; "
                    .Parameters.Add("@OrderDetailID", MySqlDbType.Int32, 20, "OrderDetailID")
                End With
                .Fill(Orders1.Order_Details)
                If Orders1.Order_Details.Count > 0 Then
                    order_Srl = Aggregate srl In Orders1.Order_Details Into Max(srl.Order_Srl)
                End If

            End With

        End With
    End Sub
    Private Sub set_DAProfarma()
        DA_ProFarma = Orders.getDBLink.getMySqlDataAdopter
        With DA_ProFarma

            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.profarma_main WHERE OrderNo=@OrderNo ;"
                .Parameters.Add("@OrderNo", MySqlDbType.VarChar).Value = OrderNo
            End With

            With .DeleteCommand
                .CommandText = "DELETE FROM magodmis.profarma_Main WHERE ProfarmaID=@ProfarmaID;"
                .Parameters.Add("@ProfarmaID", MySqlDbType.Int32, 20, "ProfarmaID")
            End With
            .Fill(PkngandInvoice1.profarma_main)
          
        End With
        DA_ProfarmaDetails = Orders.getDBLink.getMySqlDataAdopter
        With DA_ProfarmaDetails

            With .SelectCommand
                .CommandText = "SELECT p.`OrderNo`, p1.* FROM magodmis.profarma_main p,magodmis.profarmadetails p1 " _
                                & "WHERE OrderNo=@OrderNo AND p.`ProfarmaID`=p1.`ProfarmaID`;"
                .Parameters.Add("@OrderNo", MySqlDbType.VarChar).Value = OrderNo
            End With
            .Fill(PkngandInvoice1.profarmadetails)
        End With
    End Sub



#End Region

#Region "Order Handling"
    Private Function checkType() As Boolean
        If RadioButton_JW_Prod.Checked Then
            For Each dr As DataGridViewRow In DGV_OrderDetails.SelectedRows
                If dr.Cells("mtrl_source").Value <> "Customer" Then
                    MsgBox("Job Work Schedule is for serials  with 'Customer' material")
                    Return False
                End If
            Next
            Return True
        ElseIf RadioButton_sales.Checked Then
            For Each dr As DataGridViewRow In DGV_OrderDetails.SelectedRows
                If dr.Cells("mtrl_source").Value <> "Magod" Then
                    MsgBox("Sales Schedule is for serials  with 'Magod' material")
                    Return False
                End If
            Next
            Return True

        End If
    End Function
    Private Sub setOrderValue()
        '******* Upadte Order Value as per Current Rates and Qty Entered
        If Orders1.Order_Details.Rows.Count > 0 Then
            OrderRow.OrderValue = Aggregate srl In Orders1.Order_Details Into orderValue = Sum(srl.Qty_Ordered * srl.UnitRate)
        Else
            OrderRow.OrderValue = 0
        End If
    End Sub
    Private Sub createNewSchedule()
        '***** Adds a New Schedule and Details  based on whether Sales Or Jobwork Schedule  is checked
        '*** if Profiles
        Dim SchType As String = ""
        If OrderRow.Type = "Profile" Then
            '*** create a sales/ Jobwork schedule
            If RadioButton_JW_Prod.Checked Then
                SchType = "Job Work"
            ElseIf RadioButton_sales.Checked Then
                SchType = "Sales"
            End If
          
        ElseIf OrderRow.Type = "Service" Then
            SchType = "Service"
        ElseIf OrderRow.Type = "Fabrication" Then
            '*** create a sales/ Jobwork schedule
            If RadioButton_JW_Prod.Checked Then
                SchType = "Job Work"
            ElseIf RadioButton_sales.Checked Then
                SchType = "Sales"
            End If

        End If
        Dim newSch As Magod.Orders.orderscheduleRow = Orders1.orderschedule.NeworderscheduleRow
        With newSch
            .Order_No = OrderNo
            .Cust_Code = OrderRow.Cust_Code
            .Cust_name = OrderRow.Cust_name
            .SalesContact = OrderRow.SalesContact
            .Dealing_Engineer = OrderRow.Dealing_Engineer
            .PO = OrderRow.Purchase_Order
            .ScheduleType = SchType
            .Type = OrderRow.Type
            .Schedule_Status = "Created"
            If OrderRow.Is_Order_RefNull Then
                .Internal = False
            Else
                .Internal = True
            End If

        End With
        With Orders.getCommand
            .CommandText = "INSERT INTO magodmis.orderschedule(Order_No, PO, Cust_Code,ScheduleDate,Delivery_date, " _
                            & "SalesContact, Dealing_Engineer, ScheduleType,Type,Internal) " _
                            & "VALUES (@Order_No, @PO, @Cust_Code,Current_timestamp(), " _
                            & "adddate(curdate(),INTERVAL 2 DAY), @SalesContact, @Dealing_Engineer, @ScheduleType,@Type,@Internal);"
            .Parameters.Clear()
            With .Parameters
                .AddWithValue("@Order_No", newSch.Order_No)
                .AddWithValue("@PO", newSch.PO)
                .AddWithValue("@Cust_Code", newSch.Cust_Code)
                .AddWithValue("@SalesContact", newSch.SalesContact)
                .AddWithValue("@Dealing_Engineer", newSch.Dealing_Engineer)
                .AddWithValue("@ScheduleType", newSch.ScheduleType)
                .AddWithValue("@Type", newSch.Type)
                .AddWithValue("@Internal", newSch.Internal)
            End With
            .Connection.Open()
            .ExecuteNonQuery()
            .CommandText = "SELECT LAST_INSERT_ID();"
            newSch.ScheduleId = .ExecuteScalar
            Orders1.orderschedule.AddorderscheduleRow(newSch)
            newSch.AcceptChanges()
            '****** Adding Details
            .CommandText = "INSERT INTO magodmis.orderscheduledetails(ScheduleId, OrderDetailID,Order_No, " _
            & "Schedule_Srl, Cust_Code, Dwg_Code, DwgName, Mtrl_Code, Operation,MProcess, " _
            & "Mtrl_Source, PackingLevel, InspLevel, QtyScheduled,Tolerance,JWCost,MtrlCost,HasBOM) " _
            & "VALUES(@ScheduleId, @OrderDetailID,@Order_No, " _
            & "@Schedule_Srl, @Cust_Code, @Dwg_Code, @DwgName, @Mtrl_Code, @Operation,@MProcess, " _
            & "@Mtrl_Source, @PackingLevel, @InspLevel, @QtyScheduled,@Tolerance,@JWCost,@MtrlCost,@HasBOM);"

            .Parameters.AddWithValue("@ScheduleId", newSch.ScheduleId)
            With .Parameters
                .Add("@OrderDetailID", MySqlDbType.Int32, 20)
                .Add("@Schedule_Srl", MySqlDbType.Int16)
                .Add("@Dwg_Code", MySqlDbType.VarChar)
                .Add("@DwgName", MySqlDbType.VarChar)
                .Add("@Mtrl_Code", MySqlDbType.VarChar)
                .Add("@Operation", MySqlDbType.VarChar)
                .Add("@MProcess", MySqlDbType.VarChar)
                .Add("@Mtrl_Source", MySqlDbType.VarChar)
                .Add("@PackingLevel", MySqlDbType.VarChar)
                .Add("@InspLevel", MySqlDbType.VarChar)
                .Add("@QtyScheduled", MySqlDbType.Int32)
                .Add("@Tolerance", MySqlDbType.VarChar)
                .Add("@JWCost", MySqlDbType.Decimal, 20)
                .Add("@MtrlCost", MySqlDbType.Decimal, 20)
                .Add("@HasBOM", MySqlDbType.Int16)
            End With

            Dim newSchDetail As Magod.Orders.orderscheduledetailsRow
            Dim Counter As Int16 = 1
            '******* Drawings are a must for Profile Cutting


            For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select("Selected")
                '*** If A Profile Order Dwg is a must for others it not required yet
                '**** Add to schedule details
                If OrderRow.Type = "Service" Or OrderRow.Type = "Fabrication" _
                Or (OrderRow.Type = "Profile" And srl.Dwg) Then

                    newSchDetail = Orders1.orderscheduledetails.NeworderscheduledetailsRow
                    With newSchDetail
                        .Cust_Code = OrderRow.Cust_Code
                        If Not srl.IsDwg_CodeNull Then
                            .Dwg_Code = srl.Dwg_Code
                        Else
                            .Dwg_Code = "NoDwgCode"
                        End If

                        .DwgName = srl.DwgName
                        .InspLevel = srl.InspLevel
                        .JWCost = srl.JWCost
                        .Mtrl_Code = srl.Mtrl_Code
                        .Mtrl_Source = srl.Mtrl_Source
                        .MtrlCost = srl.MtrlCost
                        .Operation = srl.Operation
                        .MProcess = BS_Operation.List(BS_Operation.Find("Operation", .Operation)).item("ProcessId")
                        .OrderDetailID = srl.OrderDetailId
                        .PackingLevel = srl.PackingLevel
                        .QtyScheduled = srl.Qty_Ordered - srl.QtyScheduled
                        .Schedule_Srl = Counter
                        .ScheduleId = newSch.ScheduleId
                        .Tolerance = srl.Tolerance
                        .HasBOM = srl.HasBOM

                    End With
                    Counter += 1


                    .Parameters("@OrderDetailID").Value = newSchDetail.OrderDetailID
                    .Parameters("@Schedule_Srl").Value = newSchDetail.Schedule_Srl
                    .Parameters("@Cust_Code").Value = newSchDetail.Cust_Code
                    .Parameters("@Dwg_Code").Value = newSchDetail.Dwg_Code
                    .Parameters("@DwgName").Value = newSchDetail.DwgName
                    .Parameters("@InspLevel").Value = newSchDetail.InspLevel
                    .Parameters("@JWCost").Value = newSchDetail.JWCost
                    .Parameters("@Mtrl_Code").Value = newSchDetail.Mtrl_Code
                    .Parameters("@Mtrl_Source").Value = newSchDetail.Mtrl_Source
                    .Parameters("@MtrlCost").Value = newSchDetail.MtrlCost
                    .Parameters("@Operation").Value = newSchDetail.Operation
                    .Parameters("@MProcess").Value = newSchDetail.MProcess
                    .Parameters("@OrderDetailID").Value = newSchDetail.OrderDetailID
                    .Parameters("@PackingLevel").Value = newSchDetail.PackingLevel
                    .Parameters("@QtyScheduled").Value = newSchDetail.QtyScheduled
                    .Parameters("@ScheduleId").Value = newSchDetail.ScheduleId
                    .Parameters("@Tolerance").Value = newSchDetail.Tolerance
                    .Parameters("@HasBOM").Value = newSchDetail.HasBOM
                    .ExecuteNonQuery()
                    Orders1.orderscheduledetails.AddorderscheduledetailsRow(newSchDetail)
                    newSchDetail.AcceptChanges()
                Else
                    Dim result As MsgBoxResult = MsgBox(String.Format("{0}.dxf does not exist in Order DXF folder, not being added to Schedule, Continue?", srl.DwgName), MsgBoxStyle.YesNo)
                    If result = MsgBoxResult.No Then
                        newSch.Delete()
                        DA_Schedule.Update(Orders1.orderschedule)
                        Exit For
                    End If

                End If
            Next

            .Connection.Close()
            .Parameters.Clear()
            MsgBox("Draft Schedule Created")

        End With



    End Sub

    Private Function checkdxf(ByVal order_no As String) As Boolean

        Dim fileInfo As IO.FileInfo
        For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
            fileInfo = New IO.FileInfo(OrderFolder & "\DXF\" & srl.DwgName & ".dxf")
            If fileInfo.Exists Then
                srl.Dwg = True
            Else
                srl.Dwg = False
            End If
        Next
        saveorderdetails()
        Dim count As Int16 = Aggregate srl In Orders1.Order_Details Where srl.Dwg = False Into counter = Count(srl.Dwg)
        Return Not count
    End Function

    Private Sub copydxf(ByVal order_no As String)
        '*** requirements
        ' 1 Path to Customer DXF Folder
        ' 2 Path to the Order DXF Folder
        ' 3 For Each Serial Check if the drawing Exists If so Copy to Drawing Folder

        '***** Check if drawings to be imported are selected
        Bs_OrderDetails.EndEdit()
        Dim resultCount = Aggregate srl In Orders1.Order_Details Where srl.Selected Into Count(srl.OrderDetailId)
        If resultCount = 0 Then
            MsgBox("Select Srl for importing Drawings")
            Exit Sub
        End If
        Dim orderpath, custdwgpath As String

        orderpath = OrderFolder + "\DXF\"
        custdwgpath = Orders.getCustDwgPath + "\" + Orders.getCustData(OrderRow.Cust_Code).DwgLoc + "\DXF\"
        If Directory.Exists(custdwgpath) Then
            For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select("Selected=true")

                If File.Exists(custdwgpath & srl.DwgName & ".dxf") Then
                    If File.Exists(orderpath & srl.DwgName & ".dxf") Then
                        Dim result As MsgBoxResult = MsgBox(orderpath & srl.DwgName & ".dxf  already exists. Do you wish to overwrite it?", MsgBoxStyle.YesNoCancel)
                        If result = MsgBoxResult.Yes Then

                        ElseIf result = MsgBoxResult.Cancel Then
                            Exit For
                        End If
                    Else
                        File.Copy(custdwgpath & srl.DwgName & ".dxf", orderpath & srl.DwgName & ".dxf")
                    End If

                End If
            Next
        Else
            MsgBox("Customer Drawing Folder Does not Exist, create it and update  in Cust Information")
        End If



    End Sub


    Private Sub BulkChange()
        ''**** Obtain and set Material
        Bs_OrderDetails.EndEdit()
        Using X As New DefaultPara
            X.ShowDialog()
            If X.IsParOk Then
                For Each orderDetail As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select("Selected")


                    If orderDetail.QtyScheduled = 0 Then
                        With X
                            If .isChangeInsp Then
                                orderDetail.InspLevel = X.InspLevel
                            End If
                            If .isChangeMaterial Then
                                orderDetail.Mtrl_Code = X.MtrlCode
                            End If
                            If .isChangeOperation Then
                                orderDetail.Operation = X.Process
                            End If
                            If .isChangePkng Then
                                orderDetail.PackingLevel = X.PkngLevel
                            End If
                            If .isChangeQty Then
                                orderDetail.Qty_Ordered = X.Quantity
                            End If
                            If .isChangeTolerance Then
                                orderDetail.Tolerance = X.Tollerance
                            End If
                            If .isChangesSource Then
                                orderDetail.Mtrl_Source = X.Source
                            End If

                        End With

                    Else
                        Dim msg As String = String.Format("Connot change Parameters for {0}. It Scheduled for production, Quit all?", orderDetail.DwgName)
                        If MsgBox(msg, MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                            For Each temp As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select("Selected")
                                temp.Selected = False
                            Next
                            Exit For

                        End If
                    End If
                    orderDetail.Selected = False

                Next
            End If
        End Using
    End Sub
    Private Sub btn_DelOrderDetail_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_DelOrderDetail.Click
        delete_orderDeatils()
        saveorderdetails()
    End Sub
    Private Sub delete_orderDeatils()
        If Not OrderRow.Order_Status = "Created" Then
            MsgBox("Can delete details for Order Status 'Created'")
            Exit Sub
        End If
        Dim srcPath As FileInfo
        Bs_OrderDetails.EndEdit()

        For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
            If srl.Selected Then
                srcPath = New FileInfo(OrderFolder & "\DXF\" & srl.DwgName & ".dxf")
                If srcPath.Exists Then
                    srcPath.Delete()
                End If
                srl.Delete()
            End If
        Next


    End Sub

    Private Sub btnSuspend_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSuspend.Click

        '***** Delete any Draft Schedule Existing

        deleteDraftSchedules()
        resetOrderSch()

        '****** Set Schedule Status
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
            If Not (sch.Schedule_Status = "ShortClosed" Or sch.Schedule_Status = "Cancelled" _
                Or sch.Schedule_Status = "Delivered" Or sch.Schedule_Status = "Closed") Then
                sch.Suspend = True
            End If

        Next
        OrderRow.Order_Status = "Suspended"
        saveorder()


    End Sub
    Private Sub btnCancel_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCancel.Click
        '******* To Cancel a Order Do the following
        '***** Condition for Cancelling Order
        '*** 1. All Scedules must be Cancelled

        ' ******* Check If all Items Produced have been dispatched

        '****** Delete all Draft Schedules

        '***** Delete any Draft Schedule Existing


        deleteDraftSchedules()

        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@OrderNo", OrderNo)
            .CommandText = "SELECT count(o.`ScheduleId`)  FROM magodmis.orderschedule o
                WHERE o.`Order_No`=@OrderNo AND  not (o.`Schedule_Status`='Cancelled' or o.`Schedule_Status`='created')"
            .Connection.Open()
            Dim result As Int32 = .ExecuteScalar
            If result > 0 Then '**** implies certain schedules under process
                MsgBox("Cancel all Schedules before attempting to Cancel Order")
                Exit Sub
            End If
            .Connection.Close()
        End With
        '******* if all Schedules are cancelled Ensure qty Scheduled is Zero
        '****** and set Status to Cancelled

        '**** Check Condition for short closing order
        '*** All parts produced/ cleared  must be dispatched
        If OrderRow.Order_Status = "Cancelled" Then
            OrderRow.Order_Status = "Recorded"
            setOrderSrlStatus()
        Else
            For Each detail As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                If detail.QtyScheduled > 0 Then
                    MsgBox("Cancel Schedules before cancelling Order")
                    Exit Sub
                End If
            Next
            OrderRow.Order_Status = "Cancelled"
        End If

        saveorder()

    End Sub
    Private Sub btnShortClose_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnShortClose.Click

        '***** Delete any Draft Schedule Existing


        deleteDraftSchedules()


        If OrderRow.Order_Status = "ShortClosed" Then
            If MsgBox("Do you wish to Reopen the Order", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                OrderRow.Order_Status = "Recorded"
                setOrderSrlStatus()
            End If

        Else
            '**** Check Condition for short closing order
            '*** All parts produced/ cleared  must be dispatched
            If OkToShortClose() Then
                With Orders.getCommand
                    .CommandText = "UPDATE magodmis.order_list o SET o.`Order_Status`='ShortClosed' WHERE o.`Order_No`=@Order_No; "
                    .Parameters.Clear()
                    .Parameters.AddWithValue("@Order_No", OrderRow.Order_No)
                    .Connection.Open()
                    .ExecuteNonQuery()
                    .Connection.Close()
                    OrderRow.Order_Status = "ShortClosed"
                    OrderRow.AcceptChanges()
                    setOrderSrlStatus()
                    MsgBox("Order ShortClosed")
                End With

            End If


        End If

        saveorder()

    End Sub
    Private Function OkToShortClose() As Boolean
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
            Select Case sch.Schedule_Status
                Case "Scheduled"
                    MsgBox(String.Format("Cancel Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Tasked"
                    MsgBox(String.Format("Cancel Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Programmed"
                    MsgBox(String.Format("Cancel Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Production"
                    MsgBox(String.Format("Supend Schedule No {0}  and resolve before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Completed"
                    MsgBox(String.Format("Invoice Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Inspected"
                    MsgBox(String.Format("Invoice Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case "Ready"
                    MsgBox(String.Format("Cancel Schedule No {0} before short closing the order", sch.OrdSchNo))
                    Return False
                Case Else
                    Return True
            End Select
            If sch.Schedule_Status = "Scheduled" Then ' Order cannot be shor closed if any schedules are pending

            ElseIf sch.Schedule_Status = "Tasked" Then ' Order cannot be shor closed if any schedules are pending
                MsgBox(String.Format("Cancel Schedule No {0} before short closing the order", sch.OrdSchNo))
                Return False

            Else
                Return True

            End If
        Next

    End Function

    Private Sub btn_save_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_save.Click
        updaterec()
        update_record = 0
        MsgBox("Record Saved")
        flag = 0
    End Sub
    Private Sub btn_checkdxf_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_checkdxf.Click
        checkdxf(OrderNo)
    End Sub

    Private Sub btnRegister_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnRegister.Click
        Select Case Me.TextBox_OrderType.Text
            Case "Complete"
                If MsgBox("No changes for Quantity, PartName or Rate will be permitted once you register. Proceed?", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
                    Exit Sub
                End If
            Case "Scheduled"
                If MsgBox("You can change only Quantity once you Register a Scheduled Order, Continue?", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
                    Exit Sub
                End If
            Case "Open"
                If MsgBox("You can add new serials, change Quantity and rates once you Register an Open Order, Continue?", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
                    Exit Sub
                End If
        End Select
        Me.TextBox_OrderStatus.Text = "Recorded"
        saveorder()
        setStatusButtons()

    End Sub
    Private Sub btnStatus_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnStatus.Click
        '   updateOrderStatus()

        MsgBox("Status Updated")
    End Sub
    Private Sub Btn_ImportDWG_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_ImportDWG.Click
        If Not (OrderRow.Order_Status = "Created" Or OrderRow.Order_Status = "Recorded") Then
            MsgBox("Cannot import after the Order is recorded")
            Exit Sub
        End If

        Dim fname As String()
        Dim temp As String
        Dim File As IO.FileInfo
        Try
            defaultPara.ShowDialog()


            Using OpenFileDialog1 As New OpenFileDialog
                With OpenFileDialog1

                    .Filter = "DXF files (*.dxf)|*.dxf"
                    .Multiselect = True
                    'setting filters so that Text files and All Files choice appears in the Files of Type box
                    'in the dialog

                    If .ShowDialog() = DialogResult.OK Then
                        fname = .FileNames
                        Dim strFile As IO.FileInfo
                        Dim OrderSrl As magod.Orders.Order_DetailsRow
                        Dim part As magod.dxf.Part
                        'Dim Srl As Integer
                        insertCmd.Connection.Open()
                        Try
                            For i = 0 To fname.Length - 1
                                File = New FileInfo(fname(i))
                                part = getPartInfo(fname(i))
                                strFile = My.Computer.FileSystem.GetFileInfo(fname(i))
                                temp = Microsoft.VisualBasic.Left(strFile.Name, Len(strFile.Name) - Len(strFile.Extension))
                                OrderSrl = Orders1.Order_Details.NewOrder_DetailsRow
                                With OrderSrl
                                    .Order_No = OrderNo
                                    .Order_Srl = order_Srl + 1
                                    .Order_Srl += 1
                                    .Cust_Code = custCode
                                    .Dwg_Code = "NoDwgCode"
                                    .DwgName = temp
                                    .Mtrl_Code = defaultPara.MtrlCode
                                    .Mtrl_Source = defaultPara.Source
                                    .Qty_Ordered = defaultPara.Quantity
                                    .InspLevel = defaultPara.InspLevel
                                    .PackingLevel = defaultPara.PkngLevel
                                    .Tolerance = defaultPara.Tollerance
                                    .Operation = defaultPara.Process
                                    .LOC = Math.Round(part.CuttingLength * 0.001, 2)
                                    .Holes = part.PierceCount

                                    .JWCost = Math.Round(.LOC * defaultPara.CuttingRate _
                                                + .Holes * defaultPara.PierceRate, 0)
                                    .MtrlCost = 0
                                    .delivery_date = DateTimePicker_DelDate.Value.ToString

                                End With
                                insertOrderDetails(insertCmd, OrderSrl)
                                Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                                OrderSrl.AcceptChanges()
                                File.CopyTo(OrderFolder & "\DXF\" & File.Name, True)
                            Next
                        Catch ex As Exception
                            MsgBox(ex.Message)
                        Finally
                            If insertCmd.Connection.State <> ConnectionState.Closed Then
                                insertCmd.Connection.Close()
                            End If

                        End Try

                    End If
                End With
            End Using

            saveorderdetails()

            reloadOrderDetails()
            '    updateOrderStatus()


        Catch es As Exception
            MessageBox.Show(es.Message & "  file dialog")

        End Try
    End Sub
    
    Private Function getPartInfo(ByVal dwgname As String) As magod.dxf.Part
        Dim ncList As New magod.dxf.MagodEntityList
        Dim LOC As Double = 0
        Dim model As WW.Cad.Model.DxfModel = WW.Cad.IO.DxfReader.Read(dwgname)
        '   Console.WriteLine(String.Format(" DxfCount {0}", model.Entities.Count))

        For Each entity As WW.Cad.Model.Entities.DxfEntity In model.Entities
            Select Case entity.AcClass
                Case "AcDbLine"
                    Dim line1 As New Magod.dxf.util.MagodNcEntity(entity, "Line")
                    ncList.Add(line1)

                Case "AcDbArc"
                    Dim line1 As New Magod.dxf.util.MagodNcEntity(entity, "Arc")
                    ncList.Add(line1)

                Case "AcDbCircle"
                    Dim line1 As New Magod.dxf.util.MagodNcEntity(entity, "Circle")
                    ncList.Add(line1)

                Case "AcDbPolyline"
                    Dim Pl1 As New Magod.dxf.util.MagodNcEntity(entity, "Polyline")
                    ncList.Add(Pl1)


            End Select
        Next

        '   Console.WriteLine(String.Format(" MagodNcCount {0}", ncList.Count))
        Return New magod.dxf.Part(ncList)

    End Function
    Private Sub btn_OrderFolder_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_OrderFolder.Click
        Using X As New OpenFileDialog
            X.DefaultExt = ".dxf"
            X.InitialDirectory = OrderFolder & "\DXF"
            X.ShowDialog()
        End Using

    End Sub
    Private Sub btn_importoldorder_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_importoldorder.Click
        '***** Check if any serials exist if so 
        '**they have to be deleated before you can import 


        If OrderRow.Order_Status <> "Created" Then
            MsgBox("Cannot Import Old Order into Orders already Recorded")
            Exit Sub
        End If
        ''**they have to be deleated before you can import 
        If checkSrl() Then

            If MsgBox("There are other serials in this order" & vbCrLf _
                      & "You must delete them to copy an old order, Delete Now?", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                '  Me.DGV_OrderDetails.SelectAll()
                For Each dr As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                    dr.Selected = True
                Next
                delete_orderDeatils()
            Else
                Exit Sub
            End If
        End If

        Using X As New import_oldorder()
            X.CustCode = OrderRow.Cust_Code
            X.Type = OrderRow.Type
            X.ShowDialog()

            If X.isLoadOrder Then
                Try


                    Dim orderTemp As New magod.Orders
                    Dim OrderSrl As magod.Orders.Order_DetailsRow
                    Dim TempOrder As magod.Orders.Order_ListRow
                    ' Dim Srl As Integer
                    With Orders.getCommand
                        .Parameters.Clear()
                        .CommandText = "SELECT * FROM magodmis.order_list o WHERE o.`Order_No`=@Order_No;"
                        .Parameters.AddWithValue("@Order_No", X.order_no)

                        .Connection.Open()
                        orderTemp.Order_List.Load(.ExecuteReader)
                        TempOrder = orderTemp.Order_List.Rows(0)
                        .CommandText = "SELECT * FROM magodmis.order_details o WHERE o.`Order_No`=@Order_No;"
                        orderTemp.Order_Details.Load(.ExecuteReader)
                        .Connection.Close()
                        Dim dxfInfo As IO.FileInfo

                        Try
                            If insertCmd.Connection.State <> ConnectionState.Open Then
                                insertCmd.Connection.Open()
                            End If


                            For Each ordSrl As magod.Orders.Order_DetailsRow In orderTemp.Order_Details.Rows
                                OrderSrl = Orders1.Order_Details.NewOrder_DetailsRow
                                With OrderSrl
                                    .Order_No = OrderNo
                                    .Order_Srl = order_Srl + 1
                                    .Order_Srl += 1
                                    .Cust_Code = OrderRow.Cust_Code
                                    If Not ordSrl.IsDwg_CodeNull Then
                                        .Dwg_Code = ordSrl.Dwg_Code
                                    End If

                                    .DwgName = ordSrl.DwgName
                                    .Mtrl_Code = ordSrl.Mtrl_Code
                                    .Mtrl_Source = ordSrl.Mtrl_Source
                                    .Qty_Ordered = ordSrl.Qty_Ordered
                                    .InspLevel = ordSrl.InspLevel
                                    .PackingLevel = ordSrl.PackingLevel
                                    If Not ordSrl.IsToleranceNull Then
                                        .Tolerance = ordSrl.Tolerance
                                    End If
                                    If Not ordSrl.IsOperationNull Then
                                        .Operation = ordSrl.Operation
                                        Console.WriteLine(String.Format("{0}   {1}", ordSrl.DwgName, ordSrl.Operation))
                                    End If

                                    .JWCost = ordSrl.JWCost
                                    .MtrlCost = ordSrl.MtrlCost
                                    .delivery_date = DateTimePicker_DelDate.Value.ToString
                                End With
                                insertOrderDetails(insertCmd, OrderSrl)
                                Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                                OrderSrl.AcceptChanges()

                                If ordSrl.Dwg Then
                                    '******copy File  to Order Folder
                                    Dim OldOrderPath As String = Orders.getDBLink.getPath("WorkOrder") & "\" & TempOrder.Order_No


                                    Dim dwgName As String = String.Format("{0}\{1}\{2}{3}", OldOrderPath, "DXF", ordSrl.DwgName, ".DXF")
                                    dxfInfo = New IO.FileInfo(dwgName)
                                    If dxfInfo.Exists Then
                                        File.Copy(dwgName, OrderFolder & "\DXF\" & ordSrl.DwgName & ".DXF", True)
                                    Else
                                        MsgBox(dxfInfo.FullName & " does not exist, add it to Order DXF folder")

                                    End If

                                End If

                            Next
                        Catch ex As Exception
                            MsgBox(ex.Message)
                        Finally
                            If insertCmd.Connection.State <> ConnectionState.Closed Then
                                insertCmd.Connection.Close()
                            End If
                        End Try
                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                End Try
            End If
        End Using

        saveorderdetails()
        reloadOrderDetails()
    End Sub
    Private Sub importoldorder(ByVal order_no As String)
        'Dim dr As DataRow()
        'Dim drow As Object
        'Dim cmd As OdbcCommand = Md.getCommand
        'Dim tblOldOrder As New DataTable
        'Dim srcPath, tgtPath As String
        'Dim srcFile As System.IO.FileInfo
        ''****** Get Old Order Details
        'cmd.CommandText = "SELECT * FROM magodmis.order_details where cust_code=? and order_no=?;"
        'cmd.Parameters.Add("@cust_code", MySqlDbType.VarChar).Value = Me.TextBox_Custcode.Text
        'cmd.Parameters.Add("@order_no", MySqlDbType.VarChar).Value = order_no
        'cmd.Connection.Open()
        'tblOldOrder.Load(cmd.ExecuteReader)

        'srcPath = Md.getPath("WorkOrder") & "\" & order_no
        'tgtPath = Md.getPath("WorkOrder") & "\" & OrderNo
        'dr = tblOldOrder.Select
        'For i = 0 To dr.Length - 1

        '    ' drow = Ds.Tables("OrderDetails").NewRow

        '    drow = Bs_OrderDetails.AddNew()
        '    With drow
        '        .Item("Order_Srl") = dr(i).Item("Order_Srl")
        '        .Item("Order_no") = OrderNo
        '        .Item("Cust_Code") = dr(i).Item("Cust_code")
        '        .Item("Dwg_Code") = dr(i).Item("Dwg_code")
        '        .Item("dwgname") = dr(i).Item("dwgname")
        '        .Item("mtrl_code") = dr(i).Item("mtrl_code")
        '        .Item("mtrl") = dr(i).Item("mtrl")
        '        .Item("material") = dr(i).Item("material")
        '        .Item("mprocess") = dr(i).Item("mprocess")
        '        .Item("thickness") = dr(i).Item("thickness")
        '        .Item("rawmtrlshape") = dr(i).Item("rawmtrlshape")
        '        .Item("mtrl_source") = dr(i).Item("mtrl_source")
        '        .Item("qty_ordered") = dr(i).Item("qty_ordered")
        '        .Item("insplevel") = dr(i).Item("insplevel")
        '        .Item("packinglevel") = dr(i).Item("packinglevel")
        '        .Item("delivery_date") = DateTimePicker_DelDate.Value.ToString
        '        .Item("unitprice") = dr(i).Item("unitprice")
        '        .Item("unitwt") = dr(i).Item("unitwt")
        '        .Item("loc") = dr(i).Item("loc")
        '        .Item("part_area") = dr(i).Item("part_area")
        '        .Item("holes") = dr(i).Item("holes")
        '        .Item("JWCost") = dr(i).Item("JWCost")
        '        .Item("MtrlCost") = dr(i).Item("MtrlCost")
        '        .Item("QtyScheduled") = 0
        '        .Item("QtyProduced") = 0
        '        .Item("QtyPacked") = 0
        '        .Item("QtyDelivered") = 0

        '    End With
        '    '*** Copy Drawing if Exists
        '    srcFile = New FileInfo(srcPath & "\DXF\" & drow.item("dwgname") & ".dxf")
        '    If srcFile.Exists Then
        '        srcFile.CopyTo(tgtPath & "\DXF\" & drow.item("dwgname") & ".dxf", True)
        '    End If



        'Next
        'saveorderdetails()
        'reloadOrderDetails()
        'saveorderdetails()
        'Me.DGV_OrderDetails.Refresh()
    End Sub
    Private Sub btn_importxl_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_importxl.Click
        '***** Check if any serials exist if so 
        '**they have to be deleated before you can import 
        If OrderRow.Order_Status <> "Created" Then
            MsgBox("Cannot Import Old Order into Orders already Recorded")
            Exit Sub
        End If
        ''**they have to be deleated before you can import 
        If checkSrl() Then

            If MsgBox("There are other serials in this order" & vbCrLf _
                      & "You must delete them to Import from Excel Sheet, Delete Now?", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                '  Me.DGV_OrderDetails.SelectAll()
                For Each dr As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                    dr.Selected = True
                Next
                delete_orderDeatils()
            Else
                Exit Sub
            End If
        End If



        Try
            Using X As New importExcel(OrderRow.Cust_Code)
                X.ShowDialog()
                If X.isLoadExcel Then
                    Dim OrderSrl As magod.Orders.Order_DetailsRow
                    insertCmd.Connection.Open()
                    For Each srl As DataRow In X.getOrderDeatils.Rows
                        OrderSrl = Orders1.Order_Details.NewOrder_DetailsRow
                        With OrderSrl
                            .Order_No = OrderNo
                            .Order_Srl = order_Srl + 1
                            .Order_Srl += 1
                            .Cust_Code = OrderRow.Cust_Code
                            .DwgName = srl.Item("DwgName")
                            .Mtrl_Code = srl.Item("Mtrl_Code")
                            If srl.Item("Source") = "Magod" Then
                                .Mtrl_Source = "Magod"
                            Else
                                .Mtrl_Source = "Customer"
                            End If

                            .Qty_Ordered = srl.Item("ORDERQTY")
                            .InspLevel = "Insp1"
                            .PackingLevel = "Pkng1"


                            .Operation = srl.Item("Operation")
                            ' End If


                            .JWCost = srl.Item("JWCost")
                            .MtrlCost = srl.Item("MtrlCost")

                            .delivery_date = DateTimePicker_DelDate.Value.ToString
                        End With
                        insertOrderDetails(insertCmd, OrderSrl)
                        Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                        OrderSrl.AcceptChanges()

Skip:
                    Next

                End If
            End Using
        Catch ex As Exception
            MsgBox(ex.Message)
        Finally
            If insertCmd.Connection.State <> ConnectionState.Closed Then
                insertCmd.Connection.Close()
            End If
        End Try
        saveorderdetails()
        reloadOrderDetails()
        setOrderValue()
    End Sub

    Private Sub btn_importqtn_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_importqtn.Click
        If OrderRow.Order_Status <> "Created" Then
            MsgBox("Cannot Import Quote into Orders already Recorded")
            Exit Sub
        End If
        ''**they have to be deleated before you can import 
        If checkSrl() Then

            If MsgBox("There are other serials in this order" & vbCrLf _
                      & "You must delete them to copy an old order, Delete Now?", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then

                For Each dr As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                    dr.Selected = True
                Next
                delete_orderDeatils()
            Else
                Exit Sub
            End If
        End If



        ''***** Check if any serials exist if so 
        QtnData1.Clear()


        Using X As New ImportQtn(OrderRow.Type)
            With X
                .ShowDialog()
                If .LoadQuote Then
                    Dim Quote As magod.QtnData.QtnListRow = X.getQtn
                    If Not Quote Is Nothing Then
                        Select Case OrderRow.Type
                            Case "Service"
                                LoadQtnServiceItems(X.QtnItemsList, Quote)
                            Case "Profile"
                                LoadQtnProfiles(X.QtnProfilesList, Quote)
                            Case "Fabrication"

                        End Select
                    End If

                    'Dim OrderSrl As Magod.Orders.Order_DetailsRow



                End If
            End With
        End Using

        saveorderdetails()
        reloadOrderDetails()
        setOrderValue()


    End Sub
    Private Sub LoadQtnProfiles(ByRef qtnProfiles As magod.QtnData.qtn_profileDetailsDataTable, _
                                ByRef Quote As magod.QtnData.QtnListRow)
        Dim OrderSrl As magod.Orders.Order_DetailsRow
        If insertCmd.Connection.State <> ConnectionState.Open Then
            insertCmd.Connection.Open()
        End If
        Try


            For Each qtnSrl As magod.QtnData.qtn_profileDetailsRow In qtnProfiles
                OrderSrl = Orders1.Order_Details.NewOrder_DetailsRow
                With OrderSrl
                    .Order_No = OrderNo
                    .Order_Srl = order_Srl + 1
                    .Order_Srl += 1
                    .DwgName = qtnSrl.Dwg_Name
                    If Not qtnSrl.IsOperationNull Then
                        .Operation = qtnSrl.Operation
                    End If

                    .Cust_Code = OrderRow.Cust_Code
                    .Mtrl_Code = qtnSrl.mtrl_code
                    If Quote.QtnType = "Sales" Then
                        .Mtrl_Source = "Magod"
                    Else
                        .Mtrl_Source = "Customer"
                    End If
                    .Qty_Ordered = qtnSrl.Qty
                    .InspLevel = qtnSrl.InspLevel
                    .PackingLevel = "Pkng1"
                    .Tolerance = qtnSrl.Tolerance
                    .JWCost = qtnSrl.Unit_JobWork_Cost
                    .MtrlCost = qtnSrl.Unit_Material_cost
                    .delivery_date = DateTimePicker_DelDate.Value.ToString
                End With
                insertOrderDetails(insertCmd, OrderSrl)
                Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                OrderSrl.AcceptChanges()

                If qtnSrl.DwgExists Then
                    '******copy File  to Order Folder
                    Dim qtnPath As String = Orders.getQtnPath

                    Dim FolderName As String = Format(Quote.EnquiryDate, "MMMM") & "\" & Format(Quote.EnquiryDate, "yyyy") _
                        & "_" & Format(Quote.EnquiryDate, "MM") & "_" & Microsoft.VisualBasic.Right(Quote.QtnNo, 3)
                    Dim dwgNamePath As String = String.Format("{0}\{1}\{2}{3}", qtnPath, FolderName, qtnSrl.Dwg_Name, qtnSrl.Pattern)

                    If File.Exists(dwgNamePath) Then
                        File.Copy(dwgNamePath, OrderFolder & "\DXF\" & qtnSrl.Dwg_Name & ".DXF", True)
                    Else
                        MsgBox(String.Format("{0} does not exist", dwgNamePath))
                    End If

                End If

            Next
        Catch ex As Exception
            MsgBox(ex.Message)
            If Not insertCmd.Connection.State = ConnectionState.Closed Then
                insertCmd.Connection.Close()
            End If
        End Try
    End Sub

    Private Sub LoadQtnServiceItems(ByRef qtnItems As magod.QtnData.qtn_itemslistDataTable, _
                                ByRef Quote As magod.QtnData.QtnListRow)
        Dim OrderSrl As magod.Orders.Order_DetailsRow
        If insertCmd.Connection.State <> ConnectionState.Open Then
            insertCmd.Connection.Open()
        End If
        Try


            For Each qtnSrl As magod.QtnData.qtn_itemslistRow In qtnItems
                OrderSrl = Orders1.Order_Details.NewOrder_DetailsRow
                With OrderSrl
                    .Order_No = OrderNo
                    .Order_Srl = order_Srl + 1
                    .Order_Srl += 1
                    .DwgName = qtnSrl.Name
                    If Not qtnSrl.IsOperationNull Then
                        .Operation = qtnSrl.Operation
                    End If

                    .Cust_Code = OrderRow.Cust_Code
                    If Not qtnSrl.IsMaterialNull Then
                        .Mtrl_Code = qtnSrl.Material
                    End If

                    If Quote.QtnType = "Sales" Then
                        .Mtrl_Source = "Magod"
                    Else
                        .Mtrl_Source = "Customer"
                    End If
                    .Qty_Ordered = qtnSrl.Quantity
                    '.InspLevel = qtnSrl.InspLeve
                    .PackingLevel = "Pkng1"
                    ' .Tolerance = qtnSrl.Toleranc
                    .JWCost = qtnSrl.FinalPrice
                    '.MtrlCost = qtnSrl.Unit_Material_cost
                    .delivery_date = DateTimePicker_DelDate.Value.ToString
                End With
                insertOrderDetails(insertCmd, OrderSrl)
                Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                OrderSrl.AcceptChanges()
            Next
        Catch ex As Exception
            MsgBox(ex.Message)
        Finally

            If insertCmd.Connection.State <> ConnectionState.Closed Then
                insertCmd.Connection.Close()
            End If
        End Try

    End Sub
    Private Function checkSrl() As Boolean
        saveorderdetails()
        If Orders1.Order_Details.Rows.Count > 0 Then
            Return True
        Else
            Return False
        End If


    End Function
    Private Sub updaterec()
        saveorder()
        saveorderdetails()

    End Sub

    Private Sub saveorder()
        Try
            bs_Order.EndEdit()
            Da_order.Update(Orders1.Order_List)

            'BS_Schedule.EndEdit()
            'DA_Schedule.Update(DS_Form.Tables("OrderScheduleList"))


        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub insertOrderDetails(ByRef cmd As MySql.Data.MySqlClient.MySqlCommand, ByRef detail As magod.Orders.Order_DetailsRow)
        With cmd

            .Parameters("@order_srl").Value = detail.Order_Srl
            .Parameters("@dwgname").Value = detail.DwgName
            If detail.IsDwg_CodeNull Then
                .Parameters("@Dwg_Code").Value = Nothing
            Else
                .Parameters("@Dwg_Code").Value = detail.Dwg_Code
            End If

            .Parameters("@mtrl_code").Value = detail.Mtrl_Code
            .Parameters("@operation").Value = detail.Operation
            .Parameters("@mtrl_source").Value = detail.Mtrl_Source
            .Parameters("@qty_ordered").Value = detail.Qty_Ordered
            .Parameters("@insplevel").Value = detail.InspLevel
            .Parameters("@packinglevel").Value = detail.PackingLevel
            .Parameters("@delivery_date").Value = detail.delivery_date
            .Parameters("@JWCost").Value = detail.JWCost
            .Parameters("@MtrlCost").Value = detail.MtrlCost
            .Parameters("@Dwg").Value = detail.Dwg
            .Parameters("@HasBOM").Value = detail.HasBOM
            .Parameters("@Tolerance").Value = detail.Tolerance
            .Parameters("@LOC").Value = detail.LOC
            .Parameters("@Holes").Value = detail.Holes

            .CommandText = cmdOrderDetailsInsert
            .ExecuteNonQuery()

            '**** get InsertID
            .CommandText = "SELECT last_insert_id();"
            detail.OrderDetailId = .ExecuteScalar


        End With
    End Sub
    Private Sub saveorderdetails()
        Try
            Dim srl As Int16 = 1
            Bs_OrderDetails.EndEdit()
            '***** First Insert New Order Details
            '***** Then Upadte Quaery
            '**** Then Delete Querry
            '**** Update Serial
            DA_OrderDetails.Update(Orders1.Order_Details)
            For Each detail As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                detail.Order_No = OrderNo
                detail.Order_Srl = srl
                srl += 1
            Next

            DA_OrderDetails.Update(Orders1.Order_Details)
            setOrderValue()
        Catch ex As Exception
            MsgBox(ex.Message & "Save order details")
        End Try
    End Sub

    Private Sub Form_Order_FormClosing(ByVal sender As Object, ByVal e As System.Windows.Forms.FormClosingEventArgs) Handles Me.FormClosing
        Dim i As Integer
        If update_record = 1 Then
            i = MsgBox("Do u want to save the changes ?", MsgBoxStyle.YesNo)
            If i = MsgBoxResult.Yes Then
                updaterec()
            End If
        End If


        Me.Btn_draw.Enabled = False
        Me.btnSaveDwg.Enabled = False


    End Sub


    'Private Function next_order_serial() As Integer
    '    Dim Srl As Integer = 0
    '    ' Bs_OrderDetails.MoveFirst()
    '    If Bs_OrderDetails.List.Count > 0 Then
    '        For Each x As Object In Bs_OrderDetails.List
    '            If Not IsDBNull(x.item("Order_srl")) Then
    '                If CType(x.item("Order_srl"), System.Int64) > Srl Then
    '                    Srl = CType(x.item("Order_srl"), System.Int64)
    '                End If
    '            End If
    '        Next
    '    End If

    '    Srl = Srl + 1
    '    Return Srl
    'End Function


#End Region

#Region "Profarma"



    '*** DGV Profarma

    Private Sub btnProfaram_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnProfaram.Click
        Bs_OrderDetails.EndEdit()

        If Not Orders1.Order_Details.Compute("Count([OrderDetailId])", "Selected") > 0 Then
            Exit Sub
        End If
        For Each detail As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select("Selected")
            If Not detail.Qty_Ordered > 0 Then
                MsgBox("Ensure Quantity is entered correctly")
                Exit Sub
            ElseIf Not detail.JWCost > 0 Then
                MsgBox("Ensure JW Cost is entered correctly")
                Exit Sub
            ElseIf UCase(detail.Mtrl_Source) = "MAGOD" And Not detail.MtrlCost > 0 Then
                MsgBox("Ensure Material Cost is entered correctly")
                Exit Sub
            End If

        Next
        PkngandInvoice1.profarmadetails.Clear()
        For Each inv As magod.PkngandInvoice.profarma_mainRow In PkngandInvoice1.profarma_main.Rows
            If inv.Status = "Draft" Then
                inv.Delete()
            End If
        Next
        DA_ProFarma.Update(PkngandInvoice1.profarma_main)
        Dim invTypes = From type In Orders1.Order_Details _
                       Where type.Selected = True _
                       Group By InvType = type.Mtrl_Source _
                       Into srl = Group

        Dim cust As magod.BasicDS.Cust_dataRow = Orders.getCustData(OrderRow.Cust_Code)

        For Each invtype In invTypes
            ' MsgBox(invtype.InvType)
            Dim newProforma As magod.PkngandInvoice.profarma_mainRow
            newProforma = PkngandInvoice1.profarma_main.Newprofarma_mainRow()
            With newProforma
                .Cust_Code = OrderRow.Cust_Code
                .Cust_Name = OrderRow.Cust_name
                If Not cust.IsAddressNull Then
                    .Cust_Address = cust.Address
                End If
                If Not cust.IsCityNull Then
                    .Cust_Place = cust.City
                End If
                If Not cust.IsStateNull Then
                    .Cust_State = cust.State
                End If
                If Not cust.IsStateIdNull Then
                    .Cust_StateId = cust.StateId
                Else
                    MsgBox("Enter State of Customer")
                    Exit Sub
                End If

                If Not cust.IsPin_CodeNull Then
                    .PIN_Code = cust.Pin_Code
                End If
                If Not cust.IsGSTNoNull Then
                    .GSTNo = cust.GSTNo
                Else
                    If MsgBox("GST No Missing. Do you wish to add in Cust Data", vbYesNo) = vbYes Then
                        Exit Sub
                    Else
                        .GSTNo = "Unregistered"
                    End If
                End If


                    .Status = "Draft"
                .PO_No = OrderRow.Purchase_Order
                .OrderNo = OrderRow.Order_No
                .OrderDate = OrderRow.Order_Date
            End With
            If invtype.InvType = "Magod" Then
                newProforma.InvType = "Sales"
            Else
                newProforma.InvType = "Job Work"
            End If
            If insertProforma(newProforma) Then
                PkngandInvoice1.profarma_main.Addprofarma_mainRow(newProforma)
                newProforma.AcceptChanges()
            End If


        Next
        PkngandInvoice1.profarmadetails.Clear()
        DA_ProfarmaDetails.Fill(PkngandInvoice1.profarmadetails)

    End Sub

    Private Sub btn_DelProfarma_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_DelProfarma.Click
        'If Me.DGV_ProFarma.SelectedRows.Count = 0 Then
        '    MsgBox("Select Draft Profarma to Delete")
        'Else

        '    For Each dr As DataGridViewRow In DGV_ProFarma.SelectedRows
        '        '*** delete cells marked as 'Draft'
        '        If dr.Cells("Status").Value = "Draft" Then
        '            DGV_ProFarma.Rows.Remove(dr)
        '        End If
        '    Next
        '    resetProfarma()
        'End If
    End Sub
    Private Sub resetProfarma()
        'DA_ProFarma.Update(DS_Form.Tables("Order_ProfaramInvoiceList"))
        'DS_Form.Tables("Order_Profaram_Invoice_Parts_List").Clear()
        'DS_Form.Tables("Order_ProfaramInvoiceList").Clear()
        'DA_ProFarma.Fill(DS_Form, "Order_ProfaramInvoiceList")
        'DA_ProfarmaDetails.Fill(DS_Form, "Order_Profaram_Invoice_Parts_List")
    End Sub
    Private Function insertProforma(ByRef newProforma As magod.PkngandInvoice.profarma_mainRow) As Boolean
        With Orders.getCommand
            .CommandText = "INSERT INTO magodmis.profarma_main (InvType, OrderNo, OrderDate, Cust_Code, " _
            & "Cust_Name, Cust_Address, Cust_Place, Cust_State, Cust_StateId,PIN_Code,`Status`,GSTNo, PO_No) " _
            & "VALUES (@InvType, @OrderNo, @OrderDate, @Cust_Code, @Cust_Name, @Cust_Address, @Cust_Place, " _
            & "@Cust_State,@Cust_StateId, @PIN_Code,@Status,@GSTNo,@PO_No)"
            With .Parameters
                .Clear()
                .AddWithValue("@InvType", newProforma.InvType)
                .AddWithValue("@OrderNo", newProforma.OrderNo)
                .AddWithValue("@OrderDate", newProforma.OrderDate)
                .AddWithValue("@Cust_Code", newProforma.Cust_Code)
                .AddWithValue("@Cust_Name", newProforma.Cust_Name)
                If newProforma.IsCust_AddressNull Then
                    .AddWithValue("@Cust_Address", Nothing)
                Else
                    .AddWithValue("@Cust_Address", newProforma.Cust_Address)
                End If
                If newProforma.IsCust_PlaceNull Then
                    .AddWithValue("@Cust_Place", Nothing)
                Else
                    .AddWithValue("@Cust_Place", newProforma.Cust_Place)
                End If
                If newProforma.IsCust_StateNull Then
                    .AddWithValue("@Cust_State", Nothing)
                Else
                    .AddWithValue("@Cust_State", newProforma.Cust_State)
                End If
                If newProforma.IsCust_StateIdNull Then
                    .AddWithValue("@Cust_StateId", Nothing)
                Else
                    .AddWithValue("@Cust_StateId", newProforma.Cust_StateId)
                End If
                If newProforma.IsPIN_CodeNull Then
                    .AddWithValue("@PIN_Code", Nothing)
                Else
                    .AddWithValue("@PIN_Code", newProforma.PIN_Code)
                End If
                If newProforma.IsECC_NoNull Then
                    .AddWithValue("@GSTNo", Nothing)
                Else
                    .AddWithValue("@GSTNo", newProforma.GSTNo)
                End If

                If newProforma.IsPO_NoNull Then
                    .AddWithValue("@PO_No", Nothing)
                Else
                    .AddWithValue("@PO_No", newProforma.PO_No)
                End If

                .AddWithValue("@Status", newProforma.Status)



            End With
            .Connection.Open()
            .ExecuteNonQuery()
            .CommandText = "SELECT LAST_INSERT_ID();"
            newProforma.ProfarmaID = .ExecuteScalar
            Dim filt As String = String.Format("Selected AND Mtrl_Source='{0}'", IIf(newProforma.InvType = "Sales", "Magod", "Customer"))
            .CommandText = "INSERT INTO magodmis.profarmadetails(ProfarmaID, ProFarmaSrl, Dwg_No, Mtrl, Qty, Unit_Rate,Excise_CL_no) " _
                            & "VALUES(@ProfarmaID, @ProFarmaSrl, @Dwg_No, @Mtrl, @Qty, @Unit_Rate,@Excise_CL_no);"
            Dim Srl As Int16 = 1
            With .Parameters
                .AddWithValue("@ProfarmaID", newProforma.ProfarmaID)
                .Add("@ProFarmaSrl", MySqlDbType.VarChar)
                .Add("@Dwg_No", MySqlDbType.VarChar)
                .Add("@Mtrl", MySqlDbType.VarChar)
                .Add("@Excise_CL_no", MySqlDbType.VarChar)
                .Add("@Qty", MySqlDbType.Decimal)
                .Add("@Unit_Rate", MySqlDbType.Decimal)

            End With

            For Each detail As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Select(filt)
                .Parameters("@ProFarmaSrl").Value = Srl
                Srl += 1
                .Parameters("@Dwg_No").Value = detail.DwgName
                .Parameters("@Mtrl").Value = detail.Mtrl_Code
                .Parameters("@Excise_CL_no").Value = Orders.getExCl(detail.Mtrl_Code)
                .Parameters("@Dwg_No").Value = detail.DwgName
                .Parameters("@Qty").Value = detail.Qty_Ordered
                .Parameters("@Unit_Rate").Value = detail.UnitRate
                .ExecuteNonQuery()

            Next
            .Connection.Close()
            Return True
        End With
        Return False
    End Function


    Private Sub createProfarma(ByVal SalesCount As Integer, ByVal JWCount As Integer, ByVal ServiceCount As Integer)
        '' *** Create Profarma Invoice

        'Dim dr1() As DataRow
        ''dr1 = BasicDS.Tables("Custdata").Select("Cust_code='" & custCode & "'")
        'dr1 = BasicDS.getCustlist.Copy.Select("Cust_code='" & custCode & "'")

        ''**** If Salescount/JWcount >1 then Insert using procedure and get autoID
        ''**** Using auto ID and Serials Insert Details
        'Dim cmd As OdbcCommand = Md.getCommand
        'Dim cmd1 As OdbcCommand = Md.getCommand
        'Try


        '    Dim rdr As OdbcDataReader
        '    Dim ProId, ProSrl As Integer
        '    With cmd
        '        .CommandText = "Call insert_profarmaInvoice(?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
        '        With .Parameters
        '            .Add("@invType", MySqlDbType.VarChar, 15)
        '            .Add("@OrderNo", MySqlDbType.VarChar).Value = Me.TextBox_OrderNo.Text
        '            .Add("@Cust_Code", MySqlDbType.VarChar).Value = dr1(0).Item("Cust_code")
        '            .Add("@Cust_Name", MySqlDbType.VarChar).Value = dr1(0).Item("Cust_Name")
        '            .Add("@Cust_Address", MySqlDbType.VarChar).Value = IIf(IsDBNull(dr1(0).Item("Branch")), _
        '                                                               dr1(0).Item("Address"), _
        '                                                               "Branch :" & dr1(0).Item("Branch") _
        '                                                               & vbCrLf & dr1(0).Item("Address"))
        '            .Add("@Cust_Place", MySqlDbType.VarChar).Value = dr1(0).Item("City")
        '            .Add("@Cust_State", MySqlDbType.VarChar).Value = dr1(0).Item("State")
        '            .Add("@PIN_Code", MySqlDbType.VarChar).Value = dr1(0).Item("Pin_Code")
        '            .Add("@ECC_No", MySqlDbType.VarChar).Value = dr1(0).Item("ECC_No")
        '            .Add("@TIN_No", MySqlDbType.VarChar).Value = dr1(0).Item("TIN_No")
        '            .Add("@Po_No", MySqlDbType.VarChar).Value = Me.TextBox_PO.Text
        '            .Add("@OrderDate", MySqlDbType.Date).Value = DS_Form.Tables("Order").Rows(0).Item("Order_Date")
        '            .Add("@Status", MySqlDbType.VarChar).Value = "Draft"
        '            .Add("@DelAddress", MySqlDbType.VarChar).Value = Me.TextBox_Delivery.Text
        '            cmd.Connection.Open()
        '            '**** Set Details ParaMeters
        '            With cmd1
        '                .Connection.Open()
        '                .CommandText = "INSERT INTO Magodmis.ProfarmaDetails " _
        '                               & "(ProfarmaID,ProfarmaSrl,Dwg_No,Mtrl,Qty," _
        '                               & "Unit_Rate,Dc_Srl_Amt) " _
        '                               & "Values(?,?,?,?,?,?,?);"
        '                With .Parameters
        '                    .Add("@ProfarmaID", MySqlDbType.Int32)
        '                    .Add("@ProfarmaSrl", MySqlDbType.Int32)
        '                    .Add("@Dwg_No", MySqlDbType.VarChar)
        '                    .Add("@Mtrl", MySqlDbType.VarChar)
        '                    .Add("@Qty", MySqlDbType.Int32)
        '                    .Add("@Unit_Rate", MySqlDbType.Double)
        '                    .Add("@Dc_Srl_Amt", MySqlDbType.Double)
        '                    '.Add("@Excise_Cl_No", MySqlDbType.VarChar)
        '                    '.Add("@SrlType", MySqlDbType.VarChar)
        '                End With
        '            End With

        '            If SalesCount > 0 Then
        '                '**** Create Sales Invoice
        '                ProSrl = 1
        '                cmd.Parameters("@InvType").Value = "Sales"
        '                rdr = cmd.ExecuteReader
        '                If rdr.HasRows Then
        '                    rdr.Read()
        '                    MsgBox(MsgBox("Sales Invoice Created"))
        '                    ProId = rdr.Item("ProfarmaID")
        '                End If
        '                rdr.Close()
        '                '**** Add Details for Sales Invoice
        '                For Each dr As DataGridViewRow In DGV_OrderDetails.SelectedRows
        '                    If Not dr.IsNewRow And dr.Cells("Mtrl_Source").Value = "Magod" And dr.Cells("Service").Value = 0 Then
        '                        With cmd1
        '                            .Parameters("@ProfarmaID").Value = ProId
        '                            .Parameters("@ProfarmaSrl").Value = ProSrl
        '                            .Parameters("@Dwg_No").Value = dr.Cells("dwg").Value
        '                            .Parameters("@Mtrl").Value = dr.Cells("mtrl_code").Value
        '                            .Parameters("@Qty").Value = dr.Cells("Qty").Value
        '                            .Parameters("@Unit_Rate").Value = dr.Cells("jwcost").Value + dr.Cells("MtrlCost").Value
        '                            .Parameters("@DC_SRL_Amt").Value = dr.Cells("Total").Value
        '                            '.Parameters("@Excise_Cl_No").Value = ProId
        '                            '.Parameters("@SrlType").Value = ProId
        '                            .ExecuteNonQuery()
        '                        End With
        '                        ProSrl += 1
        '                    End If
        '                Next
        '            End If
        '            If JWCount > 0 Then
        '                '**** Create JW Invoice
        '                ProSrl = 1
        '                cmd.Parameters("@InvType").Value = "Job Work"

        '                rdr = cmd.ExecuteReader
        '                If rdr.HasRows Then
        '                    rdr.Read()
        '                    MsgBox("Job Work Invoice Created")
        '                    ProId = rdr.Item("ProfarmaID")
        '                End If
        '                rdr.Close()
        '                '**** Add Details For Job Work

        '                For Each dr As DataGridViewRow In DGV_OrderDetails.SelectedRows
        '                    If Not dr.IsNewRow And dr.Cells("Mtrl_Source").Value = "Customer" And dr.Cells("Service").Value = 0 Then
        '                        With cmd1
        '                            .Parameters("@ProfarmaID").Value = ProId
        '                            .Parameters("@ProfarmaSrl").Value = ProSrl
        '                            .Parameters("@Dwg_No").Value = dr.Cells("dwg").Value
        '                            .Parameters("@Mtrl").Value = dr.Cells("mtrl_code").Value
        '                            .Parameters("@Qty").Value = dr.Cells("Qty").Value
        '                            .Parameters("@Unit_Rate").Value = dr.Cells("jwcost").Value
        '                            .Parameters("@DC_SRL_Amt").Value = dr.Cells("Total").Value
        '                            '.Parameters("@Excise_Cl_No").Value = ProId
        '                            '.Parameters("@SrlType").Value = ProId
        '                            .ExecuteNonQuery()
        '                        End With
        '                        ProSrl += 1
        '                    End If
        '                Next
        '            End If

        '            If ServiceCount > 0 Then
        '                '**** Create Service
        '                ProSrl = 1
        '                cmd.Parameters("@InvType").Value = "Service"

        '                rdr = cmd.ExecuteReader
        '                If rdr.HasRows Then
        '                    rdr.Read()
        '                    MsgBox("Service Invoice Created")
        '                    ProId = rdr.Item("ProfarmaID")
        '                End If
        '                rdr.Close()
        '                '**** Add Details For Job Work

        '                For Each dr As DataGridViewRow In DGV_OrderDetails.SelectedRows
        '                    If Not dr.IsNewRow And dr.Cells("Mtrl_Source").Value = "Customer" And dr.Cells("Service").Value <> 0 Then
        '                        With cmd1
        '                            .Parameters("@ProfarmaID").Value = ProId
        '                            .Parameters("@ProfarmaSrl").Value = ProSrl
        '                            .Parameters("@Dwg_No").Value = dr.Cells("dwg").Value
        '                            .Parameters("@Mtrl").Value = dr.Cells("mtrl_code").Value
        '                            .Parameters("@Qty").Value = dr.Cells("Qty").Value
        '                            .Parameters("@Unit_Rate").Value = dr.Cells("jwcost").Value
        '                            .Parameters("@DC_SRL_Amt").Value = dr.Cells("Total").Value
        '                            '.Parameters("@Excise_Cl_No").Value = ProId
        '                            '.Parameters("@SrlType").Value = ProId
        '                            .ExecuteNonQuery()
        '                        End With
        '                        ProSrl += 1
        '                    End If
        '                Next
        '            End If


        '        End With
        '    End With


        '    ' DA_ProFarma.Update(Ds.Tables("Profarma"))
        '    ' MsgBox(Ds.Tables("Profarma").Rows(0).Item("ProfarmaID"))
        'Catch ex As Exception
        '    MsgBox(ex.Message)
        'Finally
        '    If cmd1.Connection.State <> ConnectionState.Closed Then
        '        cmd1.Connection.Close()
        '    End If
        '    If cmd.Connection.State <> ConnectionState.Closed Then
        '        cmd.Connection.Close()
        '    End If

        'End Try
    End Sub
    Private Sub btnOpen_profarma_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnOpen_profarma.Click

        Using proFarmaInvoice As New ProfarmaInvoice(Me.DGV_ProFarma.CurrentRow.Cells("ProfarmaID").Value)

            proFarmaInvoice.ShowDialog()
            PkngandInvoice1.profarmadetails.Clear()
            PkngandInvoice1.profarma_main.Clear()
            DA_ProFarma.Fill(PkngandInvoice1.profarma_main)
            DA_ProfarmaDetails.Fill(PkngandInvoice1.profarmadetails)
        End Using





    End Sub
#End Region

#Region "Schedule Creation and Handling"
    Private Sub btnDelSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnDelSchedule.Click
        If Me.DGV_SchList.SelectedRows.Count = 0 Then
            MsgBox("Select Draft Schedules to Delete")
        Else
            Try
                For Each dr As DataGridViewRow In DGV_SchList.SelectedRows
                    '*** Only Schedule that are not yet scheduled 
                    'Or for which mtrl indent not palced or whoes indent is cancelled
                    ' can be deleted
                    If IsDBNull(dr.Cells("ScheduleNo").Value) Then
                        DGV_SchList.Rows.Remove(dr)
                    End If

                    BS_Schedule.EndEdit()
                    DA_Schedule.Update(Orders1.orderschedule)


                Next
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try


        End If

    End Sub
    Private Sub btn_OpenSch_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_OpenSch.Click

        If Not Me.DGV_SchList.CurrentRow.IsNewRow Then
            Using X As New Schedule(Me.DGV_SchList.CurrentRow.Cells("ScheduleId").Value)

                X.ShowDialog()
                resetOrderSch()
            End Using
            'If Not schLoaded Then
            '    Schedule = New Schedule(Me.DGV_SchList.CurrentRow.Cells("Schid").Value, BasicDS)
            '    Schedule.setSchedule = Me.DGV_SchList.CurrentRow.Cells("Schid").Value

            '    schLoaded = True
            'Else
            '    Schedule.setSchedule = Me.DGV_SchList.CurrentRow.Cells("Schid").Value

            'End If
            'Schedule.ShowDialog()

        End If

    End Sub
    Private Sub resetOrderSch()
        '*** update changes
        If Not Me.DGV_SchList.CurrentRow Is Nothing Then
            Dim intSchId As Int32 = Me.DGV_SchList.CurrentRow.Cells("ScheduleId").Value
            Me.Cursor = Cursors.WaitCursor
            Orders1.orderscheduledetails.Clear()
            Orders1.orderschedule.Clear()

            Orders1.Order_Details.Clear()
            DA_OrderDetails.Fill(Orders1.Order_Details)
            DA_Schedule.Fill(Orders1.orderschedule)
            ' DA_SchDetails.Fill(Orders1.orderscheduledetails)
            BS_Schedule.Position = BS_Schedule.Find("ScheduleId", intSchId)

            'updateOrderStatus()
            Me.Cursor = Cursors.Default
        End If


    End Sub

    Private Sub btnScheduler_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnScheduler.Click
        Bs_OrderDetails.EndEdit()
        Dim newTable As DataTable = Orders1.Order_Details.GetChanges(DataRowState.Added)
        If Not newTable Is Nothing AndAlso newTable.Rows.Count > 0 Then
            MsgBox("Order Details Not Saved. Save and Try Again")
            Exit Sub
        End If
        newTable = Orders1.Order_Details.GetChanges(DataRowState.Deleted)
        If Not newTable Is Nothing AndAlso newTable.Rows.Count > 0 Then
            MsgBox("Order Details Not Saved. Save and Try Again")
            Exit Sub
        End If
        newTable = Orders1.Order_Details.GetChanges(DataRowState.Modified)
        If Not newTable Is Nothing AndAlso newTable.Rows.Count > 0 Then
            MsgBox("Order Details Not Saved. Save and Try Again")
            Exit Sub
        End If


        If OrderRow.Type = "Profile" Then
            checkdxf(OrderRow.Order_No)
            '***** Do Not allow to proceed without drawings for scheduling

        End If



        If Me.RadioButton_partial.Checked Then
            Dim Count As Integer = Orders1.Order_Details.Compute("Count([OrderDetailId])", "Selected")
            If Count = 0 Then
                MsgBox("Select Parts to add to Schedule")
                Exit Sub
            Else
                Dim mtrlSource As String
                If RadioButton_JW_Prod.Checked Then
                    mtrlSource = "CUSTOMER"
                Else
                    mtrlSource = "MAGOD"
                End If
                Dim filter As String = String.Format("Selected AND mtrl_source='{0}'", mtrlSource)
                Count = Orders1.Order_Details.Compute("Count([OrderDetailId])", filter)
                If Count = 0 Then
                    MsgBox(String.Format("Select Parts with material source {0} to add to Schedule", mtrlSource))
                    Exit Sub
                End If
                If RadioButton_JW_Prod.Checked Then
                    mtrlSource = "MAGOD"
                Else
                    mtrlSource = "CUSTOMER"
                End If
                filter = String.Format("Selected AND mtrl_source='{0}'", mtrlSource)
                Count = Orders1.Order_Details.Compute("Count([OrderDetailId])", filter)
                If Count > 0 Then
                    MsgBox(String.Format("Parts with material source {0} cannot be added to this Schedule", mtrlSource))
                    Exit Sub
                End If

            End If
        Else
            For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                If RadioButton_JW_Prod.Checked Then
                    If UCase(srl.Mtrl_Source) = "CUSTOMER" Then
                        srl.Selected = True
                    Else
                        srl.Selected = False

                    End If
                Else
                    If UCase(srl.Mtrl_Source) = "MAGOD" Then
                        srl.Selected = True
                    Else
                        srl.Selected = False

                    End If
                End If
            Next
        End If

        '***** UnSelect Items already Scheduled fully
        For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
            If Not srl.Qty_Ordered > srl.QtyScheduled Then
                srl.Selected = False
            ElseIf srl.Operation = "Undefined" Then
                MsgBox("Define Operation for " & srl.DwgName)
                srl.Selected = False
            End If
        Next

        '***** Unselect if DXF Not Found

        ''*****2. Create New Schedule
        Dim Counter As Integer = Orders1.Order_Details.Compute("Count([OrderDetailId])", "Selected")
        If Counter > 0 Then

            createNewSchedule()
        Else
            MsgBox("You do not have any schedualble serial")
            Exit Sub
        End If



        Me.DGV_SchList.Focus()

    End Sub
    Private Sub deleteDraftSchedules()
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
            If sch.ScheduleNo.Length = 0 Then
                sch.Delete()
            End If
        Next
        DA_Schedule.Update(Orders1.orderschedule)
    End Sub

#End Region

    '***** Button Controls




#Region "*** Processing Order and details status"

    Private Sub updateOrderStatus()
        '  setOrderSrlStatus()
        'setOrderStatus()

    End Sub
    Private Sub setOrderSrlStatus()
        Dim IntSchStatus As Integer
        If Orders1.Order_Details.Rows.Count > 0 Then

            For Each srl As magod.Orders.Order_DetailsRow In Orders1.Order_Details.Rows
                With srl
                    If .Qty_Ordered = 0 Then
                        '**** No Order
                        .SrlStatus = 0
                    ElseIf .QtyDelivered >= .Qty_Ordered Then
                        '**** Fully Delivered
                        .SrlStatus = 8
                    ElseIf .QtyDelivered > 0 And .QtyPacked >= .Qty_Ordered Then
                        '**** Partially Delivered
                        .SrlStatus = 7
                    ElseIf .QtyPacked >= .Qty_Ordered Then
                        '**** Fully Packed
                        .SrlStatus = 6
                    ElseIf .QtyPacked > 0 And .QtyProduced >= .Qty_Ordered Then
                        '**** Partially Produced
                        .SrlStatus = 5
                    ElseIf .QtyProduced >= .Qty_Ordered Then
                        '**** Fully Produced
                        .SrlStatus = 4
                    ElseIf .QtyProduced > 0 And .QtyScheduled >= .Qty_Ordered Then
                        '**** Partially Produced
                        .SrlStatus = 5
                    ElseIf .QtyScheduled >= .Qty_Ordered Then
                        '**** Fully Scheduled
                        .SrlStatus = 3
                    ElseIf .QtyScheduled > 0 Then
                        '**** Partially Scheduled
                        .SrlStatus = 2
                    Else
                        '**** Totally Unscheduled

                        .SrlStatus = 1

                    End If
                End With


            Next
            IntSchStatus = Orders1.Order_Details.Compute("Min(SrlStatus)", Nothing)
        Else
            IntSchStatus = 0
        End If


        Dim Status As String
        ' IntSchStatus = DS_Form.Tables("Order_PartsList").Compute("Min(SrlStatus1)", Nothing)
        'MsgBox("Status " & IntSchStatus)
        Select Case IntSchStatus
            Case Is = 8
                Status = "Dispatched"
            Case Is = 7
                Status = "Packed"
            Case Is = 6
                Status = "Packed"
            Case Is = 5
                Status = "Produced"
            Case Is = 4
                Status = "Produced"
            Case Is = 3
                Status = "Processing"
            Case Is = 2
                Status = "Recorded"
            Case Is = 1
                Status = "Recorded"
            Case Is = 0
                Status = "Recorded"
            Case Else
                Status = "Confused"
        End Select

        'MsgBox("Status " & Status)
        If Not (bs_Order.Current.item("Order_status") = "Created" _
          Or bs_Order.Current.item("Order_status") = "Cancelled" _
          Or bs_Order.Current.item("Order_status") = "Supended" _
          Or bs_Order.Current.item("Order_status") = "Closed" _
          Or bs_Order.Current.item("Order_status") = "ShortClosed" _
          Or InStr(bs_Order.Current.item("Order_status"), "Comb") <> 0) Then

            'MsgBox("Status " & Status)
            bs_Order.Current.item("Order_status") = Status
            bs_Order.EndEdit()
            saveorder()
            setStatusButtons()
            setDetailsColour()
            'saveSchedule()
        End If
    End Sub

    Private Sub setDetailsColour()
        For Each DR As DataGridViewRow In DGV_OrderDetails.Rows
            If Not DR.IsNewRow Then
                Select Case DR.Cells("SrlStatus").Value
                    Case Is = 0
                        DR.DefaultCellStyle.BackColor = Color.Lavender
                    Case Is = 1
                        DR.DefaultCellStyle.BackColor = Color.LightBlue
                    Case Is = 2
                        DR.DefaultCellStyle.BackColor = Color.LightCoral
                    Case Is = 3
                        DR.DefaultCellStyle.BackColor = Color.LightYellow
                    Case Is = 4
                        DR.DefaultCellStyle.BackColor = Color.Yellow
                    Case Is = 5
                        DR.DefaultCellStyle.BackColor = Color.GreenYellow
                    Case Is = 6
                        DR.DefaultCellStyle.BackColor = Color.LightGreen
                    Case Is = 7
                        DR.DefaultCellStyle.BackColor = Color.Orange
                    Case Is = 8
                        DR.DefaultCellStyle.BackColor = Color.LightGreen
                    Case Is = 9
                        DR.DefaultCellStyle.BackColor = Color.OliveDrab
                    Case Is = 10
                        DR.DefaultCellStyle.BackColor = Color.Green
                    Case Else

                End Select
            End If
        Next
    End Sub
    Private Sub setOrderStatus(Optional ByVal reset As Boolean = False)
        Dim X As Integer = 0
        Dim strStatus As String = ""
        Dim intDel, intPack, intProduced, intCreated, intSch, intPartSch, IntPartProd, intPartPack, intpartDel As Integer

        If Not (bs_Order.Current.item("Order_Status") = "Created" _
                Or bs_Order.Current.item("Order_Status") = "Cancelled" _
               Or bs_Order.Current.item("Order_Status") = "ShortClosed" _
                 Or bs_Order.Current.item("Order_Status") = "Closed" _
               Or bs_Order.Current.item("Order_Status") = "Suspended") _
               Or reset Then

            Try


                '**** Segregate the Colour
                For Each dgrv As DataGridViewRow In Me.DGV_OrderDetails.Rows
                    If Not (dgrv.IsNewRow) Then

                        X = X + 1 ' count of rowns
                        Select Case dgrv.DefaultCellStyle.BackColor
                            Case Color.Lavender
                                intCreated = intCreated + 1
                            Case Color.Orange
                                intProduced = intProduced + 1
                            Case Color.Lime
                                intPack = intPack + 1
                            Case Color.Green
                                intDel = intDel + 1
                            Case Color.IndianRed
                                intPartSch = intPartSch + 1
                            Case Color.Coral
                                intSch = intSch + 1
                            Case Color.Yellow
                                IntPartProd = IntPartProd + 1
                            Case Color.LightGreen
                                intPartPack = intPartPack + 1
                            Case Color.LimeGreen
                                intpartDel = intpartDel + 1

                            Case Else

                        End Select
                    End If
                Next
                If X = 0 Then
                    Exit Sub
                End If
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try


            '**** Examine and allot status
            If intDel = X Then
                strStatus = "Dispatched"
                '  MsgBox("Delivered")
            ElseIf intPack = X Then
                strStatus = "Packed"
                ' MsgBox("Packed")
            ElseIf intProduced = X Then
                strStatus = "Completed"
                '  MsgBox("Completed")
            ElseIf intCreated = X Then ' because no part has been scheduled
                strStatus = "Recorded"
                '  MsgBox("Recorded")
            ElseIf intCreated > 0 Or intSch > 0 Or intPartSch > 0 Then
                strStatus = "Processing"
                '  MsgBox("Processing") ' all parts have only been scheduled           
            ElseIf IntPartProd > 0 Or intProduced > 0 Then
                strStatus = "Processing"
                ' MsgBox("Processing") ' because some parts are still being produced
            ElseIf intPartPack > 0 Then
                strStatus = "Completed"
                ' MsgBox("Completed") ' because there are no parts to schedule or produce
            ElseIf intpartDel > 0 Then
                strStatus = "Packed"
                ' MsgBox("Packed")

            Else
                strStatus = "Confused"
                '  MsgBox("Confused")
            End If
            If Not bs_Order.Current.item("Order_Status") = strStatus Then
                bs_Order.Current.item("Order_Status") = strStatus
                saveorder()
            End If



        End If
        setStatusButtons()
    End Sub
    Private Sub setStatusButtons()
        Me.cmbDelMode.Enabled = False
        Me.cmbTptCharge.Enabled = False
        Me.TextBox_Delivery.Enabled = False
        Me.TextBox_Delivery.ReadOnly = True
        'If OrderRow.Type = "Profile" Then
        '    TabControl_DwgDetails.SelectedTab = TabPageDrawing
        'Else
        '    TabControl_DwgDetails.SelectedTab = TabPageDetails
        'End If
        Select Case bs_Order.Current.item("Order_Status")
            Case "Recorded"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = True
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = True
                Me.cmb_dealingeng.Enabled = True
                Me.btnScheduler.Enabled = True
                Me.GroupBox_AddSrl.Visible = True
                '*** permit all changes to order details
                setOrderDetails("Created")

            Case "Created"
                Me.btnRegister.Enabled = True
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = True
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = True
                Me.cmb_dealingeng.Enabled = True
                Me.btnScheduler.Enabled = False
                Me.GroupBox_AddSrl.Visible = True
                If OrderRow.Delivery Then
                    Me.cmbDelMode.Enabled = True
                    Me.cmbTptCharge.Enabled = True
                    Me.TextBox_Delivery.Enabled = True
                    Me.TextBox_Delivery.ReadOnly = False
                Else
                    Me.cmbDelMode.Enabled = False
                    Me.cmbTptCharge.Enabled = False
                    Me.TextBox_Delivery.Enabled = False
                    Me.TextBox_Delivery.ReadOnly = True
                End If
                '*** permit all changes to order details
                setOrderDetails("Created")
            Case "Processing"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = True
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = True
                Me.DateTimePicker_DelDate.Enabled = True
                Me.cmb_dealingeng.Enabled = True
                Me.btnScheduler.Enabled = True
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = True
                '*** permit to add if Open Order
                '*** permit to Change Qty if Scheduled Order
                setOrderDetails("Processing")
            Case "Closed"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = False
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "Cancelled"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = False
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "Suspended"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = True
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = False
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "ShortClosed"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = True
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = False
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "Dispatched"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = False
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "Packed"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = False
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = True
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
            Case "Produced"
                Me.btnRegister.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
                Me.btnShortClose.Enabled = True
                Me.DateTimePicker_DelDate.Enabled = False
                Me.cmb_dealingeng.Enabled = False
                Me.btnScheduler.Enabled = False
                Me.Btn_draw.Enabled = False
                Me.btnProfaram.Enabled = True
                '**** Permit No Changes to order Details
                setOrderDetails("Nochange")
        End Select
    End Sub

    Private Sub setOrderDetails(ByVal setDetails As String)
        '*** Sets the order details that can be edited based on order type and order status
        Select Case setDetails
            Case "Created"
                Me.GroupBox_OrderDetails.Enabled = True
                Me.DGV_OrderDetails.Enabled = True
                Me.btn_BulkChange.Enabled = True

                Me.GroupBox_AddSrl.Visible = True
                ' *** can change quantity only

                Me.DGV_OrderDetails.Columns("Dwg").ReadOnly = True

                Me.DGV_OrderDetails.Columns("Operation").ReadOnly = False
                Me.DGV_OrderDetails.Columns("QtyOrdered").ReadOnly = False
                Me.DGV_OrderDetails.Columns("JWCost").ReadOnly = False
                Me.DGV_OrderDetails.Columns("MtrlCost").ReadOnly = False
                Me.GroupBox_OrderDetails.Enabled = True
                Me.GroupBox_AddSrl.Visible = True
                Me.btn_AddSrl.Visible = True
            Case "Processing"

                Me.btn_BulkChange.Enabled = False
                Select Case Me.TextBox_OrderType.Text
                    Case "Complete"
                        Me.DGV_OrderDetails.Enabled = True
                        ' Me.DGV_OrderDetails.Enabled = True
                        Me.DGV_OrderDetails.Columns("Dwg").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlSource").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlCode").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("Operation").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("QtyOrdered").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("JWCost").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlCost").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("InspLevel").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("PackingLevel").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("Tolerance").ReadOnly = True

                        ' Me.DGV_OrderDetails.AllowUserToAddRows = False
                        '  Me.GroupBox_OrderDetails.Enabled = False
                        Me.GroupBox_AddSrl.Visible = False
                        Me.btn_AddSrl.Visible = False
                    Case "Scheduled"
                        ' *** can change quantity only
                        Me.DGV_OrderDetails.Enabled = True
                        Me.DGV_OrderDetails.Columns("Dwg").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlSource").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlCode").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("Operation").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("QtyOrdered").ReadOnly = False
                        Me.DGV_OrderDetails.Columns("JWCost").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("MtrlCost").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("InspLevel").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("PackingLevel").ReadOnly = True
                        Me.DGV_OrderDetails.Columns("Tolerance").ReadOnly = True
                        Me.DGV_OrderDetails.AllowUserToAddRows = False
                        '   Me.GroupBox_OrderDetails.Enabled = False
                        Me.GroupBox_AddSrl.Visible = False
                        Me.btn_AddSrl.Visible = False

                    Case "Open"
                        ' *** can change quantity only
                        Me.DGV_OrderDetails.Enabled = True
                        'Me.DGV_OrderDetails.Columns("Dwg").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("MtrlSource").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("MtrlCode").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("Operation").ReadOnly = False
                        Me.DGV_OrderDetails.Columns("QtyOrdered").ReadOnly = False
                        Me.DGV_OrderDetails.Columns("JWCost").ReadOnly = False
                        Me.DGV_OrderDetails.Columns("MtrlCost").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("InspLevel").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("PackingLevel").ReadOnly = False
                        'Me.DGV_OrderDetails.Columns("Tolerance").ReadOnly = False
                        ' Me.DGV_OrderDetails.AllowUserToAddRows = True
                        ' Me.GroupBox_OrderDetails.Enabled = False
                        Me.GroupBox_AddSrl.Visible = True
                        Me.btn_AddSrl.Visible = True
                End Select
            Case "Nochange"
                ' Me.GroupBox_OrderDetails.Visible = False
                Me.DGV_OrderDetails.Enabled = True
                Me.DGV_OrderDetails.Columns("Dwg").ReadOnly = True
                Me.DGV_OrderDetails.Columns("MtrlSource").ReadOnly = True
                Me.DGV_OrderDetails.Columns("MtrlCode").ReadOnly = True
                Me.DGV_OrderDetails.Columns("Operation").ReadOnly = True
                Me.DGV_OrderDetails.Columns("QtyOrdered").ReadOnly = False
                Me.DGV_OrderDetails.Columns("JWCost").ReadOnly = True
                Me.DGV_OrderDetails.Columns("MtrlCost").ReadOnly = True
                Me.DGV_OrderDetails.Columns("InspLevel").ReadOnly = True
                Me.DGV_OrderDetails.Columns("PackingLevel").ReadOnly = True
                Me.DGV_OrderDetails.Columns("Tolerance").ReadOnly = True
                'Me.DGV_OrderDetails.ReadOnly = True

                ' Me.DGV_OrderDetails.AllowUserToAddRows = False
                Me.btn_BulkChange.Visible = False
                Me.GroupBox_OrderDetails.Enabled = False
                ' Me.GroupBox_AddSrl.Visible = False
                Select Case Me.TextBox_OrderType.Text
                    Case "Complete"
                    Case "Scheduled"
                    Case "Open"
                End Select
        End Select
    End Sub
    Private Sub setDetailsOpen()
        '**** all details are open to edit, add or change
        Me.GroupBox_OrderDetails.Enabled = True
    End Sub
    Private Sub insert_DwgDetails_intoCustDwgData()
        If Not OrderRow.Type.Equals("Profile") Then
            MsgBox("This is for Profiles Only, For Service/ Fabrication use Customer Info > Part List")
            Exit Sub
        End If

        With Orders.getCommand
            .CommandText = "SELECT Count(*) FROM magodmis.cust_assy_data c WHERE c.`Cust_Code`=@Cust_Code AND c.`AssyCust_PartId`=@AssyCust_PartId;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@Cust_Code", OrderRow.Cust_Code)
            .Parameters.AddWithValue("@AssyCust_PartId", Bs_OrderDetails.Current.item("DwgName"))
            .Connection.Open()
            Dim counter As Int16 = .ExecuteScalar
            .Connection.Close()
            If counter > 0 Then
                MsgBox("Assembly of the same name Exists for the Customer in Customer Assemby List, either change the name or delete it from Customer Assembly")
                Exit Sub

            End If
        End With

        '**** First Check if Drawing Of same Name exists in the DwgData
        Dim result As Integer = -100
        result = BS_custDwg.Find("DwgName", Bs_OrderDetails.Current.item("DwgName"))
        Try
            If result <> -1 Then
                If MsgBox(Bs_OrderDetails.Current.item("DwgName") & " already exists in the Customer Drawings " _
                        & vbCrLf & " Do you wish to alter other Information as per current Order Serial", _
                        MsgBoxStyle.YesNo) = MsgBoxResult.No Then
                    Exit Sub
                End If
                BS_custDwg.Position = result

                With BS_custDwg.Current
                    .Item("Mtrl_Code") = Bs_OrderDetails.Current.item("Mtrl_Code")
                    .Item("DxfLoc") = bs_Order.Current.item("DwgLoc")
                    .Item("MProcess") = Bs_OrderDetails.Current.item("MProcess")
                    .Item("Operation") = Bs_OrderDetails.Current.item("Operation")
                    .Item("MtrlCost") = Bs_OrderDetails.Current.item("MtrlCost")
                    .Item("JobWorkCost") = Bs_OrderDetails.Current.item("JWCost")
                    BS_custDwg.EndEdit()
                    MsgBox(Bs_OrderDetails.Current.item("DwgName") & " data updated to Customer Drawings")
                End With

            Else
                '  Dim obj As Object
                Dim nextSrl As Integer
                If Not Orders1.dwg_data.Rows.Count = 0 Then
                    nextSrl = Orders1.dwg_data.Compute("Max(codeSrl)", "")
                End If
                nextSrl += 1
                Dim newDwg As magod.Orders.dwg_dataRow = Orders1.dwg_data.Newdwg_dataRow
                With newDwg
                    .Dwg_Code = OrderRow.Cust_Code & Microsoft.VisualBasic.Right("0000" & nextSrl, 4)
                    .Cust_Code = OrderRow.Cust_Code
                    .DwgName = Bs_OrderDetails.Current.item("DwgName")
                    .Mtrl_Code = Bs_OrderDetails.Current.item("Mtrl_Code")
                    .DxfLoc = bs_Order.Current.item("DwgLoc")
                    .MProcess = Bs_OrderDetails.Current.item("MProcess")
                    .Operation = Bs_OrderDetails.Current.item("Operation")
                    .MtrlCost = Bs_OrderDetails.Current.item("MtrlCost")
                    .JobWorkCost = Bs_OrderDetails.Current.item("JWCost")
                    .codeSrl = nextSrl
                End With
                Orders1.dwg_data.Adddwg_dataRow(newDwg)

            End If

            DA_custDwg.Update(Orders1.dwg_data)

        Catch ex As Exception
            MsgBox(ex.Message)
        End Try


        '**** Update or add drwaing as the case may be
    End Sub
    Private Sub RadioButton_full_CheckedChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles RadioButton_full.CheckedChanged, RadioButton2.CheckedChanged
        If Me.RadioButton_full.Checked And FormOK Then
            MsgBox("All serials will be included in the Schedule", MsgBoxStyle.OkOnly, "Complete Schedule")
        End If

    End Sub

    Private Sub RadioButton_partial_CheckedChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles RadioButton_partial.CheckedChanged, RadioButton1.CheckedChanged
        If Me.RadioButton_partial.Checked And FormOK Then
            MsgBox("Only Selected serials will be included in the Schedule", MsgBoxStyle.OkOnly, "Partial Schedule")
        End If

    End Sub

    Private Sub RadioButton_sales_CheckedChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles RadioButton_sales.CheckedChanged, RadioButton4.CheckedChanged

        If FormOK Then
            Bs_OrderDetails.Filter = "Mtrl_source='Magod' Or Mtrl_source='magod' "
        End If


    End Sub

    Private Sub RadioButton_JW_Prod_CheckedChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles RadioButton_JW_Prod.CheckedChanged, RadioButton5.CheckedChanged
        If FormOK Then
            Bs_OrderDetails.Filter = "(Mtrl_source='Customer' Or Mtrl_source='customer') "
        End If


    End Sub

    Private Sub RadioButton_JW_service_CheckedChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles RadioButton3.CheckedChanged
        If FormOK Then
            Bs_OrderDetails.Filter = "Service<>0"
        End If
    End Sub


    Private Sub btn_ClearSchFilter_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_ClearSchFilter.Click
        Bs_OrderDetails.RemoveFilter()
    End Sub


#End Region

#Region " Cust Dwgg Import save etc"



    Private Sub Btn_draw_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_draw.Click

        '***** Adds the Current selected Drawing from customer data to Order
        '  Dim Srl As Integer = next_order_serial()

        Dim OrderSrl As magod.Orders.Order_DetailsRow = Orders1.Order_Details.NewOrder_DetailsRow
        With OrderSrl
            .Order_No = OrderRow.Order_No
            .Order_Srl = order_Srl + 1
            .Order_Srl += 1
            .Cust_Code = OrderRow.Cust_Code
            .Dwg_Code = BS_custDwg.Current.item("Dwg_Code")
            .DwgName = BS_custDwg.Current.item("DwgName")
            .Mtrl_Code = BS_custDwg.Current.item("Mtrl_Code")
            .Mtrl_Source = "Customer"
            .Qty_Ordered = defaultPara.Quantity
            .InspLevel = defaultPara.InspLevel
            .PackingLevel = defaultPara.PkngLevel
            .Tolerance = defaultPara.Tollerance
            .JWCost = BS_custDwg.Current.item("JobWorkCost")
            .MtrlCost = BS_custDwg.Current.item("MtrlCost")
            .delivery_date = DateTimePicker_DelDate.Value.ToString
            .Operation = BS_custDwg.Current.item("MProcess")
            .HasBOM = BS_custDwg.Current.item("HasBOM")
        End With
        With Orders.getCommand
            .CommandText = "Insert Into magodmis.order_details(order_no,order_srl ,cust_code,dwgname ,Dwg_Code, " _
                         & "mtrl_code , operation, mtrl_source, qty_ordered, insplevel , " _
                         & "packinglevel, delivery_date, JwCost,mtrlcost,Dwg,Tolerance,HasBOM) " _
                         & "values (@order_no,@order_srl ,@cust_code,@dwgname ,@Dwg_Code, " _
                         & "@mtrl_code , @operation, @mtrl_source, @qty_ordered, @insplevel , " _
                         & "@packinglevel, @delivery_date, @JwCost,@mtrlcost,@Dwg,@Tolerance,@HasBOM); "
            With .Parameters
                .Clear()
                .AddWithValue("@order_no", OrderSrl.Order_No)
                .AddWithValue("@order_srl", OrderSrl.Order_Srl)
                .AddWithValue("@cust_code", OrderSrl.Cust_Code)
                .AddWithValue("@dwgname", OrderSrl.DwgName)
                .AddWithValue("@Dwg_Code", OrderSrl.Dwg_Code)
                .AddWithValue("@mtrl_code", OrderSrl.Mtrl_Code)
                .AddWithValue("@operation", OrderSrl.Operation)
                .AddWithValue("@mtrl_source", OrderSrl.Mtrl_Source)
                .AddWithValue("@qty_ordered", OrderSrl.Qty_Ordered)
                .AddWithValue("@insplevel", OrderSrl.InspLevel)
                .AddWithValue("@packinglevel", OrderSrl.PackingLevel)
                .AddWithValue("@delivery_date", OrderSrl.delivery_date)
                .AddWithValue("@JWCost", OrderSrl.JWCost)
                .AddWithValue("@MtrlCost", OrderSrl.MtrlCost)
                .AddWithValue("@Dwg", OrderSrl.Dwg)
                .AddWithValue("@HasBOM", OrderSrl.HasBOM)
                .AddWithValue("@Tolerance", OrderSrl.Tolerance)

            End With
            .Connection.Open()
            .ExecuteNonQuery()
            .CommandText = "SELECT LAST_INSERT_ID();"
            OrderSrl.OrderDetailId = .ExecuteScalar
            .Connection.Close()
        End With
        Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
        OrderSrl.AcceptChanges()

        Bs_OrderDetails.MoveLast()


    End Sub


    Private Sub Order_Shown(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Shown
        ' bs_Order.MoveFirst()
        ' updateOrderStatus()
    End Sub


    Private Sub btnSaveDwg_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSaveDwg.Click
        insert_DwgDetails_intoCustDwgData()
    End Sub


    Private Sub Btn_copydxf_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles Btn_copydxf.Click
        '*** requirements
        ' 1 Path to Customer DXF Folder
        ' 2 Path to the Order DXF Folder
        ' 3 For Each Serial Check if the drawing Exists If so Copy to Drawing Folder
        copydxf(OrderNo)
    End Sub


    Private Sub cmb_dwgname_Validated(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_dwgname.Validated
        'MsgBox(cmb_dwgname.SelectedValue)
        Dim result As Integer = BS_custDwg.Find("Dwg_Code", cmb_dwgname.SelectedValue)
        Dim selectedDwg As magod.Orders.dwg_dataRow = Orders1.dwg_data.FindByDwg_Code(cmb_dwgname.SelectedValue)


        If Not selectedDwg Is Nothing Then
            With selectedDwg
                Me.TextBox_LoadMtrlCode.Text = .Mtrl_Code
                If .IsMProcessNull Then
                    .MProcess = "Undefined"
                    Me.TextBox_loadMprocess.Text = "Undefined"
                Else
                    Me.TextBox_loadMprocess.Text = .MProcess
                End If

                Me.TextBox_LoadJWRate.Text = .JobWorkCost
                Me.TextBox_LoadMtrlCost.Text = .MtrlCost
                Me.TextBox_LoadPierces.Text = .Holes
                Me.TextBox_LoadLoc.Text = .LOC
                Me.TextBox_loadPartWt.Text = .Part_Wt
                Me.CB_HasBOM.Checked = .HasBOM

            End With
        End If
        'If Not result = -1 Then
        '    BS_custDwg.Position = result
        '    With BS_custDwg.Current
        '        Console.WriteLine(.item("Dwgname"))
        '        Me.TextBox_LoadMtrlCode.Text = .item("mtrl_Code")
        '        Me.TextBox_loadMprocess.Text = .item("Mprocess")
        '        Me.TextBox_LoadJWRate.Text = .item("JobWorkCost")
        '        Me.TextBox_LoadMtrlCost.Text = .item("MtrlCost")
        '        Me.TextBox_LoadPierces.Text = .item("Holes")
        '        Me.TextBox_LoadLoc.Text = .item("Loc")
        '        Me.TextBox_loadPartWt.Text = .item("Part_Wt")

        '    End With
        'End If


        'With BS_custDwg.Current
        '    Console.WriteLine(.item("Dwgname"))
        'End With
    End Sub
#End Region

    Private Sub CheckBox_Del_Validated(ByVal sender As Object, ByVal e As System.EventArgs) Handles CheckBox_Del.Validated
        bs_Order.EndEdit()
        setDeliveryData()

    End Sub
    Private Sub setDeliveryData()
        If OrderRow.Delivery = True Then
            TextBox_Delivery.Enabled = True
            TextBox_Delivery.ReadOnly = False
            cmbDelMode.Enabled = True
            cmbTptCharge.Enabled = True
            TextBox_Delivery.Focus()

            OrderRow.Del_Place = "At Billing Address "

        Else


            OrderRow.Del_Place = "Ex Factory"
            TextBox_Delivery.Enabled = False
            TextBox_Delivery.ReadOnly = True
            cmbDelMode.Enabled = False
            cmbTptCharge.Enabled = False
            OrderRow.Del_Mode = ""
            OrderRow.TptCharges = ""

        End If
    End Sub

    Private Sub DateTimePicker_DelDate_Validated(ByVal sender As Object, ByVal e As System.EventArgs) Handles DateTimePicker_DelDate.Validated
        If Me.DateTimePicker_DelDate.Value < OrderRow.Order_Date Then
            MsgBox("Delivery date cannot be less than order Date")
            Me.DateTimePicker_DelDate.Value = OrderRow.Order_Date
            saveorder()
        End If
    End Sub


    Private Sub btn_BulkChange_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_BulkChange.Click
        deleteDraftSchedules()
        resetOrderSch()
        ''**** Obtain and set Material


        BulkChange()

        DA_OrderDetails.Update(Orders1.Order_Details)

    End Sub

    Private Sub btn_SelectAll_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_SelectAll.Click
        For Each dr As DataGridViewRow In DGV_OrderDetails.Rows
            dr.Cells("Selected").Value = True

        Next
    End Sub

    Private Sub btn_Reverse_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Reverse.Click
        For Each dr As DataGridViewRow In DGV_OrderDetails.Rows
            dr.Cells("Selected").Value = Not dr.Cells("Selected").Value

        Next
    End Sub

    Private Sub DGV_SchList_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles DGV_SchList.Click
        If Not BS_Schedule.List.Count = 0 Then
            DA_SchDetails.SelectCommand.Parameters("@ScheduleId").Value = BS_Schedule.Current.item("ScheduleId")
            Orders1.orderscheduledetails.Clear()
            DA_SchDetails.Fill(Orders1.orderscheduledetails)
        End If
        ' MsgBox(BS_Schedule.Current.item("OrdSchNo"))
    End Sub

    Private Sub DGV_SchList_RowEnter(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_SchList.RowEnter
        'MsgBox(BS_Schedule.Current.item("OrdSchNo"))
    End Sub

    Private Sub Bs_OrderDetails_CurrentChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Bs_OrderDetails.CurrentChanged
        If Not (Bs_OrderDetails Is Nothing) Then
            If Not Bs_OrderDetails.Current Is Nothing Then
                If Bs_OrderDetails.Current.item("QtyScheduled") > 0 Then
                    '***** do not allow changes
                    Me.txt_Drawing_name.Enabled = False
                    Me.cmb_material.Enabled = False
                    Me.cmb_materialsource.Enabled = False
                    Me.cmb_insplevel.Enabled = False
                    Me.cmb_process.Enabled = False
                Else
                    '***** do not allow changes
                    Me.txt_Drawing_name.Enabled = True
                    Me.cmb_material.Enabled = True
                    Me.cmb_materialsource.Enabled = True
                    Me.cmb_insplevel.Enabled = True
                    Me.cmb_process.Enabled = True
                End If
            End If

        End If
    End Sub

    Private Sub TextBox_PartName_TextChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TextBox_PartName.TextChanged
        If tblOrderDetails.Rows.Count = 0 Then
            '**** Fill drawings
            With Orders.getCommand
                .Parameters.Clear()
                .CommandText = "SELECT o.`DwgName`, o.`Mtrl_Code`, o.`Operation`, " _
                & "o.`tolerance`, o.`Mtrl_Source`, o.`Order_No`, o.`OrderDetailId` " _
                & "FROM magodmis.order_details o WHERE o.`Cust_Code`=@Cust_Code;"
                .Parameters.AddWithValue("@Cust_Code", OrderRow.Cust_Code)
                .Connection.Open()
                tblOrderDetails.Load(.ExecuteReader)
                .Connection.Close()
                .Parameters.Clear()
            End With
        End If
        Dim filter As String = String.Format("DwgName like '{0}%'", Me.TextBox_PartName.Text)
        Bs_PartsList.Filter = filter
    End Sub

    Private Sub btn_LoadStock_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_LoadStock.Click
        MaterialDS1.mtrlstocklist.Clear()
        With Orders.getCommand
            .Parameters.Clear()
            If Not CB_Magod.Checked Then
                .CommandText = " SELECT MtrlStockID, count( m.`MtrlStockID`) as inStock, m.`Mtrl_Code`, " _
                                & "m.`DynamicPara1`, m.`DynamicPara2`, m.`Locked`, m.`Scrap` " _
                                & "FROM magodmis.mtrlstocklist m " _
                                & "WHERE m.`Cust_Code`=@Cust_Code " _
                                & "GROUP BY m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, " _
                                & " m.`Scrap`, m.`Locked` ORDER BY   m.`Locked` DESC,m.`Scrap` DESC; "
            Else
                .CommandText = " SELECT MtrlStockID, count( m.`MtrlStockID`) as inStock, m.`Mtrl_Code`, " _
                                & "m.`DynamicPara1`, m.`DynamicPara2`, m.`Locked`, m.`Scrap` " _
                                & "FROM magodmis.mtrlstocklist m " _
                                & "WHERE m.`Cust_Code`='0000' " _
                                & "GROUP BY m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, " _
                                & " m.`Scrap`, m.`Locked` ORDER BY   m.`Locked` DESC ,m.`Scrap` DESC; "
            End If
            .Parameters.Clear()
            .Parameters.AddWithValue("@Cust_Code", OrderRow.Cust_Code)
            .Connection.Open()
            MaterialDS1.mtrlstocklist.Load(.ExecuteReader)
            .Connection.Close()
            .Parameters.Clear()
        End With
    End Sub

    Private Sub btnDXFWS_Click(sender As Object, e As EventArgs) Handles btnDXFWS.Click
        '**** Create Tasks for all Order Details
        If createTempTask() Then
            AddHandler MS.SigmaError, AddressOf OnSigmaError
            If setupMagodsigma() Then

                MS.CreateAndReadWS()
                setTempTaskPara()
            End If
            RemoveHandler MS.SigmaError, AddressOf OnSigmaError

        End If

    End Sub

    Private Sub OnSigmaError(ByVal msg As String)
        MsgBox(msg)
    End Sub
    Private Sub set_sigmanestPath()
        Try

            'If Qtn.SnExecutablePath Is Nothing Then
            '    MsgBox("SigmaNest Settings  do not exit. Reset Path in SetUp File")
            '    Using X As New magod.Form_ServerAndSigma
            '        X.ShowDialog()
            '        Qtn.getDBLink.reloadSetUp()
            '    End Using
            '    Exit Sub
            'End If

            MS.SnConfigPath = Orders.SnConfigPath



        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub
    Private Function createTempTask() As Boolean
        '**** Check if all drawings exist
        If Not checkdxf(OrderRow.Order_No) Then
            MsgBox("Ensure Drawings for all serials exists")
            Return False
        End If
        ''***** clear Temp Details
        Try
            Orders2.Clear()
            '**** Select Parts for Whic the Material is to Calculated
            '**** Create Tasks of Selected Rows
            '**** Add Parts To Tasks
            '***** create WS
            '***** Read WS
            Dim ordSch As magod.Orders.orderscheduleRow
            With Orders2
                ordSch = Orders2.orderschedule.NewRow
                With ordSch
                    .Cust_Code = OrderRow.Cust_Code
                    .Order_No = OrderRow.Order_No
                    .ScheduleId = 1
                    .OrdSchNo = String.Format("{0} 00", OrderRow.Order_No)
                    .Delivery_Date = OrderRow.Delivery_Date
                End With
                .orderschedule.Rows.Add(ordSch)
                ordSch.AcceptChanges()

                For Each row As magod.Orders.Order_DetailsRow In Orders1.Order_Details
                    Dim schDetails = .orderscheduledetails.NeworderscheduledetailsRow
                    With schDetails
                        .ScheduleId = ordSch.ScheduleId
                        .Cust_Code = ordSch.Cust_Code
                        .DwgName = row.DwgName
                        .Operation = row.Operation
                        .Mtrl_Code = row.Mtrl_Code
                        .Mtrl_Source = row.Mtrl_Source
                        .MProcess = BS_Operation.List(BS_Operation.Find("Operation", .Operation)).item("ProcessId")
                        .OrderScheduleNo = ordSch.OrdSchNo
                        .QtyScheduled = row.Qty_Ordered
                        .ScheduleNo = "00"
                        .Tolerance = row.Tolerance
                        .Delivery_Date = row.delivery_date
                    End With

                    .orderscheduledetails.AddorderscheduledetailsRow(schDetails)

                Next

            End With
            Dim tasks = (From part In Orders2.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
            Dim TaskNo As Int16 = 1
            Dim strTaskNo As String

            For Each task In tasks
                strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, task.Mtrl_Code, task.Mtrl_Source, task.MProcess, task.Operation))

                Dim newTask As magod.Orders.nc_task_listRow = Orders2.nc_task_list.Newnc_task_listRow

                newTask.ScheduleID = ordSch.ScheduleId
                newTask.Cust_code = ordSch.Cust_Code
                newTask.order_No = ordSch.Order_No
                If ordSch.IsOrdSchNoNull Then
                    newTask.ScheduleNo = ordSch.Order_No & " 00"
                Else
                    newTask.ScheduleNo = ordSch.OrdSchNo
                End If
                'newTask.ScheduleNo = schRow.OrdSchNo
                newTask.DeliveryDate = ordSch.Delivery_Date

                newTask.Mtrl_Code = task.Mtrl_Code
                Orders.getMaterial.MtrlCode = task.Mtrl_Code
                newTask.Thickness = Orders.getMaterial.Thickness
                newTask.MTRL = Orders.getMaterial.Grade
                newTask.Operation = task.Operation
                newTask.MProcess = task.MProcess
                newTask.CustMtrl = task.Mtrl_Source
                newTask.TaskNo = String.Format("{0} {1}", newTask.ScheduleNo, strTaskNo)
                newTask.TStatus = "Created"
                newTask.Priority = "Normal"
                Orders2.nc_task_list.Addnc_task_listRow(newTask)

                Dim taskParts = From Part In Orders2.orderscheduledetails
                                Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                newTask.NoOfDwgs = taskParts.Count

                Dim taskPartQty As Int32 = 0
                For Each part In taskParts
                    Dim taskPart As magod.Orders.Task_PartsListRow = Orders2.Task_PartsList.NewTask_PartsListRow
                    With taskPart
                        .DwgName = part.DwgName
                        .NcTaskId = newTask.NcTaskId
                        .QtyToNest = part.QtyScheduled
                        .TaskNo = newTask.TaskNo
                        .SchDetailsId = part.SchDetailsID
                        taskPartQty += part.QtyScheduled
                    End With
                    Orders2.Task_PartsList.AddTask_PartsListRow(taskPart)
                Next
                newTask.TotalParts = taskPartQty
                TaskNo += 1
            Next
            DGV_MtrlTask.AutoGenerateColumns = False
            DGV_MtrlTask.DataSource = Orders2.nc_task_list
            Return True



        Catch ex As Exception
            MsgBox(ex.Message)
            Return False
        End Try
        Return False
    End Function

    Private Function setupMagodsigma() As Boolean

        Dim SigmaTask As magod.SigmaNest.SigmaNestData.TaskListRow
        Dim SigmaPart As magod.SigmaNest.SigmaNestData.TaskPartsRow

        If MS Is Nothing Then
            MS = New magod.SigmaNest.Sigma(SnVersion)
        End If
        'set_sigmanestPath()
        With MS
            .DxfPath = OrderFolder & "\DXF\"
            .WSPath = OrderFolder & "\Material_" & OrderRow.Order_No & ".ws"
            .PartsPath = Orders.getCustDwgPath & "\" & Orders.getCustData(OrderRow.Cust_Code).DwgLoc & "\Parts\"
            .WO = OrderRow.Order_No
            .Customer = Orders.getCustData(OrderRow.Cust_Code).Cust_name
        End With




        MS.ClearOldData()
        With MS.getData
            For Each task As magod.Orders.nc_task_listRow In Orders2.nc_task_list.Rows
                SigmaTask = MS.getData.TaskList.NewTaskListRow
                With SigmaTask
                    .TaskId = task.NcTaskId
                    .TaskNo = task.TaskNo
                    .MTRL = task.MTRL
                    .Thickness = task.Thickness
                    .Process = task.MProcess
                    If task.IsMachineNull Then
                        .MachineName = "Laser 1"
                    Else
                        .MachineName = task.Machine
                    End If

                    .Mtrl_Code = task.Mtrl_Code
                    .Mtrl_source = task.CustMtrl

                End With
                MS.getData.TaskList.AddTaskListRow(SigmaTask)
            Next

            For Each part As magod.Orders.Task_PartsListRow In Orders2.Task_PartsList.Rows
                SigmaPart = MS.getData.TaskParts.NewTaskPartsRow
                With SigmaPart
                    .DwgName = part.DwgName
                    .DwgPattern = ".DXF"
                    .PartUid = part.Task_Part_ID
                    .QtyToNest = part.QtyToNest
                    .TaskId = part.NcTaskId
                    .DwgExists = True

                End With
                MS.getData.TaskParts.AddTaskPartsRow(SigmaPart)
            Next

            'For Each mtrl As magod.Orders.Task_MtrlListRow In Orders1.Task_MtrlList.Rows
            '    Dim SigmaSheet = MS.getData.TaskMtrlList.NewTaskMtrlListRow
            '    With SigmaSheet
            '        .TaskId = mtrl.NcTaskId
            '        .TaskNo = mtrl.TaskNo
            '        .Length = mtrl.Length
            '        .Width = mtrl.Width
            '        .NoOfSheets = mtrl.Quantity
            '        .MagodTaskId = mtrl.NcTaskId
            '    End With
            'Next
        End With
        Return True
    End Function
    Private Function setTempTaskPara() As Boolean
        ''**** get Sigmanest Parameters and up date Task and Task part Parameters
        Orders2.Task_MtrlList.Clear()
        Try
            '***** for Each Part in TaskPartTable
            For Each SigmaTask As magod.SigmaNest.SigmaNestData.TaskListRow In MS.getData.TaskList.Rows
                Console.WriteLine(String.Format("TaskId={0} ******** ", SigmaTask.TaskId))
                Dim task As magod.Orders.nc_task_listRow = Orders2.nc_task_list.FindByNcTaskId(SigmaTask.TaskId)
                If Not task Is Nothing Then
                    'task.TaskLOC = SigmaTask.TaskLOC
                    'task.TaskHoles = SigmaTask.TaskPierces
                    'task.TaskNests = SigmaTask.NestCount
                    task.NoOfSheets = SigmaTask.TaskSheetCount
                    task.NoOfDwgs = SigmaTask.TaskDwgs
                    task.TotalParts = SigmaTask.PartsNested
                    task.TaskNetArea = SigmaTask.TaskNetArea
                    'task.TaskPartArea = SigmaTask.TaskPartArea
                    'task.TaskPartRectArea = SigmaTask.TaskPartRectArea
                    'task.TaskMtrlArea = SigmaTask.TaskMtrlArea

                End If

                For Each snTaskNest As magod.SigmaNest.SigmaNestData.TaskNestsRow In MS.getData.TaskNests
                    Dim mtrl As magod.Orders.Task_MtrlListRow = Orders2.Task_MtrlList.NewTask_MtrlListRow
                    With snTaskNest
                        mtrl.Length = .NestX
                        mtrl.Width = .NestY
                        mtrl.Quantity = .NoOfSheets
                        mtrl.NcTaskId = .TaskId
                        Orders2.Task_MtrlList.AddTask_MtrlListRow(mtrl)
                    End With
                Next

                'For Each part As magod.SigmaNest.SigmaNestData.TaskPartsRow In MS.getData.TaskParts.Select(String.Format("TaskId={0}", SigmaTask.TaskId))
                '    Dim taskPart As magod.Orders.Task_PartsListRow = Orders2.Task_PartsList.FindByTask_Part_ID(part.PartMagodUid)
                '    If Not taskPart Is Nothing Then
                '        taskPart.QtyNested = part.QtyNested
                '        taskPart.LOC = part.PartLOC
                '        'taskPart.NoofPierces = part.PartPierces
                '        'taskPart.PartNetArea = part.NetArea
                '        'taskPart.Complexity = part.Complexity
                '        taskPart.OutOpen = part.OutOpen
                '        '  taskPart.OpenContour = part.OpenCounter
                '        'taskPart.PartOutArea = part.OutArea
                '        'taskPart.PartRectArea = part.RectArea
                '        'taskPart.PartX = part.PartX
                '        'taskPart.PartY = part.PartY


                '    End If
                '    ' QtnData1.taskDetails.AddtaskDetailsRow(taskPart)
                'Next

            Next



            Return True


        Catch ex As Exception
            MsgBox(ex.Message)
            Return False
        End Try

        Return True


    End Function
    Private Sub btn_MtrlArrival_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_MtrlArrival.Click

        MaterialDS1.mtrlreceiptdetails.Clear()
        MaterialDS1.material_receipt_register.Clear()
        With Orders.getCommand
            .Parameters.Clear()
            .CommandText = "SELECT m.`RVID`,m.`RV_No`, m.`RV_Date`,  m.`CustDocuNo`, m.`RVStatus`, " _
                    & "m.`TotalWeight`,m.updated, m.`TotalCalculatedWeight` FROM magodmis.material_receipt_register m " _
                    & "WHERE m.`Cust_Code`=@Cust_Code ORDER BY m.RV_no DESC;"
            .Parameters.AddWithValue("@Cust_Code", OrderRow.Cust_Code)
            .Connection.Open()
            MaterialDS1.material_receipt_register.Load(.ExecuteReader)
            .Connection.Close()
            .Parameters.Clear()
        End With
    End Sub

    Private Sub btn_ReadWS_Click(sender As Object, e As EventArgs) Handles btn_ReadWS.Click

    End Sub

    Private Sub DataGridView3_CellContentClick(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DataGridView3.CellContentClick
        MaterialDS1.mtrlreceiptdetails.Clear()
        If e.RowIndex <> -1 Then

            With Orders.getCommand
                .Parameters.Clear()
                .CommandText = "SELECT m.rvID, m.`Mtrl_Code`, m.`DynamicPara1`, m.`DynamicPara2`, m.`Qty`,m.updated " _
                  & "FROM magodmis.mtrlreceiptdetails m WHERE m.rvID= @rvID;"
                .Parameters.AddWithValue("@rvID", Me.DataGridView3.Rows(e.RowIndex).Cells("RvID").Value)
                .Connection.Open()
                MaterialDS1.mtrlreceiptdetails.Load(.ExecuteReader)
                .Connection.Close()
                .Parameters.Clear()
            End With
        End If
    End Sub

    Private Sub btn_AddSrl_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_AddSrl.Click
        '**** Create New serial 
        '**** Add to Order Details
        '**** Save

        Using X As New NewOrderSrl(OrderRow.Type)
            X.ShowDialog()
            If X.Save Then
                Dim OrderSrl As magod.Orders.Order_DetailsRow = Orders1.Order_Details.NewOrder_DetailsRow
                With OrderSrl
                    .Order_No = OrderNo
                    .Order_Srl = order_Srl + 1
                    .Order_Srl += 1
                    .Cust_Code = OrderRow.Cust_Code
                    .Dwg_Code = "Unknown"
                    .DwgName = X.PartName
                    .Mtrl_Code = X.Material
                    .Mtrl_Source = X.MaterialSource
                    .Qty_Ordered = X.Qty
                    .InspLevel = X.InspLevel
                    .PackingLevel = X.PkngLevel
                    .Operation = X.Operation
                    .JWCost = X.JWRate
                    .MtrlCost = X.MtrlRate
                    .delivery_date = DateTimePicker_DelDate.Value.ToString
                End With
                With Orders.getCommand
                    .CommandText = "Insert Into magodmis.order_details(order_no,order_srl ,cust_code,dwgname ,Dwg_Code, " _
                                 & "mtrl_code , operation, mtrl_source, qty_ordered, insplevel , " _
                                 & "packinglevel, delivery_date, JwCost,mtrlcost,Dwg,Tolerance,HasBOM) " _
                                 & "values (@order_no,@order_srl ,@cust_code,@dwgname ,@Dwg_Code, " _
                                 & "@mtrl_code , @operation, @mtrl_source, @qty_ordered, @insplevel , " _
                                 & "@packinglevel, @delivery_date, @JwCost,@mtrlcost,@Dwg,@Tolerance,@HasBOM); "
                    With .Parameters
                        .Clear()
                        .AddWithValue("@order_no", OrderSrl.Order_No)
                        .AddWithValue("@order_srl", OrderSrl.Order_Srl)
                        .AddWithValue("@cust_code", OrderSrl.Cust_Code)
                        .AddWithValue("@dwgname", OrderSrl.DwgName)
                        .AddWithValue("@Dwg_Code", OrderSrl.Dwg_Code)
                        .AddWithValue("@mtrl_code", OrderSrl.Mtrl_Code)
                        .AddWithValue("@operation", OrderSrl.Operation)
                        .AddWithValue("@mtrl_source", OrderSrl.Mtrl_Source)
                        .AddWithValue("@qty_ordered", OrderSrl.Qty_Ordered)
                        .AddWithValue("@insplevel", OrderSrl.InspLevel)
                        .AddWithValue("@packinglevel", OrderSrl.PackingLevel)
                        .AddWithValue("@delivery_date", OrderSrl.delivery_date)
                        .AddWithValue("@JWCost", OrderSrl.JWCost)
                        .AddWithValue("@MtrlCost", OrderSrl.MtrlCost)
                        .AddWithValue("@Dwg", OrderSrl.Dwg)
                        .AddWithValue("@HasBOM", OrderSrl.HasBOM)
                        .AddWithValue("@Tolerance", OrderSrl.Tolerance)

                    End With
                    .Connection.Open()
                    .ExecuteNonQuery()
                    .CommandText = "SELECT LAST_INSERT_ID();"
                    OrderSrl.OrderDetailId = .ExecuteScalar
                    .Connection.Close()
                End With
                Orders1.Order_Details.AddOrder_DetailsRow(OrderSrl)
                OrderSrl.AcceptChanges()

                Bs_OrderDetails.MoveLast()

            End If
        End Using


    End Sub


    Private Sub DGV_OrderDetails_CellClick(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_OrderDetails.CellClick
        If e.RowIndex <> -1 Then
            '***** Check If DXF Exists
            'dxfName = String.Format("{0}\DXF\{1}.dxf", OrderFolder, DGV_OrderDetails.Rows(e.RowIndex).Cells("DwgName").Value)
            'Me.Label_dwgName.Text = DGV_OrderDetails.Rows(e.RowIndex).Cells("DwgName").Value
            'If File.Exists(dxfName) Then
            '    'Dim fileInfo As FileInfo
            '    'fileInfo = New FileInfo(dxfName)

            '    model = WW.Cad.IO.DxfReader.Read(dxfName)
            'Else
            '    model = Nothing
            'End If
            'setUpTree()

            ''*****  ViewDxf.Model = model
            'SimpleDxfDisplay1.Model = model
        End If
    End Sub

    Private Sub TreeView_Layers_AfterCheck(ByVal sender As Object, ByVal e As System.Windows.Forms.TreeViewEventArgs) Handles TreeView_Layers.AfterCheck
        If e.Node.Level = 0 Then
            '  Dim layerEntitity = From entity In model.Entities Where entity.Layer.Name = e.Node.Text

            If e.Node.Checked Then
                For Each item As System.Windows.Forms.TreeNode In e.Node.Nodes
                    item.Checked = True
                Next
                SimpleDxfDisplay1.ShowLayer(e.Node.Text)
            Else
                For Each item As System.Windows.Forms.TreeNode In e.Node.Nodes
                    item.Checked = False
                Next
                SimpleDxfDisplay1.HideLayer(e.Node.Text)

            End If
        Else
            '  Dim layerEntitity = From entity In model.Entities Where entity.Reference.Handle = e.Node.Name
            If e.Node.Checked Then

                SimpleDxfDisplay1.showEntity(e.Node.Name)
            Else

                SimpleDxfDisplay1.hideEntity(e.Node.Name)
            End If
        End If

        '*** ViewDxf.Model = model
        SimpleDxfDisplay1.Model = model
    End Sub

    Private Sub setUpTree()
        TreeView_Layers.Nodes.Clear()
        If Not model Is Nothing Then


            Dim layers = From layer In model.Layers Select layer.Name
            Dim LayerEntitylist = From entity As WW.Cad.Model.Entities.DxfEntity In model.Entities _
                                  Select Layer = entity.Layer.Name, entity.EntityType, Show = entity.Visible, _
                                  ID = entity.Handle _
                                  Group By Layer Into LayerGp = Group


            For Each layer In LayerEntitylist
                '  Console.WriteLine(layer.Layer)
                Dim newLayer As New System.Windows.Forms.TreeNode
                newLayer.Text = layer.Layer
                newLayer.Checked = True
                For Each entity In layer.LayerGp
                    '   Console.WriteLine(String.Format(" {0} - {1} ", entity.EntityType, entity.ID))
                    Dim newEntity As New System.Windows.Forms.TreeNode
                    newEntity.Text = entity.EntityType
                    newEntity.Checked = entity.Show

                    newEntity.Name = entity.ID


                    newLayer.Nodes.Add(newEntity)
                Next
                TreeView_Layers.Nodes.Add(newLayer)
            Next
        End If
    End Sub


    Private Sub btn_EditDxf_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_EditDxf.Click
        Using X As New EditDxf(dxfName, Bs_OrderDetails.Current)

            X.ShowDialog()
            If File.Exists(dxfName) Then
                Dim fileInfo As FileInfo
                '  fileInfo = New FileInfo(dxfName)

                model = WW.Cad.IO.DxfReader.Read(dxfName)
            Else
                model = Nothing
            End If
            setUpTree()

            '*****  ViewDxf.Model = model
            SimpleDxfDisplay1.Model = model
        End Using
    End Sub

    Private Sub DGV_OrderDetails_RowEnter(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_OrderDetails.RowEnter
        If Not e.RowIndex = -1 Then
            '***** Check If DXF Exists
            dxfName = String.Format("{0}\DXF\{1}.dxf", OrderFolder, DGV_OrderDetails.Rows(e.RowIndex).Cells("DwgName").Value)
            Me.Label_dwgName.Text = DGV_OrderDetails.Rows(e.RowIndex).Cells("DwgName").Value
            If File.Exists(dxfName) Then
                'Dim fileInfo As FileInfo
                'fileInfo = New FileInfo(dxfName)

                model = WW.Cad.IO.DxfReader.Read(dxfName)
            Else
                model = Nothing
            End If
            setUpTree()

            '*****  ViewDxf.Model = model
            SimpleDxfDisplay1.Model = model
        End If
    End Sub
End Class

Public Enum orderType
    Complete = 1
    Scheduled = 2
    Open = 3

End Enum