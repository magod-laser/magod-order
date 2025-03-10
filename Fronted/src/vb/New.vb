'Imports System.Data.Odbc
'Imports System.Windows.Forms
'Imports System.Drawing
Imports MySql.Data.MySqlClient
Imports WW.Cad.Base
Imports WW.Cad.Drawing
Imports WW.Cad.Drawing.GDI
Imports WW.Cad.IO
Imports WW.Cad.Model
Imports WW.Math
Imports System
Imports System.Diagnostics
Imports System.IO
Imports System.Linq
Public Class Schedule
    Public Shared Event tableChanged(ByVal info As magod.events.MISChangedEventArguments)
    Dim FormOK, SchChanged As Boolean
    Dim ordersrl As String = ""
    Dim intSchId As Integer
    Dim DA_Schedule, Da_Sch, DA_SchDetails, DA_Scheduledetails, DA_Task, DA_TaskParts, _
            DA_TaskMaterial, DA_SchMtrlIndent, Da_magodMtrlIndent, _
            da_schMaterialList, DA_Cust, DA_PNList, Da_PNDetails As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim DelDate As Date
    Dim SchPath, SchNo, OrderPath, CustFolderPath As String ' Path to Order Schedule Folder
    Dim rptThread As System.Threading.Thread = New Threading.Thread(AddressOf Me.show_SheduleYeild)
    Dim repSchReady, repIndReady As Boolean
    Dim schRow As magod.Orders.orderscheduleRow

    Dim SigmaConfigPath, SigmaNestPath As String
    Private MS As magod.SigmaNest.magod_sigma

#Region "SetUp"
    Public Sub New(ByVal SchId As Integer)
        Try
            '' This call is required by the Windows Form Designer.
            InitializeComponent()
            intSchId = SchId
            SetUpForm()
            FormOK = True
        Catch ex As Exception
            MsgBox("Intialisation Form Schedule Details " & ex.Message)
        End Try
    End Sub
    Private Sub SetUpForm()
        SchChanged = False

        Bs_SalesPersons.DataSource = Orders.salesExecList
        BS_PgmEngr.DataSource = Orders.salesExecList
        Bs_exNot.DataSource = Orders.getExNotifications
        BS_Unit.DataSource = Orders.getUnitInfo

        setScheduleDetailsStatus("Trial")
        set_DaSchedule()
        set_daScheduleDetails()
        set_daScheduleTask()

        setScheduleStatus()
        setIndentControls()
        If schRow.Type = "Profile" Then
            btn_InternalOrder.Enabled = False
            btn_Fixture.Enabled = False
        ElseIf schRow.Type = "Service" Then
            btn_InternalOrder.Enabled = False
            btn_Fixture.Enabled = True
        Else
            btn_InternalOrder.Enabled = True
            btn_Fixture.Enabled = True
        End If
        setDetailsStatuscolor()
        OrderPath = Orders.getWOPath & "\" & schRow.Order_No
        CustFolderPath = Orders.getCustDwgPath
        ' SchPath = OrderPath & "\" & Replace(schRow.OrdSchNo, " ", "_")



    End Sub
    Private Sub refreshSchedule()
        '****** Delete Details
        Try
            With Orders1
                .Task_MtrlList.Clear()
                .Task_PartsList.Clear()
                .nc_task_list.Clear()
                .orderscheduledetails.Clear()
                DA_SchDetails.Fill(Orders1.orderscheduledetails)
                DA_Task.Fill(Orders1.nc_task_list)
                DA_TaskParts.Fill(Orders1.Task_PartsList)
                DA_TaskMaterial.Fill(Orders1.Task_MtrlList)
                setScheduleDetailsStatus("Trial")
                setScheduleStatus()
                setIndentControls()

                setDetailsStatuscolor()
            End With
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try



    End Sub
 
    Private Sub set_DaSchedule()
        DA_Schedule = Orders.getDBLink.getMySqlDataAdopter
        With DA_Schedule

            With .SelectCommand
                .CommandText = "SELECT s.*, c.Cust_name,c.Cust_name as Customer,c.`CustStatus`,c.`DwgLoc`, " _
                & "concat(s.`Order_No`,' ', s.`ScheduleNo`) as schedule " _
                                & "FROM magodmis.orderschedule s,magodmis.cust_data c " _
                                & "WHERE c.cust_code=s.cust_code  and s.ScheduleID=@ScheduleID ;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With
            .Fill(Orders1.orderschedule)
            schRow = Orders1.orderschedule.Rows(0)
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.orderschedule SET program_engineer=@program_engineer,TgtDeldate=@TgtDeldate, " _
                                & "Delivery_Date=@Delivery_Date,schedule_status=@schedule_status,scheduleno=@scheduleno ,ExNotNo=@ExNotNo " _
                                & "WHERE ScheduleID=@ScheduleID; "
                .Parameters.Add("@program_engineer", MySqlDbType.VarChar, 50, "program_engineer")
                .Parameters.Add("@TgtDeldate", MySqlDbType.DateTime, 30, "TgtDelDate")
                .Parameters.Add("@Delivery_Date", MySqlDbType.DateTime, 30, "Delivery_Date")
                .Parameters.Add("@schedule_status", MySqlDbType.VarChar, 50, "Schedule_Status")
                .Parameters.Add("@scheduleno", MySqlDbType.VarChar, 50, "ScheduleNo")
                .Parameters.Add("@ExNotNo", MySqlDbType.Int32, 6, "ExNotNo")
                .Parameters.Add("@ScheduleID", MySqlDbType.Int32).Value = intSchId
            End With


        End With

        '****** Dispatches
        With Orders.getCommand
            .CommandText = "SELECT * FROM magodmis.draft_dc_inv_register d WHERE d.`ScheduleId`=@ScheduleId;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@ScheduleId", intSchId)
            .Connection.Open()
            PkngandInvoice1.draft_dc_inv_register.Load(.ExecuteReader)

            .CommandText = "SELECT * FROM magodmis.draft_dc_inv_details d WHERE d.`ScheduleID`=@ScheduleID;"
            PkngandInvoice1.draft_dc_inv_details.Load(.ExecuteReader)
            .Connection.Close()
        End With
    End Sub
    Private Sub set_daScheduleDetails()
        DA_Scheduledetails = Orders.getDBLink.getMySqlDataAdopter
        With DA_Scheduledetails

            With .SelectCommand
                .CommandText = "SELECT o.*, cast(o1.`Qty_Ordered` As SIGNED)  - cast(o1.`QtyScheduled` As SIGNED) as QtyToSchedule ,o1.OrderDetailId " _
                            & "FROM magodmis.orderscheduledetails o, magodmis.Order_details o1 " _
                            & "WHERE  o.ScheduleID=@ScheduleID AND o1.OrderDetailId=o.OrderDetailId ;"
                .Parameters.Add("@ScheduleID", MySqlDbType.Int32).Value = intSchId
            End With
            .Fill(Orders1.orderscheduledetails)

            With .UpdateCommand
                .CommandText = "UPDATE magodmis.orderscheduledetails " _
                                & "SET priority=@priority,schedule_status=@schedule_status,qtyscheduled=@qtyscheduled," _
                                & "qtyCleared=@qtyCleared,JWcost=@JWcost,Mtrlcost=@Mtrlcost,Schedule_Srl=@Schedule_Srl, DwgStatus = @DwgStatus " _
                                & "WHERE schdetailsId=@schdetailsId;"
                .Parameters.Add("@priority", MySqlDbType.VarChar, 50, "priority")
                .Parameters.Add("@schedule_status", MySqlDbType.VarChar, 10, "schedule_status")
                .Parameters.Add("@qtyscheduled", MySqlDbType.Int32, 11, "qtyscheduled")
                .Parameters.Add("@qtyCleared", MySqlDbType.Int32, 11, "qtyCleared")
                .Parameters.Add("@JWcost", MySqlDbType.Decimal, 20, "JWCost")
                .Parameters.Add("@Mtrlcost", MySqlDbType.Decimal, 20, "MtrlCost")
                .Parameters.Add("@Schedule_Srl", MySqlDbType.VarChar, 3, "Schedule_Srl")
                .Parameters.Add("@schdetailsId", MySqlDbType.Int32, 20, "SchDetailsID")
                .Parameters.Add("@DwgStatus", MySqlDbType.Int16, 20, "DwgStatus")
            End With


            With .DeleteCommand
                .CommandText = "DELETE from magodmis.orderscheduledetails " _
                            & "WHERE  SchDetailsID=@SchDetailsID; "
                .Parameters.Add("@SchDetailsID", MySqlDbType.Int32, 20, "SchDetailsID")
            End With

        End With

    End Sub
    Private Sub set_daScheduleTask()


        DA_Task = Orders.getDBLink.getMySqlDataAdopter
        ''***** TaskList

        With DA_Task

            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.nc_task_List WHERE scheduleid=@SchDetailsID;"
                .Parameters.AddWithValue("@SchDetailsID", intSchId)
            End With
            .Fill(Orders1.nc_task_list)

        End With

        DA_TaskParts = Orders.getDBLink.getMySqlDataAdopter
        With DA_TaskParts
            With .SelectCommand
                .CommandText = "SELECT t.* FROM magodmis.task_partslist t,magodmis.nc_task_List n " _
                & "WHERE t.`NcTaskId`=n.`NcTaskId` AND n.scheduleid=@SchDetailsID;"
                .Parameters.AddWithValue("@SchDetailsID", intSchId)
            End With
            .Fill(Orders1.Task_PartsList)
        End With

        DA_TaskMaterial = Orders.getDBLink.getMySqlDataAdopter
        With DA_TaskMaterial
            With .SelectCommand
                .CommandText = "SELECT t.* FROM magodmis.task_material_list t,magodmis.nc_task_List n " _
                & "WHERE t.`NcTaskId`=n.`NcTaskId` AND n.scheduleid=@SchDetailsID;"
                .Parameters.AddWithValue("@SchDetailsID", intSchId)
            End With
            .Fill(Orders1.Task_MtrlList)
            With .InsertCommand
                .CommandText = "INSERT INTO magodmis.task_material_list ( TaskNo, Length, Width, Quantity,NcTaskId) " _
               & " VALUES( @TaskNo, @Length, @Width, @Quantity, @NcTaskId);"
                .Parameters.Add("@TaskNo", MySqlDbType.VarChar, 15, "TaskNo")
                .Parameters.Add("@Length", MySqlDbType.Int32, 15, "Length")
                .Parameters.Add("@Width", MySqlDbType.Int32, 15, "Width")
                .Parameters.Add("@Quantity", MySqlDbType.Int32, 15, "Quantity")
                .Parameters.Add("@NcTaskId", MySqlDbType.Int32, 15, "NcTaskId")

            End With

            With .UpdateCommand
                .CommandText = "UPDATE  magodmis.task_material_list SET Length=@Length,Width=@Width,Quantity=@Quantity,TaskNo=@TaskNo " _
                                & "WHERE ID=@ID;"
                .Parameters.Add("@Length", MySqlDbType.Int32, 15, "Length")
                .Parameters.Add("@Width", MySqlDbType.Int32, 15, "Width")
                .Parameters.Add("@Quantity", MySqlDbType.Int32, 15, "Quantity")
                .Parameters.Add("@TaskNo", MySqlDbType.VarChar, 20, "TaskNo")
                .Parameters.Add("@ID", MySqlDbType.Int32, 15, "ID")
            End With

            With .DeleteCommand
                .CommandText = "DELETE FROM magodmis.task_material_list WHERE ID=@ID;"
                .Parameters.Add("@ID", MySqlDbType.Int32, 15, "ID")
            End With
        End With


    End Sub

    Private Sub set_daSchMtrlIndent()
        '**** Da to work with magodmis.schedule_material_indent

        DA_SchMtrlIndent = Orders.getDBLink.getMySqlDataAdopter
        With DA_SchMtrlIndent

            With .SelectCommand
                .CommandText = "SELECT * FROM `magodmis`.`schedule_material_indent` WHERE ScheduleID=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With

            With .InsertCommand
                .CommandText = "INSERT INTO `magodmis`.`schedule_material_indent`" _
                & "(ScheduleID,Mtrl_Code,Length,Width,Quantity) " _
                                & "Values(@ScheduleID,@Mtrl_Code,@Length,@Width,@Quantity);"
                With .Parameters
                    .Add("@ScheduleID", MySqlDbType.Int32).Value = intSchId
                    .Add("@Mtrl_Code", MySqlDbType.VarChar, 100, "Mtrl_Code")
                    .Add("@Length", MySqlDbType.Int32, 20, "Length")
                    .Add("@Width", MySqlDbType.Int32, 20, "Width")
                    .Add("@Quantity", MySqlDbType.Int32, 20, "Quantity")
                End With
            End With

            With .UpdateCommand
                .CommandText = "UPDATE `magodmis`.`schedule_material_indent` " _
                                & "SET Mtrl_code=@Mtrl_code,Length=@Length,Width=@Width,Quantity=@Quantity,IndentId=@IndentId " _
                                & "WHERE Sch_mtrl_indentID=@Sch_mtrl_indentID;"

                With .Parameters

                    .Add("@Mtrl_Code", MySqlDbType.VarChar, 100, "Mtrl_Code")
                    .Add("@Length", MySqlDbType.Int32, 20, "Length")
                    .Add("@Width", MySqlDbType.Int32, 20, "Width")
                    .Add("@Quantity", MySqlDbType.Int32, 20, "Quantity")
                    .Add("@IndentID", MySqlDbType.Int32, 20, "IndentID")
                    .Add("@Sch_mtrl_indentID", MySqlDbType.Int32, 20, "Sch_mtrl_indentID")
                End With
            End With


            With .DeleteCommand
                .CommandText = "DELETE FROM `magodmis`.`schedule_material_indent` " _
                                 & "WHERE Sch_mtrl_indentID=@Sch_mtrl_indentID;"
                .Parameters.Add("@Sch_mtrl_indentID", MySqlDbType.Int32, 20, "Sch_mtrl_indentID")
            End With
        End With

        '****** To work with magodmis.mtrl_indent_register
        Da_magodMtrlIndent = Orders.getDBLink.getMySqlDataAdopter
        With Da_magodMtrlIndent
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.mtrl_indent_Register " _
                         & "WHERE ScheduleID=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With

        End With

        da_schMaterialList = Orders.getDBLink.getMySqlDataAdopter
        With da_schMaterialList
            With .SelectCommand
                .CommandText = "SELECT DISTINCT mtrl_code FROM magodmis.orderscheduledetails " _
                                              & "WHERE scheduleID=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With
        End With
    End Sub
    Private Sub set_daPn_list()
        '*** Set Da for Pn nad Pn Details
        DA_PNList = Orders.getDBLink.getMySqlDataAdopter
        With DA_PNList
            With .SelectCommand
                .CommandText = "SELECT d.`DC_Inv_No`, d.`DC_InvType`, d.`DC_No`, " _
                & "d.`DC_Date`, d.`Inv_No`, d.`Inv_Date`,d.`DCStatus`,d.`GrandTotal`,d.`PymtAmtRecd`  " _
                & "FROM magodmis.draft_dc_inv_register d,magodmis.orderschedule o " _
                & "WHERE (d.`ScheduleId`= o.`ScheduleID`) " _
                & "AND o.`ScheduleID`=@ScheduleID AND d.`dc_date` is not null;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With
        End With

        Da_PNDetails = Orders.getDBLink.getMySqlDataAdopter
        With Da_PNDetails
            With .SelectCommand
                .CommandText = "SELECT  d1.`DC_Inv_No`,d1.`DC_Inv_Srl`, d1.`Dwg_No`, d1.`Qty`, d1.`Mtrl` " _
                & "FROM magodmis.draft_dc_inv_details d1,magodmis.draft_dc_inv_register d,magodmis.orderschedule o " _
                & "WHERE (d.`ScheduleId`= o.`ScheduleID` ) " _
                & "AND o.`ScheduleID`=@ScheduleID  AND d.`dc_date` is not null AND d1.Dc_inv_no= d.Dc_inv_no ;"

                .Parameters.AddWithValue("@ScheduleID", intSchId)
            End With
        End With
    End Sub
    Private Sub set_mtrlIndent()
        'Dim cmd As Data.Odbc.OdbcCommand = Md.getCommand
        'With Orders.getdblink.getCommand
        '    Try
        '        .Connection.Open()
        '        .CommandText = "SELECT * FROM magodmis.mtrl_indent_Register " _
        '                      & "WHERE scheduleID=@;"

        '        .Parameters.Add("@ScheduleID", MySqlDbType.Int32).Value = intSchId

        '        DS_form.Tables("Schedule_MtrlList").Load(.ExecuteReader)


        '        cmd.CommandText = "SELECT DISTINCT mtrl_code FROM magodmis.orderscheduledetails " _
        '                        & "WHERE scheduleID=@;"
        '        DS_form.Tables("magod_Material_indentList").Load(cmd.ExecuteReader)

        '        .Connection.Close()
        '        BsMtrlIndent.DataSource = DS_form.Tables("magod_Material_indentList")

        '    Catch ex As Exception
        '        MsgBox(ex.Message)
        '    End Try

        'End With
    End Sub
   

   
#End Region

#Region "Schedule"
    Private Sub updateProductionData()
        If BS_Schedule.Current.item("Schedule_status") = "Closed" _
           Or BS_Schedule.Current.item("Schedule_status") = "ShortClosed" _
           Or BS_Schedule.Current.item("Schedule_status") = "Cancelled" _
           Or BS_Schedule.Current.item("Schedule_status") = "Suspended" _
           Or BS_Schedule.Current.item("Schedule_status") = "Ready" _
           Or BS_Schedule.Current.item("Schedule_status") = "Dispatched" Then
        Else
            '**** Update Production Cleared Parts in Schedule Details
            '  Dim cmd As Odbc.OdbcCommand = Md.getCommand
            With Orders.getCommand
                .CommandText = "UPDATE magodmis.nc_task_list n," _
                & "magodmis.task_partslist t,magodmis.orderscheduledetails o " _
                & "SET o.`QtyProduced`=t.`QtyCleared` " _
                & "WHERE n.`ScheduleID`=@ScheduleID AND t.`TaskNo`=n.`TaskNo` AND o.`SchDetailsID`=t.`SchDetailsId`;"
                .Parameters.AddWithValue("@ScheduleID", intSchId)
                .Connection.Open()
                .ExecuteNonQuery()
                .Connection.Close()
            End With
        End If


    End Sub

' ///Schedule Button Function
    Private Sub Btn_schedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_schedule.Click
        '****** If Out Standing Payment Warn for 60 Days and Block Sales for 90 days
        If Schedule() Then
            RaiseEvent tableChanged(New magod.events.MISChangedEventArguments("magodmis", "Order_Schedule"))
            '***** Schedule The Draft Schedule
            Orders1.orderscheduledetails.Clear()
            DA_Scheduledetails.Fill(Orders1.orderscheduledetails)
            MsgBox("Scheduled")

            schRow.Schedule_Status = "Tasked"

            setStatusButtons()
            '**** Create Schedule Directory
            SchPath = String.Format("{0}\{1}_{2}", OrderPath, schRow.Order_No, schRow.ScheduleNo)
            Orders.getDBLink.CheckCreateDir(SchPath, True)
            save()

            '****** Save Jpeg image in SchedueFolder

            If Not Directory.Exists(SchPath & "\PartImage") Then
                Directory.CreateDirectory(SchPath & "\PartImage")

            End If
            If schRow.Type = "Profile" Then
                SaveDXFImages(SchPath & "\PartImage")
            End If
        Else
            MsgBox("Not Scheduled")
        End If

    End Sub
    Private Sub SaveDXFImages(ByVal imgFolder As String)

        Dim model As DxfModel = Nothing
        Dim Format As String = "jpg"

        For Each schSrl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
            Dim filename As String = OrderPath & "\DXF\" & schSrl.DwgName & ".dxf"

            model = DxfReader.Read(filename)
            Dim stream As Stream
            Dim graphics As GDIGraphics3D = New GDIGraphics3D(GraphicsConfig.BlackBackgroundCorrectForBackColor)
            Dim maxSize As Size = New Size(500, 500)
            Dim bitmap As Bitmap = ImageExporter.CreateAutoSizedBitmap(model, graphics, Matrix4D.Identity, System.Drawing.Color.Black, maxSize)
            stream = File.Create((imgFolder + "\" + schSrl.DwgName + ".jpg"))
            ImageExporter.EncodeImageToJpeg(bitmap, stream)
            stream.Close()
        Next

        ''***** Insert Code to Create Image Or PDF file
        'Dim outfile As String = Path.GetFileNameWithoutExtension(Path.GetFullPath(filename))



        'Select Case Format()
        '    Case "bmp"
        '        stream = File.Create((outfile + ".bmp"))
        '        ImageExporter.EncodeImageToBmp(bitmap, stream)
        '    Case "gif"
        '        stream = File.Create((outfile + ".gif"))
        '        ImageExporter.EncodeImageToGif(bitmap, stream)
        '    Case "tiff"
        '        stream = File.Create((outfile + ".tiff"))
        '        ImageExporter.EncodeImageToTiff(bitmap, stream)
        '    Case "png"
        '        stream = File.Create((outfile + ".png"))
        '        ImageExporter.EncodeImageToPng(bitmap, stream)
        '    Case "jpg"
        '        stream = File.Create((outfile + ".jpg"))
        '        ImageExporter.EncodeImageToJpeg(bitmap, stream)
        '    Case Else
        '        Console.WriteLine(("Unknown format " + Format() + "."))
        'End Select
        'stream.Close()

    End Sub
    Private Function CheckForPayments() As Boolean
        '**** If any Payment pending More than 30 Days plus Credit Period warn
        '**** If More than 90 Days for Sales Block
        With Orders.getCommand
            Try
                .Connection.Open()
                .CommandText = "SELECT count(d.`DC_Inv_No`) FROM magodmis.draft_dc_inv_register d
                WHERE d.`DCStatus`='Despatched' AND  d.`DC_InvType`='Sales' 
                AND datediff(curdate(), d.`PaymentDate`)>30 AND d.`Cust_Code`=@Cust_Code"
                '.CommandText = "  SELECT count(d.`DC_Inv_No`)as OverDue
                '               FROM magodmis.draft_dc_inv_register d,
                '                    (SELECT CASE WHEN SUBSTRING_index(c.`CreditTerms`,' ',1) REGEXP ('[0-9]')
                '                                 THEN SUBSTRING_index(c.`CreditTerms`,' ',1)
                '                                 ELSE  0 END as CreditDays
                '                            FROM cust_data c Where c.cust_code =@Cust_Code) as a
                '                WHERE d.`DCStatus`='Despatched'
                '                AND DateDiff(CurDate(), d.`PaymentDate`) > 30 + a.CreditDays
                '                AND d.`Cust_Code`=@Cust_Code"
                .Parameters.Clear()
                .Parameters.AddWithValue("@Cust_Code", schRow.Cust_Code)
                Dim SalesOverdueresult As Int32 = .ExecuteScalar

                .CommandText = "SELECT count(d.`DC_Inv_No`) FROM magodmis.draft_dc_inv_register d
                            WHERE d.`DCStatus`='Despatched' AND datediff(curdate(), d.`PaymentDate`)>60 
                            AND d.`Cust_Code`=@Cust_Code"
                '.CommandText = "  SELECT count(d.`DC_Inv_No`)as OverDue
                '               FROM magodmis.draft_dc_inv_register d,
                '                    (SELECT CASE WHEN SUBSTRING_index(c.`CreditTerms`,' ',1) REGEXP ('[0-9]')
                '                                 THEN SUBSTRING_index(c.`CreditTerms`,' ',1)
                '                                 ELSE  0 END as CreditDays
                '                            FROM cust_data c Where c.cust_code =@Cust_Code) as a
                '                WHERE d.`DCStatus`='Despatched'
                '                AND DateDiff(CurDate(), d.`PaymentDate`) > 60 + a.CreditDays
                '                AND d.`Cust_Code`=@Cust_Code"

                Dim paymentCaution As Integer = .ExecuteScalar

                .Connection.Close()
                .Parameters.Clear()
                If SalesOverdueresult > 0 Then
                    If MsgBox(String.Format("{0} Sales Invoices have PaymentDate Exceeding 30 Days. Get Payment Cleared. Do you wish to proceed scheduling?", SalesOverdueresult), vbYesNo) = MsgBoxResult.Yes Then
                        '**** Open Login Box
                        Using X As New magod.setup.MagodLogIn(Orders.getCommand)

                            X.ShowDialog()

                            If Not X.UserValidated Then
                                MsgBox("Unit Head needs to approve this personally")
                                Return False
                            End If

                            If Not X.getRole = "UnitHead" Then
                                MsgBox("Unit Head needs to approve this personally")
                                Return False
                            End If

                        End Using
                    Else
                        '***Open Customer Dues List
                        Using X As New magod.CustInfo.CustOutStandingSummary(Orders.getCommand, schRow.Cust_Code)
                            X.WindowState = FormWindowState.Maximized
                            X.ShowDialog()
                        End Using
                        Return False
                    End If
                End If
                If paymentCaution > 0 Then
                    If MsgBox(String.Format("{0} Invoices have PaymentDate exceeding by 60 days . Get Payment Cleared. Do you wish to proceed scheduling?", paymentCaution), vbYesNo) = MsgBoxResult.No Then
                        '**** Open Login Box
                        Using X As New magod.setup.MagodLogIn(Orders.getCommand)

                            X.ShowDialog()

                            If Not X.UserValidated Then
                                MsgBox("Unit Head needs to approve this personally")
                                Return False
                            End If

                            If Not X.getRole = "UnitHead" Then
                                MsgBox("Unit Head needs to approve this personally")
                                Return False
                            End If

                        End Using
                    Else
                        MsgBox("Caution Customer for Payment ")
                        Using X As New magod.CustInfo.CustOutStandingSummary(Orders.getCommand, schRow.Cust_Code)
                            X.WindowState = FormWindowState.Maximized
                            X.ShowDialog()
                        End Using
                        Return False
                        Return True
                    End If
                End If
                Return True

            Catch ex As Exception
                MsgBox(ex.Message)
            Finally

            End Try



        End With
    End Function
    Private Function CheckForScheduling() As Boolean
        '**** Check Points before Scheduling
        '*** 1 Ex Not No selected
        '*** 2. Cust Not Black Listed
        '*** 3. Qty to schedule currently not > qty to schedule
        '**** 4 DXF exist for srl being scheduled
        '
        '**** The schedule has to be checked before releasing for production
        save()
        If Not CheckForPayments() Then
            Exit Function
        End If
        'If Me.cmbExNot.Text = "" Then
        '    MsgBox("Select Clearance Classification")
        '    Exit Function
        'Else
        '    '**** IF customer is not Excise Registered then Jobwork has to be cleared with Excise Duty
        '    If Not Orders.getCustData(schRow.Cust_Code).ExciseRegistration And schRow.ScheduleType = "Job Work" Then
        '        If Not Me.cmbExNot.Text = "Excise JobWork" Then
        '            Dim msg As String = String.Format("Customer Not cleared for NIL Excise Duty Clearance. Either clear good with Excise Duty OR update Customer Excise Registration Status")
        '            MsgBox(msg)
        '            Return False
        '        End If
        '    End If
        'End If
        '*** Check Cust Status
        'If schRow.CustStatus <> "OK" Then
        '    MsgBox("Production for this Customer is blocked with Status : " & schRow.CustStatus _
        '    & vbCrLf & "Get production block lifted and proceed")
        '    Exit Function
        'End If



        '***** Check if all items are are schedulable
        '***** qtyScheduled should not be more than OrderQty

        '**** 1. Check Quantity For Scheduling Not greater than Order Quantity
        BS_scheduleDetails.EndEdit()
        For Each schSrl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
            If schSrl.QtyScheduled = 0 Then
                If MsgBox("Cannot Schedule Zero Quantity For " & schSrl.DwgName _
                         & vbCrLf & "Do you wish to delete it from the Schedule ? ", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                    schSrl.Delete()

                Else
                    Exit Function
                End If
            Else
                If schSrl.QtyScheduled > schSrl.QtyToSchedule Then
                    MsgBox("Check Quantity to schedule. Make sure Quantity to schedule is correct")
                    Exit Function
                End If
            End If
        Next

        DA_Scheduledetails.Update(Orders1.orderscheduledetails)
        save()

        Dim srl As Integer = 1
        For Each schSrl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
            Select Case schRow.Type
                Case "Profile"
                    Dim filename As String = OrderPath & "\DXF\" & schSrl.DwgName & ".dxf"
                    'Dim model As DxfModel = Nothing
                    'Dim Format As String = "jpg"
                    If Not IO.File.Exists(filename) Then
                        Dim result As MsgBoxResult _
                        = MsgBox(OrderPath & "\DXF\" & schSrl.DwgName & ".dxf does not Exist, Do you wish to Drop this part from Schedule?", _
                                MsgBoxStyle.YesNoCancel)
                        If result = MsgBoxResult.Yes Then
                            '**** mark Part as unselected
                            schSrl.Selected = False
                            schSrl.Delete()
                        Else
                            If IO.File.Exists(filename) Then
                            End If
                            schSrl.DwgStatus = True
                            schSrl.Selected = False
                            Exit Function
                        End If
                    Else
                        '**** mark Part as selected
                        schSrl.Selected = True
                        schSrl.Schedule_Srl = srl
                        srl += 1
                    End If

                Case "Service"

                    '**** mark Part as selected
                    schSrl.Selected = True
                    schSrl.Schedule_Srl = srlSchedule
                    srl += 1
                Case "Fabrication"

                    '**** mark Part as selected
                    schSrl.Selected = True
                    schSrl.Schedule_Srl = srl
                    srl += 1
            End Select


        Next

        DA_Scheduledetails.Update(Orders1.orderscheduledetails)

        '*** do not proceed if dxf not present

        If Orders1.orderscheduledetails.Rows.Count = 0 Then
            MsgBox("No Parts to Schedule")
            Return False
        End If

        If Orders1.orderscheduledetails.Compute("COUNT(SchDetailsID)", "Selected=False") > 0 Then
            MsgBox("Ensure DXF present for all serials to be scheduled")
            Return False
            Exit Function
        End If

        Return True
    End Function
    Private Function Schedule() As Boolean
        '**** Check Points before Scheduling
        '*** 1 Ex Not No selected
        '*** 2. Cust Not Black Listed
        '*** 3. Qty to schedule currently not > qty to schedule
        '**** 4 DXF exist for srl being scheduled
        '
        If Not CheckForScheduling() Then
            Exit Function
        Else
            If Not CreateSchedule() Then
                Return False
            Else
                Select Case schRow.Type
                    Case "Profile"
                        CreateScheduleTasksProfile()
                    Case "Service"
                        CreateScheduleTasksService()
                    Case "Fabrication"
                        CreateScheduleTasksFabrication()
                End Select

                Return True
            End If
        End If
    End Function
    Private Function CreateSchedule() As Boolean

        Dim cmd As MySqlCommand = Orders.getDBLink.getCommand
        Try
            '***** get schedule No and Task

            With cmd
                .Parameters.Clear()
                .Connection.Open()
                .CommandText = "SELECT o.`ScheduleCount` FROM magodmis.order_list o WHERE o.`Order_No`=@Order_No;"
                .Parameters.AddWithValue("@Order_No", schRow.Order_No)
                With .Parameters
                    .Add("@QtyScheduled", MySqlDbType.Int32)
                    .Add("@OrderDetailID", MySqlDbType.Int32)
                    .Add("@ScheduleID", MySqlDbType.Int32)
                    .Add("@ScheduleNo", MySqlDbType.VarChar)
                    .Add("@Schedule_status", MySqlDbType.VarChar)
                    .Add("@schTgtDate", MySqlDbType.DateTime)
                    .Add("@ordschno", MySqlDbType.VarChar)
                    .Add("@ScheduleCount", MySqlDbType.Int16)
                End With
                Dim currentSrl As Int16 = .ExecuteScalar
                Dim strSchSrl As String = Microsoft.VisualBasic.Right("00" & currentSrl + 1, 2)
                .Parameters("@ScheduleCount").Value = currentSrl + 1
                .CommandText = "USE Magodmis;"
                .ExecuteNonQuery()
                .CommandText = "START Transaction;"
                .ExecuteNonQuery()

                .CommandText = "UPDATE order_details SET QtyScheduled=QtyScheduled+@QtyScheduled WHERE OrderDetailID=@OrderDetailID;"
                For Each SchSrl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                    .Parameters("@QtyScheduled").Value = SchSrl.QtyScheduled
                    .Parameters("@OrderDetailID").Value = SchSrl.OrderDetailID
                    .ExecuteNonQuery()
                Next

                .CommandText = "UPDATE orderschedule SET ScheduleNo=@ScheduleNo,Schedule_status='Scheduled', " _
                                & "schTgtDate=@schTgtDate, ScheduleDate=now(),ordschno=@ordschno WHERE ScheduleID=@ScheduleID;"
                .Parameters("@ScheduleNo").Value = strSchSrl
                .Parameters("@schTgtDate").Value = Me.DateTimePicker_DelDate.Value
                .Parameters("@ordschno").Value = schRow.Order_No & " " & strSchSrl
                .Parameters("@ScheduleID").Value = schRow.ScheduleId
                .ExecuteNonQuery()

                .CommandText = "UPDATE magodmis.order_list o SET o.`ScheduleCount`=@ScheduleCount WHERE o.`Order_No`=@Order_No;"
                .ExecuteNonQuery()

                .CommandText = "COMMIT;"
                .ExecuteNonQuery()

                With schRow
                    .OrdSchNo = schRow.Order_No & " " & strSchSrl
                    .Schedule_Status = "Scheduled"
                    .ScheduleNo = strSchSrl
                    .AcceptChanges()
                End With

            End With
            setDetailsStatuscolor()
            Return True
        Catch ex As Exception
            MsgBox(ex.Message)
            Return False
        Finally
            cmd.Connection.Close()
        End Try

    End Function

    Private Function CreateScheduleTasksFabrication() As Boolean
        '***** Delete all old Tasks
        '****** first group according to parameters
        '****** Create Tasks
        '****** add Task Details
        'Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code,  part.MProcess,part.Operation, part.Mtrl_Source, part.Tolerance, part.InspLevel).Distinct()
        '  Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
        Dim cmd As MySqlCommand = Orders.getDBLink.getCommand
        Dim TaskNo As Int16 = 1
        Dim strTaskNo As String

        Try

            With cmd
                .Connection.Open()
                .CommandText = "USE magodmis;"
                .ExecuteNonQuery()
                .CommandText = "START TRANSACTION;"
                .ExecuteNonQuery()
                With cmd
                    '**** Delete all previous Tasks created
                    Orders1.Task_PartsList.Clear()
                    Orders1.nc_task_list.Clear()
                    .CommandText = "DELETE FROM nc_task_list WHERE ScheduleID=@ScheduleID;"
                    .Parameters.AddWithValue("@ScheduleID", schRow.ScheduleId)
                    .ExecuteNonQuery()

                    For Each Srl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                        strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                        Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, Srl.Mtrl_Code, Srl.Mtrl_Source, Srl.MProcess, Srl.Operation))

                        Dim newTask As magod.Orders.nc_task_listRow = Orders1.nc_task_list.Newnc_task_listRow

                        newTask.ScheduleID = schRow.ScheduleId
                        newTask.Cust_code = schRow.Cust_Code
                        newTask.order_No = schRow.Order_No
                        If schRow.IsOrdSchNoNull Then
                            newTask.ScheduleNo = schRow.Order_No & " 00"
                        Else
                            newTask.ScheduleNo = schRow.OrdSchNo
                        End If
                        'newTask.ScheduleNo = schRow.OrdSchNo
                        newTask.DeliveryDate = schRow.Delivery_Date


                        newTask.Mtrl_Code = Srl.Mtrl_Code
                        Orders.getMaterial.MtrlCode = Srl.Mtrl_Code
                        newTask.Thickness = Orders.getMaterial.Thickness
                        newTask.MTRL = Orders.getMaterial.MaterialGrade
                        If newTask.IsMTRLNull Then
                            newTask.MTRL = "Undefined"
                        End If
                        newTask.Operation = Srl.Operation
                        newTask.MProcess = Srl.MProcess
                        newTask.CustMtrl = Srl.Mtrl_Source
                        newTask.TaskNo = String.Format("{0} {1}", newTask.ScheduleNo, strTaskNo)
                        newTask.TStatus = "Created"
                        newTask.Priority = "Normal"
                        Orders1.nc_task_list.Addnc_task_listRow(newTask)

                        'Dim taskParts = From Part In Orders1.orderscheduledetails _
                        '                Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                        newTask.NoOfDwgs = 1

                        Dim taskPartQty As Int32 = 0

                        Dim taskPart As magod.Orders.Task_PartsListRow = Orders1.Task_PartsList.NewTask_PartsListRow
                        With taskPart
                            taskPartQty += Srl.QtyScheduled
                        End With

                        newTask.TotalParts = taskPartQty

                        .CommandText = "INSERT INTO magodmis.nc_task_list(TaskNo, ScheduleID, DeliveryDate, order_No, " _
                        & "ScheduleNo, Cust_Code, Mtrl_Code, MTRL, Thickness, CustMtrl, NoOfDwgs, TotalParts, MProcess, Operation) " _
                        & "VALUES(@TaskNo, @ScheduleID, @DeliveryDate, @order_No, @ScheduleNo, @Cust_Code, @Mtrl_Code, @MTRL," _
                        & "@Thickness, @CustMtrl, @NoOfDwgs, @TotalParts, @MProcess, @Operation)"

                        With .Parameters
                            .Clear()
                            .AddWithValue("@TaskNo", newTask.TaskNo)
                            .AddWithValue("@ScheduleID", newTask.ScheduleID)
                            .AddWithValue("@DeliveryDate", newTask.DeliveryDate)
                            .AddWithValue("@order_No", newTask.order_No)
                            .AddWithValue("@ScheduleNo", newTask.ScheduleNo)
                            .AddWithValue("@Cust_Code", newTask.Cust_code)
                            .AddWithValue("@Mtrl_Code", newTask.Mtrl_Code)
                            .AddWithValue("@MTRL", newTask.MTRL)
                            .AddWithValue("@Thickness", newTask.Thickness)
                            .AddWithValue("@CustMtrl", newTask.CustMtrl)
                            .AddWithValue("@NoOfDwgs", newTask.NoOfDwgs)
                            .AddWithValue("@TotalParts", newTask.TotalParts)
                            .AddWithValue("@MProcess", newTask.MProcess)
                            .AddWithValue("@Operation", newTask.Operation)
                        End With
                        .ExecuteNonQuery()
                        .CommandText = "SELECT LAST_INSERT_ID();"
                        newTask.NcTaskId = .ExecuteScalar

                        .CommandText = " UPDATE magodmis.orderscheduledetails o SET o.TaskNo =@TaskNo,o.NcTaskId=@NcTaskId WHERE SchDetailsID=@SchDetailsID;"
                        .Parameters.Add("@SchDetailsID", MySqlDbType.Int32)
                        .Parameters.AddWithValue("@NcTaskId", newTask.NcTaskId)
                        '  For Each part In taskParts
                        cmd.Parameters("@SchDetailsID").Value = Srl.SchDetailsID
                        .ExecuteNonQuery()

                        'Next
                        .CommandText = " INSERT INTO  magodmis.task_partslist(NcTaskId, TaskNo, SchDetailsId, DwgName, QtyToNest, OrdScheduleSrl, OrdSch) " _
                                        & "SELECT  @NcTaskId, @TaskNo, o.`SchDetailsID`, o.`DwgName`, o.`QtyScheduled`, o.`Schedule_Srl`, @ScheduleNo " _
                                        & "FROM magodmis.orderscheduledetails o WHERE o.`NcTaskId`= @NcTaskId;"

                        .ExecuteNonQuery()
                        newTask.AcceptChanges()
                        TaskNo += 1
                    Next
                    '   .Transaction.Commit()
                    .CommandText = "COMMIT;"
                    .ExecuteNonQuery()
                End With
                ' Orders.getMaterial.MtrlCode = "Sheet MS CR 1"
            End With





            Return True
        Catch ex As Exception
            ' cmd.Transaction.Rollback()
            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()
            MsgBox(ex.Message)
        Finally

            cmd.Connection.Close()
            cmd.Parameters.Clear()

        End Try


    End Function
    Private Function CreateScheduleTasksService() As Boolean
        '***** Delete all old Tasks
        '****** first group according to parameters
        '****** Create Tasks
        '****** add Task Details
        'Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code,  part.MProcess,part.Operation, part.Mtrl_Source, part.Tolerance, part.InspLevel).Distinct()
        '  Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
        Dim cmd As MySqlCommand = Orders.getDBLink.getCommand
        Dim TaskNo As Int16 = 1
        Dim strTaskNo As String

        Try

            With cmd
                .Connection.Open()
                .CommandText = "USE magodmis;"
                .ExecuteNonQuery()
                .CommandText = "START TRANSACTION;"
                .ExecuteNonQuery()
                With cmd
                    '**** Delete all previous Tasks created
                    Orders1.Task_PartsList.Clear()
                    Orders1.nc_task_list.Clear()
                    .CommandText = "DELETE FROM nc_task_list WHERE ScheduleID=@ScheduleID;"
                    .Parameters.AddWithValue("@ScheduleID", schRow.ScheduleId)
                    .ExecuteNonQuery()

                    For Each Srl As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                        strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                        Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, Srl.Mtrl_Code, Srl.Mtrl_Source, Srl.MProcess, Srl.Operation))

                        Dim newTask As magod.Orders.nc_task_listRow = Orders1.nc_task_list.Newnc_task_listRow

                        newTask.ScheduleID = schRow.ScheduleId
                        newTask.Cust_code = schRow.Cust_Code
                        newTask.order_No = schRow.Order_No
                        If schRow.IsOrdSchNoNull Then
                            newTask.ScheduleNo = schRow.Order_No & " 00"
                        Else
                            newTask.ScheduleNo = schRow.OrdSchNo
                        End If
                        'newTask.ScheduleNo = schRow.OrdSchNo
                        newTask.DeliveryDate = schRow.Delivery_Date


                        newTask.Mtrl_Code = Srl.Mtrl_Code
                        Orders.getMaterial.MtrlCode = Srl.Mtrl_Code
                        newTask.Thickness = Orders.getMaterial.Thickness
                        newTask.MTRL = Orders.getMaterial.MaterialGrade
                        If newTask.IsMTRLNull Then
                            newTask.MTRL = "Undefined"
                        End If
                        newTask.Operation = Srl.Operation
                        newTask.MProcess = Srl.MProcess
                        newTask.CustMtrl = Srl.Mtrl_Source
                        newTask.TaskNo = String.Format("{0} {1}", newTask.ScheduleNo, strTaskNo)
                        newTask.TStatus = "Created"
                        newTask.Priority = "Normal"
                        Orders1.nc_task_list.Addnc_task_listRow(newTask)

                        'Dim taskParts = From Part In Orders1.orderscheduledetails _
                        '                Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                        newTask.NoOfDwgs = 1

                        Dim taskPartQty As Int32 = 0

                        Dim taskPart As magod.Orders.Task_PartsListRow = Orders1.Task_PartsList.NewTask_PartsListRow
                        With taskPart
                            taskPartQty += Srl.QtyScheduled
                        End With

                        newTask.TotalParts = taskPartQty

                        .CommandText = "INSERT INTO magodmis.nc_task_list(TaskNo, ScheduleID, DeliveryDate, order_No, " _
                        & "ScheduleNo, Cust_Code, Mtrl_Code, MTRL, Thickness, CustMtrl, NoOfDwgs, TotalParts, MProcess, Operation) " _
                        & "VALUES(@TaskNo, @ScheduleID, @DeliveryDate, @order_No, @ScheduleNo, @Cust_Code, @Mtrl_Code, @MTRL," _
                        & "@Thickness, @CustMtrl, @NoOfDwgs, @TotalParts, @MProcess, @Operation)"

                        With .Parameters
                            .Clear()
                            .AddWithValue("@TaskNo", newTask.TaskNo)
                            .AddWithValue("@ScheduleID", newTask.ScheduleID)
                            .AddWithValue("@DeliveryDate", newTask.DeliveryDate)
                            .AddWithValue("@order_No", newTask.order_No)
                            .AddWithValue("@ScheduleNo", newTask.ScheduleNo)
                            .AddWithValue("@Cust_Code", newTask.Cust_code)
                            .AddWithValue("@Mtrl_Code", newTask.Mtrl_Code)
                            .AddWithValue("@MTRL", newTask.MTRL)
                            .AddWithValue("@Thickness", newTask.Thickness)
                            .AddWithValue("@CustMtrl", newTask.CustMtrl)
                            .AddWithValue("@NoOfDwgs", newTask.NoOfDwgs)
                            .AddWithValue("@TotalParts", newTask.TotalParts)
                            .AddWithValue("@MProcess", newTask.MProcess)
                            .AddWithValue("@Operation", newTask.Operation)
                        End With
                        .ExecuteNonQuery()
                        .CommandText = "SELECT LAST_INSERT_ID();"
                        newTask.NcTaskId = .ExecuteScalar

                        .CommandText = " UPDATE magodmis.orderscheduledetails o SET o.TaskNo =@TaskNo,o.NcTaskId=@NcTaskId WHERE SchDetailsID=@SchDetailsID;"
                        .Parameters.Add("@SchDetailsID", MySqlDbType.Int32)
                        .Parameters.AddWithValue("@NcTaskId", newTask.NcTaskId)
                        '  For Each part In taskParts
                        cmd.Parameters("@SchDetailsID").Value = Srl.SchDetailsID
                        .ExecuteNonQuery()

                        'Next
                        .CommandText = " INSERT INTO  magodmis.task_partslist(NcTaskId, TaskNo, SchDetailsId, DwgName, QtyToNest, OrdScheduleSrl, OrdSch,HasBOM) " _
                                        & "SELECT  @NcTaskId, @TaskNo, o.`SchDetailsID`, o.`DwgName`, o.`QtyScheduled`, o.`Schedule_Srl`, @ScheduleNo, o.`HasBOM` " _
                                        & "FROM magodmis.orderscheduledetails o WHERE o.`NcTaskId`= @NcTaskId;"

                        .ExecuteNonQuery()
                        newTask.AcceptChanges()
                        TaskNo += 1
                    Next
                    '   .Transaction.Commit()
                    .CommandText = "COMMIT;"
                    .ExecuteNonQuery()
                End With
                ' Orders.getMaterial.MtrlCode = "Sheet MS CR 1"
            End With





            Return True
        Catch ex As Exception
            ' cmd.Transaction.Rollback()
            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()
            MsgBox(ex.Message)
        Finally

            cmd.Connection.Close()
            cmd.Parameters.Clear()

        End Try


    End Function
    Private Function CreateScheduleTasksProfile() As Boolean
        '***** Delete all old Tasks
        '****** first group according to parameters
        '****** Create Tasks
        '****** add Task Details
        'Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code,  part.MProcess,part.Operation, part.Mtrl_Source, part.Tolerance, part.InspLevel).Distinct()
        Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
        Dim cmd As MySqlCommand = Orders.getDBLink.getCommand
        Dim TaskNo As Int16 = 1
        Dim strTaskNo As String

        Try

            With cmd
                .Connection.Open()
                .CommandText = "USE magodmis;"
                .ExecuteNonQuery()
                ' .Connection.BeginTransaction()



                .CommandText = "START TRANSACTION;"
                .ExecuteNonQuery()
                With cmd
                    '**** Delete all previous Tasks created
                    Orders1.Task_PartsList.Clear()
                    Orders1.nc_task_list.Clear()
                    .CommandText = "DELETE FROM nc_task_list WHERE ScheduleID=@ScheduleID;"
                    .Parameters.AddWithValue("@ScheduleID", schRow.ScheduleId)
                    .ExecuteNonQuery()

                    For Each task In tasks
                        strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                        Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, task.Mtrl_Code, task.Mtrl_Source, task.MProcess, task.Operation))

                        Dim newTask As magod.Orders.nc_task_listRow = Orders1.nc_task_list.Newnc_task_listRow

                        newTask.ScheduleID = schRow.ScheduleId
                        newTask.Cust_code = schRow.Cust_Code
                        newTask.order_No = schRow.Order_No
                        If schRow.IsOrdSchNoNull Then
                            newTask.ScheduleNo = schRow.Order_No & " 00"
                        Else
                            newTask.ScheduleNo = schRow.OrdSchNo
                        End If
                        'newTask.ScheduleNo = schRow.OrdSchNo
                        newTask.DeliveryDate = schRow.Delivery_Date


                        newTask.Mtrl_Code = task.Mtrl_Code
                        Orders.getMaterial.MtrlCode = task.Mtrl_Code
                        newTask.Thickness = Orders.getMaterial.Thickness
                        newTask.MTRL = Orders.getMaterial.MaterialGrade
                        newTask.Operation = task.Operation
                        newTask.MProcess = task.MProcess
                        newTask.CustMtrl = task.Mtrl_Source
                        newTask.TaskNo = String.Format("{0} {1}", newTask.ScheduleNo, strTaskNo)
                        newTask.TStatus = "Created"
                        newTask.Priority = "Normal"
                        Orders1.nc_task_list.Addnc_task_listRow(newTask)

                        Dim taskParts = From Part In Orders1.orderscheduledetails _
                                        Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                        newTask.NoOfDwgs = taskParts.Count

                        Dim taskPartQty As Int32 = 0
                        For Each part In taskParts
                            Dim taskPart As magod.Orders.Task_PartsListRow = Orders1.Task_PartsList.NewTask_PartsListRow
                            With taskPart
                                taskPartQty += part.QtyScheduled
                            End With
                        Next
                        newTask.TotalParts = taskPartQty

                        .CommandText = "INSERT INTO magodmis.nc_task_list(TaskNo, ScheduleID, DeliveryDate, order_No, " _
                        & "ScheduleNo, Cust_Code, Mtrl_Code, MTRL, Thickness, CustMtrl, NoOfDwgs, TotalParts, MProcess, Operation) " _
                        & "VALUES(@TaskNo, @ScheduleID, @DeliveryDate, @order_No, @ScheduleNo, @Cust_Code, @Mtrl_Code, @MTRL," _
                        & "@Thickness, @CustMtrl, @NoOfDwgs, @TotalParts, @MProcess, @Operation)"

                        With .Parameters
                            .Clear()
                            .AddWithValue("@TaskNo", newTask.TaskNo)
                            .AddWithValue("@ScheduleID", newTask.ScheduleID)
                            .AddWithValue("@DeliveryDate", newTask.DeliveryDate)
                            .AddWithValue("@order_No", newTask.order_No)
                            .AddWithValue("@ScheduleNo", newTask.ScheduleNo)
                            .AddWithValue("@Cust_Code", newTask.Cust_code)
                            .AddWithValue("@Mtrl_Code", newTask.Mtrl_Code)
                            .AddWithValue("@MTRL", newTask.MTRL)
                            .AddWithValue("@Thickness", newTask.Thickness)
                            .AddWithValue("@CustMtrl", newTask.CustMtrl)
                            .AddWithValue("@NoOfDwgs", newTask.NoOfDwgs)
                            .AddWithValue("@TotalParts", newTask.TotalParts)
                            .AddWithValue("@MProcess", newTask.MProcess)
                            .AddWithValue("@Operation", newTask.Operation)
                        End With
                        .ExecuteNonQuery()
                        .CommandText = "SELECT LAST_INSERT_ID();"
                        newTask.NcTaskId = .ExecuteScalar

                        .CommandText = " UPDATE magodmis.orderscheduledetails o SET o.TaskNo =@TaskNo,o.NcTaskId=@NcTaskId WHERE SchDetailsID=@SchDetailsID;"
                        .Parameters.Add("@SchDetailsID", MySqlDbType.Int32)
                        .Parameters.AddWithValue("@NcTaskId", newTask.NcTaskId)
                        For Each part In taskParts
                            cmd.Parameters("@SchDetailsID").Value = part.SchDetailsID
                            .ExecuteNonQuery()

                        Next
                        .CommandText = " INSERT INTO  magodmis.task_partslist(NcTaskId, TaskNo, SchDetailsId, DwgName, QtyToNest, OrdScheduleSrl, OrdSch, HasBOM) " _
                                        & "SELECT  @NcTaskId, @TaskNo, o.`SchDetailsID`, o.`DwgName`, o.`QtyScheduled`, o.`Schedule_Srl`, @ScheduleNo, o.`HasBOM` " _
                                        & "FROM magodmis.orderscheduledetails o WHERE o.`NcTaskId`= @NcTaskId;"

                        .ExecuteNonQuery()
                        newTask.AcceptChanges()
                        TaskNo += 1
                    Next
                    '   .Transaction.Commit()
                    .CommandText = "COMMIT;"
                    .ExecuteNonQuery()
                End With
                ' Orders.getMaterial.MtrlCode = "Sheet MS CR 1"
            End With





            Return True
        Catch ex As Exception
            ' cmd.Transaction.Rollback()
            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()
            MsgBox(ex.Message)
        Finally

            cmd.Connection.Close()
            cmd.Parameters.Clear()

        End Try


    End Function

    Private Function DeleteScheduleTasks()
        '**** delete is permitted only no sch is not being processed
        '**** in whic case you must put schedule on hold , roll back and cancel
        Return False
    End Function
    Private Sub showSchedule()
        save()
        If Orders1.orderscheduledetails.Rows.Count = 0 Then
            Exit Sub
        End If
        ReportManager1.DataSources.Clear()
        ReportManager1.DataSources.Add("Sch", BS_Schedule)
        ReportManager1.DataSources.Add("SchDetails", BS_scheduleDetails)
        ReportManager1.DataSources.Add("Unit", BS_Unit)

        'Me.FileReportSlot1.DesignTemplate()
      

        Me.Cursor = Cursors.WaitCursor
        'If Not FileReportSlot1.Equals(Nothing) Then
        '    FileReportSlot1.Prepare()
        '    FileReportSlot1.RenderDocument()
        'Else
        '    MsgBox("Add 'rpt_schedule' to Reports folder in the application")
        '    Exit Sub
        'End If
        InlineReportSlot1.Prepare()

        '/************************

        '***** If this is the first time send PDF to Store
        Try
            Orders.getDBLink.CheckCreateDir(SchPath, True)
            Dim schpdfPath = SchPath & "\" & Replace(schRow.OrdSchNo, " ", "_") & ".pdf"
            Dim FileInfo As IO.FileInfo
            FileInfo = New IO.FileInfo(schpdfPath)
            If Not FileInfo.Exists Then
                InlineReportSlot1.RenderDocument()
                Dim PdfExportFilter1 As New PerpetuumSoft.Reporting.Export.Pdf.PdfExportFilter
                With PdfExportFilter1
                    .Compress = True
                    .Export(InlineReportSlot1.Document, schpdfPath, False)
                End With
            End If


            Using preViewForm As New PerpetuumSoft.Reporting.View.PreviewForm(InlineReportSlot1)
                preViewForm.WindowState = System.Windows.Forms.FormWindowState.Maximized
                preViewForm.ShowDialog()
            End Using


        Catch ex As Exception
            MsgBox(ex.Message)

        End Try

        Me.Cursor = Cursors.Default


    End Sub
    Private Sub ClearSchedule()
        'With DS_form

        '    .Tables("Schedule_TaskList").Clear()
        '    .Tables("Schedule_PartsList").Clear()
        '    .Tables("Schedule_MtrlIndentList").Clear()
        '    .Tables("Schedule_MtrlList").Clear()
        '    .Tables("magod_Material_indentList").Clear()
        '    .Tables("PnDetails").Clear()
        '    .Tables("PnList").Clear()
        '    .Tables("Schedule").Clear()

        'End With
    End Sub
    Public ReadOnly Property isFormOK() As Boolean
        Get
            Return FormOK
        End Get
    End Property
    '**** DGV List
    Private Sub setScheduleDetailsStatus(ByVal Trial As String)
        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@ScheduleId", intSchId)
            .Connection.Open()
            '****** Update SchedulePart Status according to Status
            .CommandText = "update magodmis.orderscheduledetails o,
                    (SELECT  CASE
                    When o.`QtyScheduled`=0  then 'Cancelled'
                    When o.`QtyDelivered`>=o.`QtyScheduled` then 'Dispatched'
                    When o.`QtyPacked`>=o.`QtyScheduled` then 'Ready'
                    When o.`QtyCleared`>=o.`QtyScheduled` then if(o1.ScheduleType='Combined' , 'Closed' , 'Inspected')
                    When o.`QtyProduced`-o.`QtyRejected`>=o.`QtyScheduled` then 'Completed'
                    When o.`QtyProgrammed`>=o.`QtyScheduled` then 'Programmed'
                    When o.`QtyProgrammed`>0 then 'Production'
                    When o.`QtyScheduled`> 0 then 'Tasked'                 
                    else 'Created' end as `Status`, o.`SchDetailsID`
                    from magodmis.orderscheduledetails o,magodmis.orderschedule o1
                    WHERE o1.`ScheduleId`=o.`ScheduleId` 
                    AND o1.`ScheduleId`=@ScheduleId ) A
                    SET o.Schedule_Status=a.`Status`
                    WHERE a.SchDetailsID= o.`SchDetailsID`"

            .ExecuteNonQuery()


            '****** Update Schedule Status of Schecdule dependenat on schedule
            .CommandText = "UPDATE magodmis.orderschedule o1,
                            (SELECT a.ScheduleId,a.schedule_status,min( a.Seniority) as Seniority FROM
                            (SELECT  distinct o.`ScheduleId`, o.`Schedule_Status`,m.`status`, m.seniority
                            FROM magodmis.orderschedule o1,magodmis.orderscheduledetails o
                            left join magod_setup.magod_statuslist m on o.`Schedule_Status`=m.`status`
                            WHERE  m.`function`='Schedule' and o.ScheduleId=o1.ScheduleId AND o1.ScheduleId=@ScheduleId
                            and  (   o1.`Schedule_Status`='Scheduled' OR o1.`Schedule_Status`='Tasked' 
                                or o1.`Schedule_Status`='Programmed' 
                                or o1.`Schedule_Status`='Production' or o1.`Schedule_Status`='Completed'
                                or o1.`Schedule_Status`='Inspected' or o1.`Schedule_Status`='Ready')
                            order by m.seniority) as a
                            Group by a.ScheduleId) as B
                            SET o1.Schedule_Status=b.Schedule_Status
                            WHERE o1.ScheduleId=b.ScheduleId ;"
            .ExecuteNonQuery()
            .Connection.Close()
        End With

        'If InStr(schRow.Schedule_Status, "Comb") <> 0 And IntSchStatus >= 5 Then
        '    schRow.Schedule_Status = Status
        '    saveSchedule()
        'End If


    End Sub
    Private Sub DGV_scheduledetails_CellValidated(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_scheduledetails.CellValidated
        BS_scheduleDetails.EndEdit()
    End Sub
    Private Sub DGV_scheduledetails_CellValidating(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellValidatingEventArgs) Handles DGV_scheduledetails.CellValidating

        If FormOK And Me.DGV_scheduledetails.Columns(e.ColumnIndex).Name = "QtyScheduled" _
        And Not Me.DGV_scheduledetails.Columns(e.ColumnIndex).ReadOnly Then
            With Me.DGV_scheduledetails
                If e.FormattedValue > .Rows(e.RowIndex).Cells("ToSchedule").Value Then
                    MsgBox("You cannot Schedule more than the To Schedule Quantity")
                    e.Cancel = True
                End If
            End With
        End If
        If FormOK And Me.DGV_scheduledetails.Columns(e.ColumnIndex).Name _
        = "QtyCleared" Then
            With Me.DGV_scheduledetails
                If e.FormattedValue > .Rows(e.RowIndex).Cells("QtyProduced").Value Then
                    MsgBox("You cannot clear more quqntity than produced")
                    e.Cancel = True
                ElseIf e.FormattedValue < .Rows(e.RowIndex).Cells("QtyPacked").Value Then
                    MsgBox("Quantity Cleared has to be equal or more than Quantity Packed")
                    e.Cancel = True
                End If
            End With
        End If
    End Sub
    Private Sub setDetailsStatuscolor()
        For Each drv As DataGridViewRow In Me.DGV_scheduledetails.Rows
            If Not drv.IsNewRow Then
                Select Case drv.Cells("SrlStatus").Value
                    Case Is = 1
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Lavender
                    Case Is = 2
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Khaki
                    Case Is = 3
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Coral
                    Case Is = 4
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.LightCoral
                    Case Is = 5
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.LightYellow
                    Case Is = 6
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Yellow
                    Case Is = 7
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.YellowGreen
                    Case Is = 8
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.LightGreen
                    Case Is = 9
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.LightGreen
                    Case Is = 10
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Lime
                    Case Is = 11
                        drv.DefaultCellStyle.BackColor = System.Drawing.Color.Green
                End Select
            End If
        Next
    End Sub

#End Region
#Region "Sigma and Material"
    'Private Sub set_sigmanestPath()
    '    Try
    '        Dim finfo As IO.FileInfo
    '        Dim DS As DataSet = New DataSet
    '        DS.ReadXml(Application.StartupPath & "\setup.xml")
    '        SigmaNestPath = DS.Tables("SigmaExecutableFile").Rows(0).Item("name")
    '        SigmaConfigPath = DS.Tables("SnConfigFilePath").Rows(0).Item("Name")
    '        finfo = New IO.FileInfo(SigmaNestPath)
    '        If Not FInfo.Exists Then
    '            MsgBox(SigmaNestPath & " does not exit. Reset Path in SetUp File")

    '            Exit Sub
    '        End If
    '        'PostBS.DataSource = DS.Tables("POSTPath")
    '    Catch ex As Exception
    '        MsgBox(ex.Message)
    '    End Try
    ' End Sub
    '**** Code Handling Material Indent For sales
    Private Sub TextBox_SchType_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles TextBox_SchType.TextChanged
        'setIndentControls()
    End Sub

  
    Private Sub setIndentControls()
        Select Case BS_Schedule.Current.item("ScheduleType")
            Case "Sales"
                Bs_exNot.Filter = "Sales<>0"
              
            Case "Job Work"
                Bs_exNot.Filter = "JobWork<>0"

            Case "JobWork"
                Bs_exNot.Filter = "JobWork<>0"

            Case "Service"
                Bs_exNot.Filter = "Service<>0"

            Case "Combined"
                Bs_exNot.Filter = "Service<>0 AND JobWork<>0"

                Me.btnShotClose.Enabled = False
                Me.btnSuspend.Enabled = False
                Me.btnCancel.Enabled = False
        End Select


        If Me.TextBox_SchType.Text = "Sales" Then


        ElseIf Me.TextBox_SchType.Text = "JobWork" Then

        Else

        End If

    End Sub


    Private Function checkIfWsExists() As Boolean
        Dim file As IO.FileInfo
        Dim fName As String = OrderPath & "\Material_" & BS_Schedule.Current.item("Order_no") & ".ws"
        file = New IO.FileInfo(fName)
        If file.Exists Then
            If MsgBox(file.Name & " already exists, Do you wish to delete it ", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
                file.Delete()
                Return True
            Else
                Return False
            End If
        Else
            Return True
        End If
    End Function



    Private Sub set_sigmanestPath()
        Try

            If Orders.SnExecutablePath Is Nothing Then
                MsgBox("SigmaNest Settings  do not exit. Reset Path in SetUp File")
                Using X As New Magod.Form_ServerAndSigma
                    X.ShowDialog()
                    Orders.getDBLink.reloadSetUp()
                End Using
                Exit Sub
            End If

            MS.SnConfigPath = Orders.SnConfigPath

        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub


#End Region

#Region "Schedule Handling"



    Private Sub show_SheduleYeild()
        'Using X As New Schedule_Yeild
        '    X.Show()
        'End Using
    End Sub
    Private Sub setScheduleStatus(Optional ByVal reset As Boolean = False)
        If schRow.Schedule_Status = "Created" Then
            Me.DGV_scheduledetails.Columns("ToSchedule").Visible = True
        Else
            Me.DGV_scheduledetails.Columns("ToSchedule").Visible = False
        End If

        setStatusButtons()
    End Sub

    Private Sub save()

        saveSchedule()
        saveScheduleDetails()
        saveScheduleMaterial()

    End Sub
    Private Sub saveSchedule()
        BS_Schedule.EndEdit()
        DA_Schedule.Update(Orders1.orderschedule)
        SchChanged = True
    End Sub
    Private Sub saveScheduleDetails()
        BS_scheduleDetails.EndEdit()
        DA_Scheduledetails.Update(Orders1.orderscheduledetails)
        SchChanged = True
    End Sub
    Private Sub saveScheduleMaterial()
        BS_TaskMtrl.EndEdit()
        For Each mtrl As Magod.Orders.Task_MtrlListRow In Orders1.Task_MtrlList.Rows
            mtrl.TaskNo = Orders1.nc_task_list.FindByNcTaskId(mtrl.NcTaskId).TaskNo
        Next
        DA_TaskMaterial.Update(Orders1.Task_MtrlList)
    End Sub
    Private Sub reLoadSchedule()
        'DS_form.Tables("Schedule_PartsList").Clear()
        'DS_form.Tables("Schedule_TaskList").Clear()

        'DA_Scheduledetails.Fill(DS_form, "Schedule_PartsList")
        'DA_Task.Fill(DS_form, "Schedule_TaskList")

        'setScheduleDetailsStatus("Trial")
        'setStatusButtons()
    End Sub
    Private Sub Schedule_FormClosed(ByVal sender As Object, ByVal e As System.Windows.Forms.FormClosedEventArgs) Handles Me.FormClosed
        ClearSchedule()
    End Sub
    Private Sub Form_scheduledetails_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        setDetailsStatuscolor()
        If schRow.Schedule_Status = "Created" Then
            Me.Btn_schedule.Enabled = True
            Me.DGV_TaskMtrl.Enabled = False
            Me.GroupBox_TaskMtrl.Enabled = False
        ElseIf schRow.Schedule_Status = "Tasked" Then
            Me.Btn_schedule.Enabled = False
            Me.DGV_TaskMtrl.Enabled = True
            Me.GroupBox_TaskMtrl.Enabled = True
            SchPath = String.Format("{0}\{1}", OrderPath, Replace(schRow.OrdSchNo, " ", "_"))
            Orders.getDBLink.CheckCreateDir(SchPath, True)
       
        Else
            Me.Btn_schedule.Enabled = False
            Me.DGV_TaskMtrl.Enabled = False
            Me.GroupBox_TaskMtrl.Enabled = False
            SchPath = String.Format("{0}\{1}", OrderPath, Replace(schRow.OrdSchNo, " ", "_"))
            Orders.getDBLink.CheckCreateDir(SchPath, True)

        End If
    End Sub


    Private Sub btnCancel_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCancel.Click
        If schRow.Schedule_Status = "Cancelled" Then
            'setScheduleDetailsStatus()
        ElseIf checkIfCanCancel() Then
            '    '**** For each Schedule Details Set Qty Scheduled to Zero and correspondingly
            '    '**** decrease the Qty Scheduled
            Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getDBLink.getCommand
            Try
                With cmd
                    .Connection.Open()
                    '*** go to Magodmis
                    .CommandText = "Use magodmis;"
                    .ExecuteNonQuery()

                    '*** go to Magodmis
                    .CommandText = "BEGIN;"
                    .ExecuteNonQuery()
                    ''*** go to Magodmis
                    '.CommandText = "SET AUTOCOMMIT=0;"
                    '.ExecuteNonQuery()
                    .Parameters.AddWithValue("@ScheduleId", schRow.ScheduleId)
                    .Parameters.Add("@OrderDetailID", MySqlDbType.Int32)
                    .Parameters.Add("@SchDetailsID", MySqlDbType.Int32)
                    .Parameters.Add("@QtyScheduled", MySqlDbType.Int32)
                    For Each dr As Magod.Orders.orderscheduledetailsRow In _
                           Orders1.orderscheduledetails.Rows
                        .Parameters("@OrderDetailID").Value = dr.OrderDetailID
                        .Parameters("@SchDetailsID").Value = dr.SchDetailsID
                        .Parameters("@QtyScheduled").Value = dr.QtyScheduled
                        '*** Update the Scheduled Quantity in Schedule

                        .CommandText = "UPDATE orderscheduledetails o SET o.`QtyScheduled`=0 " _
                                        & "WHERE o.`SchDetailsID`=@SchDetailsID;"
                        .ExecuteNonQuery()
                        '*** Update the Scheduled qty in Order Deatils

                        .CommandText = "UPDATE order_details o " _
                                & "SET o.`QtyScheduled`=o.`QtyScheduled`-@QtyScheduled " _
                                & "WHERE o.`OrderDetailID`=@OrderDetailID;"
                        .ExecuteNonQuery()

                        .CommandText = "UPDATE orderschedule SET Schedule_Status='Cancelled' " _
                        & "WHERE ScheduleId=@ScheduleId"
                        .ExecuteNonQuery()

                        '**** Delete All Tasks and Parts if Created
                        .CommandText = "DELETE magodmis.t, magodmis.n " _
                        & "FROM magodmis.nc_task_list as n,magodmis.task_partslist  as t " _
                        & "WHERE n.`ScheduleID`=0123 AND t.`NcTaskId`=n.`NcTaskId`;"
                        .ExecuteNonQuery()


                    Next
                    '*** Commit Changes
                    .CommandText = "COMMIT;"
                    .ExecuteNonQuery()

                    schRow.Schedule_Status = "Cancelled"
                End With

            Catch ex As Exception
                MsgBox(ex.Message)
            Finally
                cmd.Connection.Close()
            End Try
            Orders1.orderscheduledetails.Clear()
            DA_Scheduledetails.Fill(Orders1.orderscheduledetails)
        End If
     
    End Sub
    
    ' Suspend Button Function
    Private Sub btnSuspend_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSuspend.Click
        'If Ds.Tables("orderlist").Rows(0).Item("Order_Status") = "Suspended" Then
        '    MsgBox("Clear Order Suspension of the order before trying to clear it for schedule")
        '    Exit Sub
        'End If
        If schRow.Suspend Then
            MsgBox("Clear Order Suspension of the order before trying to clear it for schedule")
            Exit Sub
        End If
        If schRow.Schedule_Status = "Suspended" Then 'Toggle to bring it to current status
            setScheduleDetailsStatus("Trial")
            SupendSchedule(False)
        Else
            schRow.Schedule_Status = "Suspended"
            SupendSchedule(True)
            'Block all Tasks for Production
            'Block all Tasks for Programming
            'Block all Packing and Invoicing
        End If
        updateScheduleTaskYeild(schRow.ScheduleId)
        ' updateScheduleTaskYeild(49992)
        save()
        ' setScheduleDetailsStatus("Trial")
        setStatusButtons()
    End Sub
    Private Sub SupendSchedule(ByVal suspend As Boolean)
        '***** Set Suspended flag to True for tasks, ncprograms and Invoices
        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@ScheduleId", schRow.ScheduleId)
            .Parameters.AddWithValue("@Suspend", suspend)

            .Connection.Open()
            .CommandText = "UPDATE magodmis.nc_task_list n,magodmis.ncprograms n1 SET n.`Suspend`=@Suspend, n1.`Suspend`=@Suspend " _
                            & "WHERE n.`ScheduleID`=@ScheduleId AND n1.`NcTaskId`=n.`NcTaskId`;"
            .ExecuteNonQuery()
            .Connection.Close()

        End With
    End Sub

    ' ShortClose Button Function
    Private Sub btnShotClose_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnShotClose.Click
        If schRow.Schedule_Status <> "ShortClosed" Then

            '**** Process for Short Closing
            If checkIfCanShortClose() Then '**** Check if schedule can be short closed
                '**** reduce Qty Scheduled by qtyScheduled and sent both in order and orderscheduledetails
                Try
                    With Orders.getDBLink.getCommand
                        .Connection.Open()
                        '*** go to Magodmis
                        .Parameters.Clear()
                        .Parameters.Add("@QtyScheduled", MySqlDbType.Int32)
                        .Parameters.AddWithValue("@ScheduleId", schRow.ScheduleId)
                        .Parameters.Add("@OrderDetailId", MySqlDbType.Int32)
                        .CommandText = "UPDATE magodmis.order_details o " _
                                & "SET o.`QtyScheduled`=o.`QtyScheduled`-@QtyScheduled " _
                                & "WHERE o.`OrderDetailID`=@OrderDetailID;"

                        For Each dr As Magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                            .Parameters("@QtyScheduled").Value = dr.QtyScheduled - dr.QtyDelivered
                            .Parameters("@OrderDetailId").Value = dr.OrderDetailID
                            .ExecuteNonQuery()
                        Next
                        .CommandText = "UPDATE orderschedule SET Schedule_Status='ShortClosed' " _
                        & "WHERE ScheduleId=@ScheduleId"
                        .ExecuteNonQuery()

                        '***** mark all tasks as closed
                        .CommandText = "UPDATE magodmis.nc_task_list n SET n.`TStatus`='ShortClosed' WHERE n.`ScheduleID`=@ScheduleId;"
                        .ExecuteNonQuery()

                        .Connection.Close()
                        .Parameters.Clear()
                        schRow.Schedule_Status = "ShortClosed"
                    End With
                Catch ex As Exception
                    MsgBox(ex.Message)
                End Try

            End If
            updateScheduleTaskYeild(schRow.ScheduleId)


        End If


    End Sub
    Private Sub updateScheduleTaskYeild(ByVal ScheduleId As Int32)
        ' Dim SchCount As Integer

        With Orders.getCommand
            .Connection.Open()
            '**** Task Machine Time for Schedule tasks
            '***** Machine and ProcessTime
            '***** get target Machine hour for the machine
            '***** calculate the Cost
            '***** get the Taskwise billing/ JW cost
            '***** get the Task Material used Weight
            '***** get the Taskwise material billing
            Dim taskmachineTime As New Magod.Orders.task_machine_utilisationDataTable
            .CommandText = "SELECT n.`TaskNo`, n.`Machine`, t.`MProcess`, t.`Operation`, " _
                        & "SUM(timestampdiff(minute, n.`FromTime`, n.`ToTime`)) as Minutes " _
                        & "FROM magodmis.ncprogrammachinelog n ,magodmis.nc_task_list t " _
                        & "WHERE t.`ScheduleId` = @ScheduleId and t.`TaskNo`=n.`TaskNo` GROUP BY n.`TaskNo`, n.`Machine`,t.`Operation`;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@ScheduleId", ScheduleId)
            With .Parameters
                .Add("@TaskNo", MySqlDbType.VarChar)
                .Add("@Machine", MySqlDbType.VarChar)
                .Add("@MProcess", MySqlDbType.VarChar)
                .Add("@Operation", MySqlDbType.VarChar)
                .Add("@Minutes", MySqlDbType.UInt32)
                .Add("@Amount", MySqlDbType.Decimal)


            End With
            taskmachineTime.Load(.ExecuteReader)
            .CommandText = "INSERT INTO magod_sales.task_machine_utilisation(TaskNo, Machine, Minutes, Amount) " _
                            & " Values(@TaskNo, @Machine, @Minutes, @Amount) ON DUPLICATE KEY UPDATE Minutes=@Minutes,Amount=@Amount;"
            For Each machineOperation As Magod.Orders.task_machine_utilisationRow In taskmachineTime.Rows
                Dim rate As Decimal = Orders.getMachineRate(machineOperation.Machine, machineOperation.Operation)
                .Parameters("@TaskNo").Value = machineOperation.TaskNo
                .Parameters("@Machine").Value = machineOperation.Machine
                .Parameters("@Minutes").Value = machineOperation.Minutes
                .Parameters("@Amount").Value = Math.Round(machineOperation.Minutes * rate / 60)
                .ExecuteNonQuery()

            Next


            .Connection.Close()
        End With
    End Sub
    Private Sub setStatusButtons()
        If BS_Schedule.List.Count > 0 Then

            Me.DGV_scheduledetails.Columns("QtyScheduled").ReadOnly = True
            Select Case BS_Schedule.Current.item("Schedule_status")
                Case "Scheduled"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = True
                    Me.btnShotClose.Enabled = False
                    Me.btn_Task.Enabled = True
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = True
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                    Me.btn_Fixture.Enabled = True
                    Me.btn_InternalOrder.Enabled = True
                Case "Cancelled"
                    setEditOff()
                    '  Me.btnRefresh.Enabled = False
                Case "Suspended"
                    setEditOff()
                    '  Me.btnRefresh.Enabled = False
                    Me.btnSuspend.Enabled = True
                Case "ShortClosed"
                    setEditOff()
                Case "Closed"
                    setEditOff()

                Case "Tasked"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = True
                    Me.btnShotClose.Enabled = False
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = True
                    Me.btn_checkdxf.Enabled = True
                    Me.DateTimePicker_DelDate.Enabled = True
                    '   Me.btnRefresh.Enabled = False
                    Me.DGV_TaskMtrl.Enabled = True
                    Me.GroupBox_TaskMtrl.Enabled = True
                    Me.btn_Fixture.Enabled = True
                    Me.btn_InternalOrder.Enabled = True
                Case "Created"
                    Me.Btn_schedule.Enabled = True
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = False
                    Me.btnSuspend.Enabled = False
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                    Me.DGV_scheduledetails.Columns("QtyScheduled").ReadOnly = False
                    Me.btn_Fixture.Enabled = False
                    Me.btn_InternalOrder.Enabled = False
                    '   Me.btnRefresh.Enabled = False
                Case "Ready"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                    Me.btn_Fixture.Enabled = False
                    Me.btn_InternalOrder.Enabled = False
                Case "Dispatched"
                    setEditOff()

                Case "Programmed"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True

                Case "Production"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = True
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True

                Case "Completed"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = False
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                    Me.btn_Fixture.Enabled = False
                    Me.btn_InternalOrder.Enabled = False
                    '  Me.btnRefresh.Enabled = False
                Case "Inspected"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = False
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                  
                    '  Me.btnRefresh.Enabled = False
                Case "Completed"
                    Me.Btn_schedule.Enabled = False
                    Me.btnCancel.Enabled = False
                    Me.btnShotClose.Enabled = True
                    Me.btnSuspend.Enabled = True
                    '**** Common Buttons
                    Me.btn_printschedule.Enabled = False
                    Me.btn_checkdxf.Enabled = False
                    Me.DateTimePicker_DelDate.Enabled = True
                
                    '  Me.btnRefresh.Enabled = False
                Case Else

                    'If Ds.Tables("indentlist").Rows.Count > 0 Then
                    '    Me.btnSaveMtrlIndent.Enabled = False
                    '    Me.btnPlaceIndent.Enabled = False
                    '    Me.btn_deleteMaterial.Enabled = False
                    'End If
            End Select
        End If
    End Sub
    Private Sub setEditOff()
        Me.Btn_schedule.Enabled = False
        Me.btnCancel.Enabled = False
        Me.btnShotClose.Enabled = False
        Me.btnSuspend.Enabled = False
        '**** Common Buttons
        Me.btn_printschedule.Enabled = False
        Me.btn_checkdxf.Enabled = False

        Me.btnSave.Enabled = False
        Me.DateTimePicker_DelDate.Enabled = False


    End Sub

    Private Function checkIfCanCancel() As Boolean
        '***** if at least one srl is invoiced the schedule can be short closed
        Dim msg As String
        msg = "Cannot Cancel Schedules Once Programmed" _
            & vbCrLf & "Recall all programmes, material and cancel all programs before cancelling schedule" _
            & vbCrLf & "You can also ShortClose the schedule by Invoicing allParts manufactured "

        Dim result As Integer = result = Orders1.orderscheduledetails.Compute("Count(SchDetailsID)", "QtyProgrammed>0")

        If result > 0 Then
            Return False
        Else
            Return True
        End If
      
    End Function

    Private Function checkIfCanShortClose() As Boolean
        '***** if at least one srl is invoiced the schedule can be short closed
        '****** If all quantity produced is invoiced or rejected 
        '***** you can short close schedule, else invoice prduced parts and close schedule

        Dim result As Integer
        result = Orders1.orderscheduledetails.Compute("Count(SchDetailsID)", "QtyProduced<>QtyDelivered+QtyRejected")

        Try


            If result = 0 Then
                Return True
            Else
                MsgBox(" Eiether all quantity produced must be dispatched " _
                & vbCrLf & " OR Balance Quantity must be recorded as 'Rejected'")
                Return False
            End If
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Function

' Save Button
    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        setScheduleDetailsStatus("Trial")
        save()
    End Sub

    Private Sub btn_OpenDc_Click(sender As Object, e As EventArgs) Handles btn_OpenDc.Click
        If BS_PnList.List.Count > 0 Then
            '***** Open only if Dispatched, Closed
            If BS_PnList.Current.item("DCStatus") = "Despatched" Or BS_PnList.Current.item("DCStatus") = "Closed" Then

                Using X As New magodInvoice(BS_PnList.Current.item("DC_Inv_No"))
                    X.ShowDialog()
                End Using
            End If
        End If


    End Sub

    Private Sub DateTimePicker_DelDate_Enter(ByVal sender As Object, ByVal e As System.EventArgs) Handles DateTimePicker_DelDate.Enter
        DelDate = Me.DateTimePicker_DelDate.Value
        'MsgBox(DelDate)
    End Sub
    
    ' Check status Button Function
    Private Sub btn_checkdxf_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_checkdxf.Click
        setDetailsStatuscolor()
    End Sub


    Private Sub DateTimePicker_DelDate_ValueChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles DateTimePicker_DelDate.ValueChanged
        'If FormOK And Not (Me.Text_schedulestatus.Text <> "Created" _
        '    Or Me.Text_schedulestatus.Text <> "Cancelled" _
        '    Or Me.Text_schedulestatus.Text <> "Supended" _
        '    Or Me.Text_schedulestatus.Text <> "ShortClosed") Then

        '    If Me.DateTimePicker_DelDate.Value < Md.getToday Then
        '        MsgBox("Cannot choose a delivery date less than today")
        '        If DelDate > Md.getToday Then
        '            Me.DateTimePicker_DelDate.Value = DelDate
        '        Else
        '            Me.DateTimePicker_DelDate.Value = Md.getToday
        '        End If
        '        'save()
        '    End If
        'End If
    End Sub



    Private Sub btn_printschedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_printschedule.Click

        showSchedule()
    End Sub
#End Region

 

    Private Sub TabControl1_Selected(ByVal sender As Object, ByVal e As System.Windows.Forms.TabControlEventArgs) Handles TabControl1.Selected
        If Not Me.TabControl1 Is Nothing Then
            'If Me.TabControl1.TabPages. = 0 Then
            '    setScheduleDetailsStatus()
            'End If
            If Me.TabControl1.SelectedTab.Name = "TabPage1" Then
                setDetailsStatuscolor()
            End If
            ' MsgBox(Me.TabControl1.SelectedTab.Name)
        End If
    End Sub


    Private Sub TabControl1_TabIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TabControl1.TabIndexChanged

    End Sub



    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_SaveTaskMtrl.Click
        BS_TaskMtrl.EndEdit()
        saveScheduleMaterial()
        'DA_TaskMaterial.Update(Orders1.Task_MtrlList)
        'Orders1.Task_MtrlList.Clear()
        'DA_TaskMaterial.Fill(Orders1.Task_MtrlList)
        'saveScheduleMaterial()
    End Sub

   
    Private Sub btnDXFWS_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnDXFWS.Click
        If Not schRow.Schedule_Status = "Created" Then
            MsgBox("Cannot check material requirement once scheduled")
            Exit Sub

        End If
        If createTempTask() Then
            MS.CreateAndReadWS()
            setTempTaskPara()

        End If

    End Sub
    Private Function createTempTask() As Boolean
        '***** clear Temp Details
        Try
            Orders2.Clear()
            With Orders2
                For Each row As Magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
                    .orderschedule.ImportRow(row)
                Next
                For Each row As Magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                    .orderscheduledetails.ImportRow(row)
                Next

            End With
            Dim tasks = (From part In Orders2.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
            Dim TaskNo As Int16 = 1
            Dim strTaskNo As String

            For Each task In tasks
                strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, task.Mtrl_Code, task.Mtrl_Source, task.MProcess, task.Operation))

                Dim newTask As Magod.Orders.nc_task_listRow = Orders2.nc_task_list.Newnc_task_listRow

                newTask.ScheduleID = schRow.ScheduleId
                newTask.Cust_code = schRow.Cust_Code
                newTask.order_No = schRow.Order_No
                If schRow.IsOrdSchNoNull Then
                    newTask.ScheduleNo = schRow.Order_No & " 00"
                Else
                    newTask.ScheduleNo = schRow.OrdSchNo
                End If
                'newTask.ScheduleNo = schRow.OrdSchNo
                newTask.DeliveryDate = schRow.Delivery_Date


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

                Dim taskParts = From Part In Orders1.orderscheduledetails _
                                Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                newTask.NoOfDwgs = taskParts.Count

                Dim taskPartQty As Int32 = 0
                For Each part In taskParts
                    Dim taskPart As Magod.Orders.Task_PartsListRow = Orders2.Task_PartsList.NewTask_PartsListRow
                    With taskPart
                        .DwgName = part.DwgName
                        .NcTaskId = newTask.NcTaskId
                        .QtyToNest = part.QtyToSchedule
                        .TaskNo = newTask.TaskNo
                        .SchDetailsId = part.SchDetailsID
                        taskPartQty += part.QtyScheduled
                    End With
                    Orders2.Task_PartsList.AddTask_PartsListRow(taskPart)
                Next
                newTask.TotalParts = taskPartQty
                TaskNo += 1
            Next


            Dim SigmaTask As Magod.SigmaNest.SigmaNestData.TaskListRow
            Dim SigmaPart As Magod.SigmaNest.SigmaNestData.TaskPartsRow
            If MS Is Nothing Then
                MS = New magod.SigmaNest.magod_sigma(SnVersion)
            End If
            set_sigmanestPath()
            With MS
                .DxfPath = OrderPath & "\DXF\"
                .WSPath = OrderPath & "\Material_" & schRow.Order_No & ".ws"
                .PartsPath = CustFolderPath & "\" & BS_Schedule.Current.item("dwgloc") & "\Parts\"
                .WO = SchNo
                .Customer = schRow.Cust_name
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

        Catch ex As Exception
            MsgBox(ex.Message)
            Return False
        End Try
    End Function

    Private Function setTempTaskPara()
        '**** get Sigmanest Parameters and up date Task and Task part Parameters
        Try
            '***** for Each Part in TaskPartTable
            For Each SigmaTask As Magod.SigmaNest.SigmaNestData.TaskListRow In MS.getData.TaskList.Rows
                Console.WriteLine(String.Format("TaskId={0} ******** ", SigmaTask.TaskId))
                Dim task As Magod.Orders.nc_task_listRow = Orders2.nc_task_list.FindByNcTaskId(SigmaTask.TaskId)
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
                Orders2.Task_MtrlList.Clear()
                For Each snTaskNest As Magod.SigmaNest.SigmaNestData.TaskNestsRow In MS.getData.TaskNests
                    Dim mtrl As Magod.Orders.Task_MtrlListRow = Orders2.Task_MtrlList.NewTask_MtrlListRow
                    With snTaskNest
                        mtrl.Length = .NestX
                        mtrl.Width = .NestY
                        mtrl.Quantity = .NoOfSheets
                        mtrl.NcTaskId = .TaskId
                        Orders2.Task_MtrlList.AddTask_MtrlListRow(mtrl)
                    End With
                Next

                For Each part As Magod.SigmaNest.SigmaNestData.TaskPartsRow In MS.getData.TaskParts.Select(String.Format("TaskId={0}", SigmaTask.TaskId))
                    Dim taskPart As Magod.Orders.Task_PartsListRow = Orders2.Task_PartsList.FindByTask_Part_ID(part.PartMagodUid)
                    If Not taskPart Is Nothing Then
                        taskPart.QtyNested = part.QtyNested
                        taskPart.LOC = part.PartLOC
                        'taskPart.NoofPierces = part.PartPierces
                        'taskPart.PartNetArea = part.NetArea
                        'taskPart.Complexity = part.Complexity
                        taskPart.OutOpen = part.OutOpen
                        '  taskPart.OpenContour = part.OpenCounter
                        'taskPart.PartOutArea = part.OutArea
                        'taskPart.PartRectArea = part.RectArea
                        'taskPart.PartX = part.PartX
                        'taskPart.PartY = part.PartY


                    End If
                    ' QtnData1.taskDetails.AddtaskDetailsRow(taskPart)
                Next

            Next



            Return True


        Catch ex As Exception
            MsgBox(ex.Message)
            Return False
        End Try

        Return True


    End Function

    Private Sub btn_ReadWS_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_ReadWS.Click
        If Not schRow.Schedule_Status = "Created" Then
            MsgBox("Cannot check material requirement once scheduled")
            Exit Sub

        End If
        If createTempTask() Then
            Me.Cursor = Cursors.WaitCursor
            If System.IO.File.Exists(OrderPath & "\Material_" & schRow.Order_No & ".ws") Then
                MS.ReadSigmaWS()

                setTempTaskPara()
            Else
                MsgBox("Create WS before Reading It")
            End If
            Me.Cursor = Cursors.Default

        End If
    End Sub

    Private Sub btnCreatePartsWS_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCreatePartsWS.Click
        If Not schRow.Schedule_Status = "Created" Then
            MsgBox("Cannot check material requirement once scheduled")
            Exit Sub

        End If
        If createTempTask() Then
            MS.CreateWSParts()
            MS.ReadSigmaWS()
            setTempTaskPara()

        End If
    End Sub


' Button Task Function
    Private Sub btn_Task_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Task.Click
        If MsgBox("Do you wish to create production tasks", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Select Case schRow.Type
                Case "Profile"
                    CreateScheduleTasksProfile()
                Case "Service"
                    CreateScheduleTasksService()
                Case "Fabrication"
                    CreateScheduleTasksFabrication()
            End Select
        End If
    End Sub

    Private Sub btn_NCProgram_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_NCProgram.Click

        If Orders1.nc_task_list.Rows.Count = 0 Then
            MsgBox("Schedule / Create Tasks before trying to create production programs")
            Exit Sub
        End If
        If schRow.Type = "Profile" Then


            magod_Nc_Sigma_Programmer.NCPgm.StartupPath = Application.StartupPath
            magod_Nc_Sigma_Programmer.NCPgm.UserName = "production"
            magod_Nc_Sigma_Programmer.NCPgm.PassWord = "production"
            magod_Nc_Sigma_Programmer.NCPgm.Function = "Production"
            magod_Nc_Sigma_Programmer.NCPgm.SetUp()

            Using X As New magod_Nc_Sigma_Programmer.Form_SigmaProgramming(schRow.ScheduleId)
                X.ShowDialog()
                refreshSchedule()
            End Using
        ElseIf schRow.Type = "Service" Then
            Using X As New NCProgramNo_Alloter(BsTask.Current.item("NcTaskId"))
                X.ShowDialog()
            End Using
        ElseIf schRow.Type = "Fabrication" Then

        End If

    End Sub

  
    Private Sub btn_TaskPerformance_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_TaskPerformance.Click
        Dim schLog As New Magod.Analytics.MachineLogBookDataTable
        Dim schTaskList As New Magod.Analytics.nc_task_listDataTable
        schTaskList.Clear()
        With Orders.getCommand
            .CommandText = "SELECT n.`NcTaskId`, n.`TaskNo`,SUM(d1.`Qty`* d1.`JW_Rate`) as JWValue, SUM(d1.`Qty`* d1.`Mtrl_rate`) as MaterialValue, " _
                            & " n.`TaskNo`, n.`Mtrl_Code`, n.`MTRL`, n.`Thickness`, n.`Operation`,SUM(d1.`Qty`* o.`LOC`) as TotalLOC, SUM(d1.`Qty`* o.`Holes`) as TotalHoles " _
                            & "FROM magodmis.draft_dc_inv_register d,magodmis.draft_dc_inv_details d1,magodmis.orderscheduledetails o,magodmis.nc_task_list n " _
                            & "WHERE d.`ScheduleId`=@ScheduleId AND d1.`DC_Inv_No`=d.`DC_Inv_No` AND o.`SchDetailsID`=d1.`OrderSchDetailsID`" _
                            & "AND n.`NcTaskId`=o.`NcTaskId`  GROUP BY n.`NcTaskId;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@ScheduleId", intSchId)
            .Connection.Open()
            schTaskList.Load(.ExecuteReader)

            .CommandText = " SELECT s.*, n.`NcTaskId` FROM magodmis.nc_task_list n,magodmis.ncprograms n1,magodmis.shiftlogbook s " _
                         & "WHERE  n.`NcTaskId`=n1.`NcTaskId` AND n.`ScheduleID`=@ScheduleID AND s.`StoppageID`=n1.`Ncid`;"

            schLog.Clear()
            schLog.Load(.ExecuteReader)
            .Connection.Close()
        End With
        For Each task In schTaskList
            Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).JWValue = task.JWValue
            Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).MaterialValue = task.MaterialValue

        Next
        Dim TaskMachineTime = From log In schLog Group By log.TaskNo, log.NcTaskId Into taskGp _
                              = Group, taskTime = Sum(DateDiff(DateInterval.Minute, log.FromTime, log.ToTime)) _
                              Select TaskNo, NcTaskId, taskTime, MachineList = From machine In taskGp _
                            Group By machine.Machine Into machineGp _
                             = Group, machineTime = Sum(DateDiff(DateInterval.Minute, machine.FromTime, machine.ToTime))



        For Each task In TaskMachineTime
            If Not IsDBNull(task.taskTime) Then


                Dim machineTimeValue As Decimal = 0
                Dim ops As String = Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).Operation

                For Each Machin In task.MachineList
                    Dim machineTgtValue As Integer = (getMachineOperationHrRate(Machin.Machine, ops) * Machin.machineTime) / 60
                    machineTimeValue += machineTgtValue
                Next

                Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).MachineTime = Math.Round(task.taskTime / 60, 2)
                Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).MachineHourValue = machineTimeValue
                If Not Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).JWValue.Equals("Not Invoiced") Then
                    Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).HourRate _
                                  = Math.Round(Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).JWValue / _
                                  Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).MachineTime, 0)
                    Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).TargetHourRate _
                                = Math.Round(machineTimeValue / _
                                Orders1.nc_task_list.FindByNcTaskId(task.NcTaskId).MachineTime, 0)
                End If

            End If
        Next




        With DGV_taskList
            .Columns("MachineTime").Visible = True
            .Columns("TargetHourRate").Visible = True
            .Columns("HourRate").Visible = True

        End With
    End Sub

    Private Sub btn_InternalOrder_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_InternalOrder.Click
        '***** Only One Order can be placed for schedule
        '***** 8 series for Sales
        '***** if it for  profiles for Fabrication Create a 7 series Order
        '****  if it is for fabrication it has to be 6 Series
        Dim msg = "Do you wish to create or use internal order for this schedule"
        If MsgBox(msg, MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Dim ProfileTable As New magod.Orders.Order_ListDataTable
            With Orders.getCommand
                .Parameters.Clear()
                .CommandText = "SELECT * FROM magodmis.order_list i WHERE i.`ScheduleId` =@ScheduleId AND i.`Order-Ref`='Profile';"
                .Parameters.AddWithValue("@ScheduleId", schRow.ScheduleId)

                .Connection.Open()
                ProfileTable.Load(.ExecuteReader)
                .Connection.Close()
            End With
            '**** Check if Created else Create else Open
            Dim OrderNo As String
            If ProfileTable.Rows.Count = 0 Then
                Dim SQL As New System.Text.StringBuilder
                Dim cmd As MySqlCommand = Orders.getCommand

                Dim srlNo As New magod.Voucher
                With srlNo
                    .VoucherType = "internalProfile"
                    .VoucherCreationRequsetDate = Today
                    .ReviewPeriod = magod.ReviewPeriod.Never
                    .ResetValue = 700000
                    .VoucherNoLength = 6
                    .RunningNoTableName = "magod_runningno"
                    .DataSchema = "magod_setup"
                    .EffectiveFrom = Today
                    .UnitName = Orders.UnitName
                    .setCommand(cmd)
                    .checkCreateRunningNo()
                    .checkIfVoucherTypeExists()
                End With
                Try

                    With cmd
                        With SQL
                            .Append("INSERT INTO magodmis.order_list(order_no,order_date ,cust_code ,contact_name ,Type, ")
                            .Append(" delivery_date , purchase_order , order_received_by, salescontact, recordedby, dealing_engineer , order_status , special_instructions ,")
                            .Append(" payment , ordervalue , materialvalue , billing_address , delivery , del_place , del_mode , `Order-Ref` , order_type , register ,qtnno,ScheduleId ) ")
                            .Append("VALUES ")
                            .Append("(@order_no,Now() ,@cust_code ,@contact_name ,@Type,")
                            .Append(" @delivery_date , @purchase_order , @order_received_by, @salescontact, @recordedby, @dealing_engineer , @order_status , @special_instructions ,")
                            .Append(" @payment , @ordervalue , @materialvalue , @billing_address , @delivery , @del_place , @del_mode , @OrderRef , @order_type , @register ,@qtnno,@ScheduleId ) ")
                        End With

                        .Connection.Open()
                        Dim NextSrl As String = srlNo.getNextSrl()
                        OrderNo = NextSrl
                        With .Parameters
                            .Clear()
                            .AddWithValue("@order_no", OrderNo)
                            .AddWithValue("@cust_code", schRow.Cust_Code)
                            .AddWithValue("@contact_name", schRow.Dealing_Engineer)
                            '.AddWithValue("@delivery_date", Me.TextBox_Address.Text)
                            .AddWithValue("@purchase_order", schRow.PO)
                            .AddWithValue("@order_received_by", schRow.Dealing_Engineer)
                            .AddWithValue("@salescontact", schRow.Dealing_Engineer)
                            .AddWithValue("@recordedby", schRow.Dealing_Engineer)
                            .AddWithValue("@dealing_engineer", schRow.Dealing_Engineer)
                            .AddWithValue("@order_status", "Recorded")
                            .AddWithValue("@special_instructions", String.Format("Profile Order : Schedule {0}", schRow.OrdSchNo))
                            .AddWithValue("@delivery_date", Me.DateTimePicker_DelDate.Value)
                            .AddWithValue("@payment", "ByOrder")
                            .AddWithValue("@ordervalue", 0)
                            .AddWithValue("@materialvalue", 0)
                            .AddWithValue("@billing_address", "Magod Laser")

                            .AddWithValue("@delivery", False)
                            .AddWithValue("@del_place", "Shop Floor")
                            .AddWithValue("@del_mode", "By Hand")
                            .AddWithValue("@OrderRef", "Profile")
                            ' .AddWithValue("@payment", Me.cmbTptCharge.Text)
                            .AddWithValue("@order_type", "Scheduled")
                            .AddWithValue("@register", 0)
                            .AddWithValue("@qtnno", "None")
                            .AddWithValue("@Type", "Profile")
                            .AddWithValue("@ScheduleId", schRow.ScheduleId)
                        End With


                        cmd.CommandText = "START TRANSACTION"
                        .ExecuteNonQuery()

                        .CommandText = SQL.ToString
                        .ExecuteNonQuery()

                        srlNo.setNext()
                        .CommandText = "COMMIT;"
                        .ExecuteNonQuery()
                        cmd.Connection.Close()
                        ' Me.txt_orderno.Text = OrderNo
                        Orders.getDBLink.create_order_folder(OrderNo)

                        Me.btnSave.Enabled = False
                        MsgBox("Order Created")



                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                    Exit Sub
                Finally
                    cmd.Connection.Close()
                End Try

            Else
                OrderNo = ProfileTable.First.Order_No
            End If
            Using X As New Order(OrderNo)
                X.ShowDialog()
            End Using
        End If

    End Sub

    Private Sub btn_Fixture_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Fixture.Click
        '***** Only One Order can be placed for schedule
        '***** 8 series for Sales
        '***** if it for  profiles for Fabrication Create a 7 series Order
        '****  if it is for fabrication it has to be 6 Series
        Dim msg = "Do you wish to create or use internal order for this schedule"
        If MsgBox(msg, MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Dim ProfileTable As New magod.Orders.Order_ListDataTable
            With Orders.getCommand
                .Parameters.Clear()
                .CommandText = "SELECT * FROM magodmis.order_list i WHERE i.`ScheduleId` =@ScheduleId  AND i.`Order-Ref`='Fixture';"
                .Parameters.AddWithValue("@ScheduleId", schRow.ScheduleId)

                .Connection.Open()
                ProfileTable.Load(.ExecuteReader)
                .Connection.Close()
            End With
            '**** Check if Created else Create else Open
            Dim OrderNo As String
            If ProfileTable.Rows.Count = 0 Then
                Dim SQL As New System.Text.StringBuilder
                Dim cmd As MySqlCommand = Orders.getCommand

                Dim srlNo As New magod.Voucher
                With srlNo
                    .VoucherType = "internalFixture"
                    .VoucherCreationRequsetDate = Today
                    .ReviewPeriod = magod.ReviewPeriod.Never
                    .ResetValue = 600000
                    .VoucherNoLength = 6
                    .RunningNoTableName = "magod_runningno"
                    .DataSchema = "magod_setup"
                    .EffectiveFrom = Today
                    .UnitName = Orders.UnitName
                    .setCommand(cmd)
                    .checkCreateRunningNo()
                    .checkIfVoucherTypeExists()
                End With
                Try

                    With cmd
                        With SQL
                            .Append("INSERT INTO magodmis.order_list(order_no,order_date ,cust_code ,contact_name ,Type, ")
                            .Append(" delivery_date , purchase_order , order_received_by, salescontact, recordedby, dealing_engineer , order_status , special_instructions ,")
                            .Append(" payment , ordervalue , materialvalue , billing_address , delivery , del_place , del_mode , `Order-Ref` , order_type , register ,qtnno,ScheduleId ) ")
                            .Append("VALUES ")
                            .Append("(@order_no,Now() ,@cust_code ,@contact_name ,@Type,")
                            .Append(" @delivery_date , @purchase_order , @order_received_by, @salescontact, @recordedby, @dealing_engineer , @order_status , @special_instructions ,")
                            .Append(" @payment , @ordervalue , @materialvalue , @billing_address , @delivery , @del_place , @del_mode , @OrderRef , @order_type , @register ,@qtnno,@ScheduleId ) ")
                        End With

                        .Connection.Open()
                        Dim NextSrl As String = srlNo.getNextSrl()
                        OrderNo = NextSrl
                        With .Parameters
                            .Clear()
                            .AddWithValue("@order_no", OrderNo)
                            .AddWithValue("@cust_code", schRow.Cust_Code)
                            .AddWithValue("@contact_name", schRow.Dealing_Engineer)
                            '.AddWithValue("@delivery_date", Me.TextBox_Address.Text)
                            .AddWithValue("@purchase_order", schRow.PO)
                            .AddWithValue("@order_received_by", schRow.Dealing_Engineer)
                            .AddWithValue("@salescontact", schRow.Dealing_Engineer)
                            .AddWithValue("@recordedby", schRow.Dealing_Engineer)
                            .AddWithValue("@dealing_engineer", schRow.Dealing_Engineer)
                            .AddWithValue("@order_status", "Recorded")
                            .AddWithValue("@special_instructions", String.Format("Profile Order : Schedule {0}", schRow.OrdSchNo))
                            .AddWithValue("@delivery_date", Me.DateTimePicker_DelDate.Value)
                            .AddWithValue("@payment", "ByOrder")
                            .AddWithValue("@ordervalue", 0)
                            .AddWithValue("@materialvalue", 0)
                            .AddWithValue("@billing_address", "Magod Laser")

                            .AddWithValue("@delivery", False)
                            .AddWithValue("@del_place", "Shop Floor")
                            .AddWithValue("@del_mode", "By Hand")
                            .AddWithValue("@OrderRef", "Fixture")
                            ' .AddWithValue("@payment", Me.cmbTptCharge.Text)
                            .AddWithValue("@order_type", "Scheduled")
                            .AddWithValue("@register", 0)
                            .AddWithValue("@qtnno", "None")
                            .AddWithValue("@Type", "Profile")
                            .AddWithValue("@ScheduleId", schRow.ScheduleId)
                        End With


                        cmd.CommandText = "START TRANSACTION"
                        .ExecuteNonQuery()

                        .CommandText = SQL.ToString
                        .ExecuteNonQuery()

                        srlNo.setNext()
                        .CommandText = "COMMIT;"
                        .ExecuteNonQuery()
                        cmd.Connection.Close()
                        ' Me.txt_orderno.Text = OrderNo
                        Orders.getDBLink.create_order_folder(OrderNo)

                        Me.btnSave.Enabled = False
                        MsgBox("Order Created")



                    End With

                Catch ex As Exception
                    MsgBox(ex.Message)
                    Exit Sub
                Finally
                    cmd.Connection.Close()
                End Try

            Else
                OrderNo = ProfileTable.First.Order_No
            End If
            Using X As New Order(OrderNo)
                X.ShowDialog()
            End Using
        End If

    End Sub

    Private Sub btnShowDXF_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnShowDXF.Click
        'Dim dxfFile As String = DGV_scheduledetails.CurrentRow.Cells("DwgName").Value

        'Dim filename As String = OrderPath & "\DXF\" & dxfFile & ".dxf"
        'If File.Exists(filename) Then
        '    Using X As New magod.DXF.DxfView(filename)
        '        X.ShowDialog()
        '    End Using
        'Else
        '    MsgBox(filename & " does not exist ")
        'End If

    End Sub
End Class


' ---------------------------------------------------------------------------------------------------------------------------------

Public Class NCProgramNo_Alloter
    Private DA_NcTask, DA_NCProgram As MySql.Data.MySqlClient.MySqlDataAdapter
    Private NcTaskId As Int32
    Private Task As Magod.NCProgramming.TaskListRow
    Private TaskPart As magod.NCProgramming.Task_PartsListRow

    Public Sub New(ByVal _NcTaskId As Int32)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

        NcTaskId = _NcTaskId

        '**** this opens up the production program creator for Service Tasks
        '*** If Task has BOM set to True then the material is in Parts
        '**** else it is the Task Part ID itself



        setupData()
    End Sub
    Private Sub setupData()


        DA_NcTask = Orders.getDBLink.getMySqlDataAdopter
        With DA_NcTask
            With .SelectCommand
                't.`NcTaskId`, t.`DwgName` FROM magodmis.task_partslist t
                .CommandText = "SELECT n.*,t.DwgName as AssyName FROM magodmis.nc_task_list n,magodmis.task_partslist t " _
                & "WHERE n.`NcTaskId`=@NcTaskId AND t.`NcTaskId`=n.`NcTaskId`"
                .Parameters.AddWithValue("@NcTaskId", NcTaskId)
            End With
            .Fill(NcProgramming1.TaskList)
            Task = NcProgramming1.TaskList.FindByNcTaskId(NcTaskId)
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.nc_task_list n SET n.`TStatus` =@TStatus, n.`Machine`=@Machine WHERE n.`NcTaskId`=@NcTaskId;"
                .Parameters.AddWithValue("@NcTaskId", NcTaskId)
                .Parameters.Add("@TStatus", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "TStatus")
                .Parameters.Add("@Machine", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "Machine")
            End With
        End With

        DA_NCProgram = Orders.getDBLink.getMySqlDataAdopter
        With DA_NCProgram
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.ncprograms n WHERE n.`NcTaskId`=@NcTaskId;"
                .Parameters.AddWithValue("@NcTaskId", NcTaskId)

            End With
            .Fill(NcProgramming1.TaskProgramList)
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.ncprograms SET PStatus=@PStatus WHERE NcId=@NcId;"
                .Parameters.Add("@PStatus", MySql.Data.MySqlClient.MySqlDbType.VarChar, 40, "PStatus")
                .Parameters.Add("@NcId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "NcId")
            End With

            With .DeleteCommand
                .CommandText = "DELETE FROM magodmis.ncprograms  WHERE NcId=@NcId;"
                .Parameters.Add("@NcId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "NcId")

            End With
        End With

        If Not NcProgramming1.TaskList.Rows.Count = 0 Then
            With Orders.getCommand
                .Parameters.Clear()
                '**** get Machines for this Operation
                .CommandText = "SELECT m.`RefProcess`,  m1.* FROM machine_data.machine_process_list m, machine_data.machine_list m1 " _
                                & "WHERE m.`RefProcess`=@RefProcess AND m1.`Machine_srl`=m.`Machine_srl`;"
                .Parameters.AddWithValue("@RefProcess", NcProgramming1.TaskList.Rows(0).Item("Operation"))
                .Parameters.AddWithValue("@NcTaskId", NcTaskId)

                .Connection.Open()
                NcProgramming1.MachineList.Load(.ExecuteReader)
                '**** Status of Task Parts
                .CommandText = "UPDATE magodmis.task_partslist t, (SELECT Sum(n.`TotQtyNested`-n.`QtyRejected`) as TotalQtyNested," _
                            & "n.`Task_Part_Id` FROM magodmis.ncprogram_partslist n,magodmis.ncprograms n1  WHERE n.`NCId`=n1.`NCId` " _
                            & "AND n1.`NcTaskId`=@NcTaskId GROUP BY n.`Task_Part_Id`) as A SET t.`QtyNested`=A.TotalQtyNested " _
                            & "WHERE A.`Task_Part_Id`=t.`Task_Part_ID` AND t.`NcTaskId`=@NcTaskId ;"
                .ExecuteNonQuery()
                .CommandText = "SELECT * FROM magodmis.task_partslist t WHERE t.`NcTaskId`=@NcTaskId;"
                NcProgramming1.Task_PartsList.Load(.ExecuteReader)

                TaskPart = NcProgramming1.Task_PartsList.First

                '  Task.AssyName = TaskPart.DwgName
                .Connection.Close()
                Me.Label_Material.Text = String.Format("{0} / {1}", NcProgramming1.TaskList.Rows(0).Item("CustMtrl"), NcProgramming1.TaskList.Rows(0).Item("Mtrl_Code"))
            End With
        End If
        '****** get the Parts List for the Assy and parts required for it
        Dim sql As New System.Text.StringBuilder
        '****** If Service task has BOM select Parts of BOM Else Select Task Parts as
        With sql
            .Append(" SELECT    c2.`PartId`,c1.`Quantity` as QtyPerAssy, c2.`Id` As CustBOM_Id, t.`Task_Part_ID`,t.`QtyNested`*c1.`Quantity` as QtyRequired ")
            .Append("FROM magodmis.task_partslist t,magodmis.orderscheduledetails o,magodmis.cust_assy_data c,")
            .Append("magodmis.cust_assy_bom_list c1,magodmis.cust_bomlist c2 ")
            .Append("WHERE t.`NcTaskId`=@NcTaskId and t.`HasBOM`and t.`SchDetailsId`=o.`SchDetailsID` ")
            .Append("AND c.`MagodCode` = o.`Dwg_Code` AND c1.`Cust_AssyId`=c.`Id` AND c1.`Cust_BOM_ListId`=c2.`Id`;")
        End With

        With Orders.getCommand
            .CommandText = "SELECT t.`HasBOM` FROM magodmis.task_partslist t WHERE t.`NcTaskId` =@NcTaskId;"

            .Connection.Open()
            Dim hasBOM As Boolean = .ExecuteScalar
            If hasBOM Then
                '*********** if Task Part has a BOM then select the List of BOM available
                .CommandText = sql.ToString
            Else
                '*********** if Task Part is Single Part Service then select the the Part Details Qty To Nest as requirement
                .CommandText = "SELECT  o.`DwgName` as PartID ,1 as QtyPerAssy,c.`Id` as CustBOM_Id,t.Task_Part_ID, t.QtyToNest as QtyRequired " _
                              & "FROM magodmis.task_partslist t,magodmis.orderscheduledetails o,magodmis.cust_bomlist c " _
                              & "WHERE o.`SchDetailsID`=t.`SchDetailsId` AND t.`NcTaskId`=@NcTaskId AND c.`MagodPartId`=o.`Dwg_Code`;"

            End If
            NcProgramming1.TaskAssy_BOMList.Load(.ExecuteReader)

            '***** update availbility
            .CommandText = "SELECT  Sum(cast(m.`QtyAccepted`- m.`QtyIssued` as Signed))  as QtyAvialable " _
                        & "FROM magodmis.mtrl_part_receipt_details m WHERE m.`CustBOM_Id` =@CustBOM_Id"
            'SELECT CAST(CAST(1-2 AS UNSIGNED) AS SIGNED);
            .Parameters.Clear()
            .Parameters.Add("@CustBOM_Id", MySql.Data.MySqlClient.MySqlDbType.Int32)
            For Each part As magod.NCProgramming.TaskAssy_BOMListRow In NcProgramming1.TaskAssy_BOMList.Rows
                .Parameters("@CustBOM_Id").Value = part.CustBOM_Id
                Dim qtyAvailable As Integer = .ExecuteScalar
                If qtyAvailable < 0 Then
                    MsgBox(String.Format("Part Id {0} Qty Available is less than Zero, Check with Admin", qtyAvailable))
                Else
                    part.QtyAvialable = .ExecuteScalar
                End If

            Next
            .Connection.Close()
        End With
    End Sub

    Private Sub btn_Save_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Save.Click
        SaveTask()
       
    End Sub
    Private Sub SaveTask()
        BS_NcTask.EndEdit()
        DA_NcTask.Update(NcProgramming1.TaskList)
        BS_NCPgmes.EndEdit()
        DA_NCProgram.Update(NcProgramming1.TaskProgramList)
        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.Add("@NCId", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Parameters.AddWithValue("@Task_Part_Id", TaskPart.Task_Part_ID)
            .Parameters.Add("@TotQtyNested", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Parameters.Add("@EstimatedTime", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Parameters.Add("@TotalLOC", MySql.Data.MySqlClient.MySqlDbType.Double)
            .Parameters.Add("@TotalHoles", MySql.Data.MySqlClient.MySqlDbType.Int24)
            .Parameters.Add("@PStatus", MySql.Data.MySqlClient.MySqlDbType.VarChar)


            Dim updateNCProgram As String = "UPDATE magodmis.ncprograms n SET n.`Qty`=@TotQtyNested ," _
            & " n.`TotalParts`=@TotQtyNested, n.`EstimatedTime`=@EstimatedTime, n.`TotalHoles`=@TotalHoles,n.`TotalLOC`=@TotalLOC, n.`PStatus`=@PStatus WHERE n.`NCId`=@NCId "
            Dim UpdateNCPgmPart As String = "UPDATE magodmis.ncprogram_partslist n SET n.`TotQtyNested`=@TotQtyNested ,n.`Sheets`=@TotQtyNested " _
                            & "WHERE n.`NCId`=@NCId AND n.`Task_Part_Id`=@Task_Part_Id; "

            .Connection.Open()
            For Each ncprogramme As Magod.NCProgramming.TaskProgramListRow In NcProgramming1.TaskProgramList.Rows
                .Parameters("@NCId").Value = ncprogramme.Ncid
                .Parameters("@TotQtyNested").Value = ncprogramme.Qty
                .Parameters("@EstimatedTime").Value = ncprogramme.EstimatedTime
                .Parameters("@TotalLOC").Value = ncprogramme.TotalLOC
                .Parameters("@TotalHoles").Value = ncprogramme.TotalHoles
                .Parameters("@PStatus").Value = ncprogramme.PStatus

                .CommandText = updateNCProgram
                .ExecuteNonQuery()
                .CommandText = UpdateNCPgmPart
                .ExecuteNonQuery()

            Next
            .CommandText = "UPDATE magodmis.task_partslist t, (SELECT Sum(n.`TotQtyNested`-n.`QtyRejected`) as TotalQtyNested," _
                      & "n.`Task_Part_Id` FROM magodmis.ncprogram_partslist n,magodmis.ncprograms n1  WHERE n.`NCId`=n1.`NCId` " _
                      & "AND n1.`NcTaskId`=@NcTaskId GROUP BY n.`Task_Part_Id`) as A SET t.`QtyNested`=A.TotalQtyNested " _
                      & "WHERE A.`Task_Part_Id`=t.`Task_Part_ID` AND t.`NcTaskId`=@NcTaskId ;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@NcTaskId", NcTaskId)

            .ExecuteNonQuery()
            NcProgramming1.Task_PartsList.Clear()
            .CommandText = "SELECT * FROM magodmis.task_partslist t WHERE t.`NcTaskId`=@NcTaskId;"
            NcProgramming1.Task_PartsList.Load(.ExecuteReader)
            TaskPart = NcProgramming1.Task_PartsList.Rows(0)
            .Connection.Close()
        End With
    End Sub

    ' ADD NCProgram
    Private Sub btn_AddProgram_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_AddProgram.Click
        If Not TaskPart.QtyToNest > TaskPart.QtyNested Then
            MsgBox("Quantity Tasked has already been programmed")
            Exit Sub
        End If
        Dim Task As magod.NCProgramming.TaskListRow = NcProgramming1.TaskList.FindByNcTaskId(NcTaskId)
        If Task.Operation = "Fabrication" Then
            MsgBox("Program Number applicable for Single Operation Only")
            Exit Sub
        End If
        If Task.IsMachineNull Then
            MsgBox("Machine for task Not selected, Select Machine")
            Exit Sub

        End If
        Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getDBLink.getCommand
        Dim newNCProgram As magod.NCProgramming.TaskProgramListRow = NcProgramming1.TaskProgramList.NewTaskProgramListRow
        ' Dim intNCId, NcProgramNo As Integer

        Dim srlNo As New magod.Voucher
        With srlNo
            .VoucherType = "NcProgramNo"
            .VoucherCreationRequsetDate = Today
            .ReviewPeriod = magod.ReviewPeriod.Never
            .ResetValue = 100000
            .VoucherNoLength = 6
            .RunningNoTableName = "magod_runningno"
            .DataSchema = "magod_setup"
            .EffectiveFrom = Today
            .UnitName = Orders.UnitName
            .setCommand(cmd)
            .checkCreateRunningNo()
            .checkIfVoucherTypeExists()

        End With
        With newNCProgram
            .TaskNo = Task.TaskNo
            .Cust_Code = Task.Cust_code
            .CustMtrl = Task.CustMtrl
            .Machine = Task.Machine
            .MProcess = Task.MProcess
            .Mtrl_Code = Task.Mtrl_Code
            .NcTaskId = Task.NcTaskId
            .NoOfDwgs = Task.NoOfDwgs
            .TotalParts = Task.TotalParts
            .PStatus = "Created"
            .Priority = "Normal"
            .Qty = TaskPart.QtyToNest - TaskPart.QtyNested
            .Operation = Task.Operation
            .HasBOM = TaskPart.HasBOM
            .Shape = "Units"
        End With
        Try
            With cmd
                .Connection.Open()
                Dim strNCProgramNo = srlNo.getNextSrl()
                cmd.CommandText = "START TRANSACTION"
                .ExecuteNonQuery()

                '**** Insert A Program to the List
                cmd.CommandText = "INSERT INTO " _
              & "magodmis.ncprograms( `NcTaskId`,`TaskNo`,`NCProgramNo`,  `Qty`,`TotalParts`," _
              & "`Machine`, `Mprocess`,`Operation`, `Mtrl_code`,`Cust_code`,`CustMtrl`, `DeliveryDate`," _
              & "`pstatus`,`NoOfDwgs`,`HasBOM`,`Shape`)  " _
              & "Values(@NcTaskId,@TaskNo,@NCProgramNo,@Qty,@TotalParts,@Machine,@Mprocess,@Operation," _
              & "@Mtrl_code,@Cust_code,@CustMtrl,@DeliveryDate," _
              & "'Created',@NoOfDwgs,@HasBOM,@Shape);"

                With cmd.Parameters
                    .Clear()
                    .AddWithValue("@NcTaskId", Task.NcTaskId)
                    .AddWithValue("@Taskno", newNCProgram.TaskNo)
                    .AddWithValue("@Qty", newNCProgram.Qty)
                    .AddWithValue("@TotalParts", newNCProgram.Qty)
                    .AddWithValue("@Machine", newNCProgram.Machine)
                    .AddWithValue("@Operation", newNCProgram.Operation)
                    .AddWithValue("@Mprocess", newNCProgram.MProcess)
                    .AddWithValue("@Mtrl_code", newNCProgram.Mtrl_Code)
                    .AddWithValue("@Shape", newNCProgram.Shape)
                    .AddWithValue("@Cust_code", newNCProgram.Cust_Code)
                    .AddWithValue("@CustMtrl", newNCProgram.CustMtrl)
                    If Task.IsDeliveryDateNull Then
                        .AddWithValue("@DeliveryDate", Nothing)
                    Else
                        .AddWithValue("@DeliveryDate", Task.DeliveryDate)
                    End If
                    '  .AddWithValue("@DeliveryDate", task.DeliveryDate)

                    .AddWithValue("@NoOfDwgs", newNCProgram.NoOfDwgs)
                    .AddWithValue("@NcProgramNo", strNCProgramNo)
                    If NcProgramming1.TaskAssy_BOMList.Rows.Count > 0 Then
                        .AddWithValue("@HasBOM", 1)
                    Else
                        .AddWithValue("@HasBOM", 0)
                    End If

                End With

                cmd.ExecuteNonQuery()

                '*** To retrieve the NCId we need to call the last insertid
                cmd.CommandText = "SELECT LAST_INSERT_ID();"
                newNCProgram.Ncid = cmd.ExecuteScalar
                newNCProgram.NCProgramNo = strNCProgramNo
                srlNo.setNext()

                '***** Insert NcProgram Part List
                .CommandText = "INSERT INTO magodmis.ncprogram_partslist(NcProgramNo, TaskNo, DwgName, PartID, QtyNested, " _
                & "Sheets,  TotQtyNested, Task_Part_Id, NCId,HasBOM) VALUES(@NcProgramNo, @TaskNo, @DwgName, 1, 1, " _
                & "@Sheets,  @TotQtyNested, @Task_Part_Id, @NCId,@HasBOM); "

                With cmd.Parameters
                    .Clear()
                    .AddWithValue("@NcProgramNo", strNCProgramNo)
                    .AddWithValue("@Taskno", newNCProgram.TaskNo)
                    .AddWithValue("@DwgName", TaskPart.DwgName)
                    .AddWithValue("@Sheets", newNCProgram.Qty)
                    .AddWithValue("@TotQtyNested", newNCProgram.Qty)
                    .AddWithValue("@Task_Part_Id", TaskPart.Task_Part_ID)
                    .AddWithValue("@NCId", newNCProgram.Ncid)
                    .AddWithValue("@NcTaskId", Task.NcTaskId)
                    .AddWithValue("@HasBOM", newNCProgram.HasBOM)
                End With
                .ExecuteNonQuery()


                cmd.CommandText = "COMMIT;"
                cmd.ExecuteNonQuery()

                NcProgramming1.TaskProgramList.AddTaskProgramListRow(newNCProgram)
                newNCProgram.AcceptChanges()

                .CommandText = "UPDATE magodmis.task_partslist t, (SELECT Sum(n.`TotQtyNested`-n.`QtyRejected`) as TotalQtyNested," _
                           & "n.`Task_Part_Id` FROM magodmis.ncprogram_partslist n,magodmis.ncprograms n1  WHERE n.`NCId`=n1.`NCId` " _
                           & "AND n1.`NcTaskId`=@NcTaskId GROUP BY n.`Task_Part_Id`) as A SET t.`QtyNested`=A.TotalQtyNested " _
                           & "WHERE A.`Task_Part_Id`=t.`Task_Part_ID` AND t.`NcTaskId`=@NcTaskId ;"
                .Parameters.Clear()
                .Parameters.AddWithValue("@NcTaskId", Task.NcTaskId)

                .ExecuteNonQuery()
                NcProgramming1.Task_PartsList.Clear()
                .CommandText = "SELECT * FROM magodmis.task_partslist t WHERE t.`NcTaskId`=@NcTaskId;"
                NcProgramming1.Task_PartsList.Load(.ExecuteReader)
                TaskPart = NcProgramming1.Task_PartsList.Rows(0)

            End With
        Catch ex As Exception
            MsgBox(ex.Message)

            cmd.CommandText = "ROLLBACK;"
            cmd.ExecuteNonQuery()
        Finally
            cmd.Connection.Close()
            cmd.Parameters.Clear()
            cmd.CommandText = ""
        End Try
       

    End Sub
  
    Private Sub NCProgramNo_Alloter_FormClosing(ByVal sender As Object, ByVal e As System.Windows.Forms.FormClosingEventArgs) Handles Me.FormClosing
        SaveTask()
    End Sub

    Private Sub btn_MtrlIssue_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_MtrlIssue.Click
        Dim msg As String = String.Format("Do you wish to release program no {0} to Material Issue?", Me.DataGridView1.CurrentRow.Cells("NCProgramNo").Value)

        If MsgBox(msg, MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Me.DataGridView1.CurrentRow.Cells("PStatus").Value = "Mtrl Issue"
            BS_NCPgmes.EndEdit()
            setProgramStatus(Me.DataGridView1.CurrentRow.Index)
         
        End If
        'NCProgramNo

    End Sub

    Private Sub DataGridView1_RowEnter(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DataGridView1.RowEnter
        If Not Me.DataGridView1.Rows(e.RowIndex) Is Nothing Then
           
            setProgramStatus(e.RowIndex)
        End If

    End Sub

    Private Sub Btn_deleteProgram_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_deleteProgram.Click
        Dim msg As String = String.Format("Do you wish to Delete program no {0} ?", Me.DataGridView1.CurrentRow.Cells("NCProgramNo").Value)

        If MsgBox(msg, MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Me.DataGridView1.Rows.Remove(Me.DataGridView1.CurrentRow)
            If Not Me.DataGridView1.CurrentRow Is Nothing Then
                setProgramStatus(Me.DataGridView1.CurrentRow.Index)
            End If

            BS_NCPgmes.EndEdit()
            SaveTask()
          
        End If
    End Sub

    Private Sub setProgramStatus(ByVal rowNo As Int16)
        If Me.DataGridView1.Rows(rowNo).Cells("PStatus").Value = "Created" Then
            Me.btn_MtrlIssue.Enabled = True
            Me.Btn_deleteProgram.Enabled = True
            Me.DataGridView1.Rows(rowNo).ReadOnly = False
        Else
            Me.btn_MtrlIssue.Enabled = False
            Me.Btn_deleteProgram.Enabled = False
            Me.DataGridView1.Rows(rowNo).ReadOnly = True
        End If

    End Sub
End Class