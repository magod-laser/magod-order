Imports System.Data.Odbc
Imports System.Windows.Forms
Imports System.Drawing
Public Class CombScheduleCreator
    ' Dim args() As String = {"Sales", "sales", "Sales"}
    'Dim DS As DataSet
    'Dim MD As New Magod.dataSetUp
    Dim combSchNo As String
    Dim flagCombSchCreated As Boolean
    Dim da_schList, da_SelectedSchDetails As MySql.Data.MySqlClient.MySqlDataAdapter
    Private Da_CombSchedule, Da_CombSchDetails, Da_CombParts As MySql.Data.MySqlClient.MySqlDataAdapter
    Dim intSrl As Integer = 1
    Dim intCmbSchId As Integer
#Region "SettingUp"


    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()
        ' Add any initialization after the InitializeComponent() call.

        BS_Cust.DataSource = Orders.CustList
        BS_SalesExec.DataSource = Orders.salesExecList


        SetDA_SchList()
        setDA_da_SelectedSchDetails()

        setDa_CombinedSchedule()

    End Sub
    Private Sub SetDA_SchList()
        da_schList = Orders.getDBLink.getMySqlDataAdopter
        With da_schList
            With .SelectCommand
                .CommandText = "SELECT o.* FROM magodmis.orderschedule o " _
                               & "WHERE  o.`Schedule_Status` ='Tasked' AND o.`Cust_Code`=@Cust_Code AND o.`PO` not like 'Combined' " _
                               & "AND o.`Type`='Profile' AND o.`ScheduleType`= 'Job Work' ;"

                .Parameters.Add("@Cust_Code", MySql.Data.MySqlClient.MySqlDbType.VarChar)
            End With
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.orderschedule o SET o.`Delivery_Date`=@Delivery_Date, o.`Dealing_Engineer`=@Dealing_Engineer," _
                                & "o.`Special_Instructions`=@Special_Instructions WHERE o.`ScheduleId`=@ScheduleId"
                .Parameters.Add("@Delivery_Date", MySql.Data.MySqlClient.MySqlDbType.Date, 20, "Delivery_Date")
                .Parameters.Add("@Dealing_Engineer", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "Dealing_Engineer")
                .Parameters.Add("@Special_Instructions", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Special_Instructions")
                .Parameters.Add("@ScheduleId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "ScheduleId")

            End With
        End With
    End Sub
    Private Sub setDA_da_SelectedSchDetails()
        da_SelectedSchDetails = Orders.getDBLink.getMySqlDataAdopter
        With da_SelectedSchDetails
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.orderscheduledetails WHERE scheduleid=@scheduleid;"
                .Parameters.Add("@scheduleid", MySql.Data.MySqlClient.MySqlDbType.Int32)
                'CombScheduleDetails
            End With
        End With
    End Sub
    Private Sub setDa_CombinedSchedule()
        Da_CombSchedule = Orders.getDBLink.getMySqlDataAdopter
        With Da_CombSchedule
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.combined_schedule c WHERE c.`CmbSchID`=@CmbSchID"
                .Parameters.Add("@CmbSchID", MySql.Data.MySqlClient.MySqlDbType.Int32)
            End With

        End With
        Da_CombSchDetails = Orders.getDBLink.getMySqlDataAdopter
        With Da_CombSchDetails
            With .InsertCommand
                .CommandText = "INSERT INTO magodmis.combined_schedule_details " _
                          & "(cmbSchId,ScheduleId,OrderSchNo,CSSrl) Values(@cmbSchId,@ScheduleId,@OrderSchNo,@CSSrl);"
                With .Parameters
                    .Clear()
                    .Add("@cmbschId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "cmbschId")
                    .Add("@ScheduleId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "ScheduleId")
                    .Add("@OrderSchNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "OrderSchNo")
                    .Add("@CSSrl", MySql.Data.MySqlClient.MySqlDbType.Int32, 3, "CSSrl")
                End With
            End With
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.combined_schedule_details c WHERE c.`cmbSchId`=@cmbSchId"
                .Parameters.Add("@cmbSchId", MySql.Data.MySqlClient.MySqlDbType.Int32)
            End With
        End With

        Da_CombParts = Orders.getDBLink.getMySqlDataAdopter
        With Da_CombParts
            With .SelectCommand
                .CommandText = "SELECT * FROM magodmis.combined_schedule_part_details c WHERE c.`cmbSchId`;"
                .Parameters.Add("@cmbSchId", MySql.Data.MySqlClient.MySqlDbType.Int32)

            End With
            With .InsertCommand

                .CommandText = "INSERT INTO magodmis.combined_schedule_part_details " _
                                & "(cmbSchID, CS_Part_Srl,cmbSchDetailsID, o_SchDetailsId, Scheduleid,DwgName, Mtrl_Code, MProcess, Mtrl_Source, QtyScheduled,Cust_code,Operation ) " _
                                & "Values(@cmbSchID, @CS_Part_Srl,@cmbSchDetailsID, @o_SchDetailsId, @Scheduleid,@DwgName, @Mtrl_Code, @MProcess, @Mtrl_Source, @QtyScheduled,@Cust_code,@Operation);"

                With .Parameters
                    .Clear()
                    .Add("@cmbSchID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "cmbSchID")
                    .Add("@Scheduleid", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "Scheduleid")
                    .Add("@o_SchDetailsId", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "o_SchDetailsId")
                    .Add("@CS_Part_Srl", MySql.Data.MySqlClient.MySqlDbType.Int32, 3, "CS_Part_Srl")
                    .Add("@cmbSchDetailsID", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "cmbSchDetailsID")
                    .Add("@DwgName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 150, "DwgName")
                    .Add("@Mtrl_Code", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Mtrl_Code")
                    .Add("@MProcess", MySql.Data.MySqlClient.MySqlDbType.VarChar, 20, "MProcess")
                    .Add("@Mtrl_Source", MySql.Data.MySqlClient.MySqlDbType.VarChar, 10, "Mtrl_Source")
                    .Add("@QtyScheduled", MySql.Data.MySqlClient.MySqlDbType.Int32, 20, "QtyScheduled")
                    .Add("@Cust_code", MySql.Data.MySqlClient.MySqlDbType.VarChar, 10, "Cust_code")

                    .Add("@Operation", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "Operation")

                End With
            End With
        End With


    End Sub
#End Region

#Region "Customer selection"
   

    Private Sub ComboBox_Cust_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ComboBox_Cust.SelectedIndexChanged
        If Not ComboBox_Cust Is Nothing Then
            If Not ComboBox_Cust.SelectedIndex = -1 Then
                loadCustData()
            End If

        End If

    End Sub
    Private Sub loadCustData()
        Try
            Orders1.Clear()

            da_schList.SelectCommand.Parameters("@Cust_Code").Value = Me.ComboBox_Cust.SelectedValue
            da_schList.Fill(Orders1.orderschedule)

            intSrl = 1
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

#End Region

#Region "Combined Schedule Creation"

    Private Sub Btn_PrepareSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_PrepareSchedule.Click

        With Orders.getCommand
            .Parameters.Clear()
            .CommandText = "SELECT o.`SchDetailsID`, o.`OrderDetailID`, o.`ScheduleId`, o.`Order_No`, " _
            & "o.`ScheduleNo`, o.`OrderScheduleNo`, o.`Cust_Code`, o.`Dwg_Code`, o.`DwgName`, o.`Mtrl_Code`, " _
            & "o.`Mtrl`, o.`Material`, o.`MProcess`, o.`Mtrl_Source`, o.`InspLevel`, o.`QtyScheduled`, o.`Operation` " _
            & "FROM magodmis.orderscheduledetails o WHERE scheduleid=@scheduleid;"
            .Parameters.Add("@scheduleid", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Connection.Open()
            ' CombOrders.Clear()
            For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Select("Selected")
                .Parameters("@scheduleid").Value = sch.ScheduleId
                Try
                    CombOrders.orderscheduledetails.Load(.ExecuteReader)
                Catch ex As System.Data.ConstraintException

                Catch ex As Exception
                    MsgBox(ex.Message)
                End Try

            Next
            .Connection.Close()
        End With

    End Sub

    Private Sub btn_createCombSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_createCombSchedule.Click
        For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Select("Selected=False")
            sch.Delete()
        Next
        CombOrders.orderschedule.AcceptChanges()
        CombOrders.orderscheduledetails.AcceptChanges()
        If CombOrders.orderschedule.Rows.Count > 1 Then
            If Not CombOrders.orderschedule.Select("Selected").Length > 1 Then
                MsgBox("Cannot Combine One Schedule, select more than one")
                Exit Sub
            End If
            Dim newCmbSch As magod.Orders.combined_scheduleRow = CombOrders.combined_schedule.Newcombined_scheduleRow

            '***** Creates a new combined schedule 
            If InsertCombinedSchedule(newCmbSch) Then
                If AllotAndTaskCombinedSchedule(newCmbSch) Then
                    '***Update Selected Schedules and Tasks as Combined 
                    With Orders.getCommand
                        .Connection.Open()
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@Schedule_Status", String.Format("Comb /{0}", newCmbSch.combined_schedule_no))
                        .Parameters.Add("@ScheduleID", MySql.Data.MySqlClient.MySqlDbType.Int32)
                        For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Select("Selected")

                            .CommandText = "UPDATE magodmis.orderschedule o,magodmis.nc_task_list o1 " _
                            & "SET o.`Schedule_Status`=@Schedule_Status, o1.`TStatus`='Combined' " _
                                            & "WHERE  o.`ScheduleID`=@ScheduleID AND o1.`scheduleId`=o.`ScheduleID`;"
                            .Parameters("@ScheduleID").Value = sch.ScheduleId
                            .ExecuteNonQuery()
                            sch.Delete()
                        Next
                        .Connection.Close()
                    End With
                    CombOrders.orderschedule.AcceptChanges()
                    CombOrders.orderscheduledetails.AcceptChanges()
                    '**** set the Status to Combined in respective Schedules
                    '**** Requery the schedules
                    BS_SelectedSchedules.EndEdit()
                    da_schList.Update(CombOrders.orderschedule)
                    If CreateScheduleTasks() Then
                        MsgBox("Combined Scheduled Tasked")
                    End If
                    Me.btn_createCombSchedule.Enabled = False
                End If
            End If


        Else
            MsgBox("Cannot combine one or less schedules")
            Exit Sub
        End If


    End Sub



    Private Function InsertCombinedSchedule(ByRef newCmbSch As magod.Orders.combined_scheduleRow) As Boolean

        With newCmbSch
            .cmb_schDate = Today
            .Cust_Code = BS_Cust.Current.item("Cust_Code")
            .combined_schedule_no = "Draft"
            CombOrders.combined_schedule.Addcombined_scheduleRow(newCmbSch)
            With Orders.getCommand
                '******** Create Combined Schedule Main
                .CommandText = "INSERT INTO magodmis.combined_schedule(Cust_code) values(@Cust_code);"
                .Parameters.AddWithValue("@Cust_code", newCmbSch.Cust_Code)
                .Connection.Open()
                .ExecuteNonQuery()
                .CommandText = "select last_insert_id() as cmbschid;"
                newCmbSch.CmbSchID = .ExecuteScalar

                newCmbSch.AcceptChanges()
            End With
            '******* Insert Selected Schedules into Details
            Dim intCsSrl As Int16 = 1
            For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Select("Selected")
                Dim newComSchDetail As magod.Orders.combined_schedule_detailsRow = CombOrders.combined_schedule_details.Newcombined_schedule_detailsRow
                With newComSchDetail
                    .cmbSchId = newCmbSch.CmbSchID
                    .ScheduleID = sch.ScheduleId
                    .CSSrl = intCsSrl
                    intCsSrl += 1
                End With
                CombOrders.combined_schedule_details.Addcombined_schedule_detailsRow(newComSchDetail)
                With Orders.getCommand
                    .CommandText = "INSERT INTO magodmis.combined_schedule_details " _
                        & "(cmbSchId,ScheduleId,OrderSchNo,CSSrl) Values(@cmbSchId,@ScheduleId,@OrderSchNo,@CSSrl);"
                    With .Parameters
                        .Clear()
                        .AddWithValue("@cmbSchId", newCmbSch.CmbSchID)
                        .AddWithValue("@ScheduleId", newComSchDetail.ScheduleID)
                        .AddWithValue("@OrderSchNo", sch.OrdSchNo)
                        .AddWithValue("@CSSrl", newComSchDetail.CSSrl)
                    End With
                    .ExecuteNonQuery()
                    .CommandText = "select last_insert_id();"
                    newComSchDetail.cmbSchDetailsID = .ExecuteScalar
                    newComSchDetail.AcceptChanges()
                End With
                For Each part As magod.Orders.orderscheduledetailsRow In CombOrders.orderscheduledetails.Select(String.Format("ScheduleId={0}", sch.ScheduleId))

                    Dim cmbPart As magod.Orders.combined_schedule_part_detailsRow = CombOrders.combined_schedule_part_details.Newcombined_schedule_part_detailsRow
                    With cmbPart
                        .cmbSchId = newCmbSch.CmbSchID
                        .ScheduleID = sch.ScheduleId
                        .O_SchDetailsID = part.SchDetailsID
                        .cmbSchDetailsID = newComSchDetail.cmbSchDetailsID
                        .DwgName = part.DwgName
                        .Cust_Code = part.Cust_Code
                        .Mtrl_Code = part.Mtrl_Code
                        .Operation = part.Operation
                        .MProcess = part.MProcess
                        .Mtrl_Source = part.Mtrl_Source
                        .InspLevel = part.InspLevel
                        .QtyScheduled = part.QtyScheduled

                    End With
                    CombOrders.combined_schedule_part_details.Addcombined_schedule_part_detailsRow(cmbPart)

                Next


            Next
            Orders.getCommand.Connection.Close()
            Da_CombParts.Update(CombOrders.combined_schedule_part_details)
        End With
        Return True
    End Function
    Private Function AllotAndTaskCombinedSchedule(ByRef newCmbSch As magod.Orders.combined_scheduleRow) As Boolean
        With newCmbSch
            Dim SQL As New System.Text.StringBuilder
            Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getCommand

            Dim srlNo As New magod.Voucher
            With srlNo
                .VoucherType = "CombinedSchedule_JW"
                .VoucherCreationRequsetDate = Today
                .ReviewPeriod = magod.ReviewPeriod.Never
                .ResetValue = 1000
                .VoucherNoLength = 4
                .RunningNoTableName = "magod_runningno"
                .DataSchema = "magod_setup"
                .EffectiveFrom = Today
                .UnitName = Orders.UnitName
                .setCommand(cmd)
                .checkCreateRunningNo()
                .checkIfVoucherTypeExists()
            End With
            With SQL
                .Append("UPDATE magodmis.combined_schedule c SET c.`combined_schedule_no`=@combined_schedule_no WHERE c.`CmbSchID`=@CmbSchID")

            End With

            With cmd
                .Connection.Open()
                Dim NextSrl As String = srlNo.getNextSrl()
                Dim combined_schedule_no = "99" & NextSrl

                With .Parameters
                    .Clear()
                    .AddWithValue("@CmbSchID", newCmbSch.CmbSchID)
                    .AddWithValue("@combined_schedule_no", combined_schedule_no)

                End With


                cmd.CommandText = "START TRANSACTION"
                .ExecuteNonQuery()

                .CommandText = SQL.ToString
                .ExecuteNonQuery()

                srlNo.setNext()
                .CommandText = "COMMIT;"
                .ExecuteNonQuery()

                newCmbSch.combined_schedule_no = combined_schedule_no
                '   proRow.ProformaDate = srlNo.VoucherCreationRequsetDate
                newCmbSch.AcceptChanges()
                MsgBox("Combined Order " & combined_schedule_no & " Created")



                '****** create Production Schedule

                Dim combSch As magod.Orders.orderscheduleRow = CombOrders.orderschedule.NeworderscheduleRow
                With combSch
                    .Order_No = combined_schedule_no
                    .ScheduleNo = "01"
                    .OrdSchNo = combined_schedule_no & " 01"
                    .Cust_Code = newCmbSch.Cust_Code
                    .ScheduleDate = Today
                    .schTgtDate = DTP_TgtDate.Value
                    .TgtDelDate = DTP_TgtDate.Value
                    .Delivery_Date = DTP_TgtDate.Value
                    .SalesContact = ComboBox_Sales.SelectedValue
                    .Dealing_Engineer = ComboBox_Sales.SelectedValue
                    .PO = "Combined"
                    .ScheduleType = "Combined"
                    .Schedule_Status = "Created"
                    .Cust_name = Orders.getCustData(.Cust_Code).Cust_name
                    .Type = "Profile"

                End With


                With .Parameters
                    .Clear()
                    .AddWithValue("@Order_no", combSch.Order_No)
                    .AddWithValue("@ScheduleNo", "01")
                    .AddWithValue("@Cust_Code", combSch.Cust_Code)
                    .AddWithValue("@ScheduleDate", Today)
                    .AddWithValue("@schTgtDate", combSch.TgtDelDate)
                    .AddWithValue("@Delivery_date", combSch.TgtDelDate)
                    .AddWithValue("@SalesContact", combSch.SalesContact)
                    .AddWithValue("@Dealing_engineer", combSch.Dealing_Engineer)
                    .AddWithValue("@PO", combSch.PO)
                    .AddWithValue("@ScheduleType", combSch.PO)
                    .AddWithValue("@ordschno", combSch.OrdSchNo)
                    .AddWithValue("@Type", combSch.Type)

                End With
                SQL = New System.Text.StringBuilder
                With SQL
                    .Append("INSERT INTO magodmis.orderschedule ")
                    .Append("(Order_no,ScheduleNo,Cust_Code,ScheduleDate,schTgtDate,")
                    .Append("Delivery_date, SalesContact, Dealing_engineer,PO,ScheduleType,ordschno,Type) ")
                    .Append("VALUES")
                    .Append("(@Order_no,@ScheduleNo,@Cust_Code,@ScheduleDate,@schTgtDate,")
                    .Append("@Delivery_date, @SalesContact, @Dealing_engineer,@PO,@ScheduleType,@ordschno,@Type) ")

                End With

                .CommandText = SQL.ToString
                .ExecuteNonQuery()
                .CommandText = "SELECT LAST_INSERT_ID();"

                combSch.ScheduleId = .ExecuteScalar
                CombOrders.orderschedule.AddorderscheduleRow(combSch)


                .Parameters.AddWithValue("@ScheduleID", combSch.ScheduleId)
                .Parameters.AddWithValue("@CmbSchID", newCmbSch.CmbSchID)
                .CommandText = "UPDATE magodmis.combined_schedule c SET c.`ScheduleID`=@ScheduleID WHERE c.`CmbSchID`=@CmbSchID"
                .ExecuteNonQuery()

                MsgBox("Combined Schedule " & combSch.OrdSchNo & " Created")


                '****** Insert Schedule Details
                Dim combSchPart = From part In CombOrders.combined_schedule_part_details _
                                                Group By Mtrl_Code = part.Mtrl_Code, _
                                                         MProcess = part.MProcess, _
                                                          Operation = part.Operation, _
                                                         DwgName = part.DwgName, _
                                                         Mtrl_Source = part.Mtrl_Source _
                                                         Into g = Group _
                                                      Select New With {.DwgName = DwgName, _
                                                      .Mtrl_Code = Mtrl_Code, _
                                                      .MProcess = MProcess, _
                                                      .Mtrl_Source = Mtrl_Source, _
                                                      .Operation = Operation, _
                                                      .QtyScheduled = g.Sum(Function(i) i.QtyScheduled) _
                                                      }
                Dim schPart As magod.Orders.orderscheduledetailsRow
                Dim insertSQL As String
                Dim updateSQL As String
                SQL = New System.Text.StringBuilder

                With SQL
                    .Append("INSERT INTO magodmis.orderscheduledetails")
                    .Append("(`scheduleid`,`scheduleno`,`DwgName`,`Mtrl_Code`,`Mtrl_Source`,`MProcess`,`QtyScheduled`,`cust_code`,`Operation` ) ")
                    .Append("VALUES ")
                    .Append("(@scheduleid,@scheduleno,@DwgName,@Mtrl_Code,@Mtrl_Source,@MProcess,@QtyScheduled,@cust_code,@Operation ); ")
                End With
                insertSQL = SQL.ToString

                SQL = New System.Text.StringBuilder

                With SQL
                    .Append(" UPDATE  magodmis.combined_schedule_part_details c ")
                    .Append("SET c.`N_SchDetailsId`=@N_SchDetailsId ")
                    .Append("WHERE c.`cmbSchID`=@cmbSchID AND c.`DwgName`=@DwgName AND c.`Mtrl_Code`= @Mtrl_Code ")
                    .Append("AND c.`MProcess`=@MProcess AND c.`Mtrl_Source`=@Mtrl_Source AND c.`Operation`=@Operation  ;")

                End With
                updateSQL = SQL.ToString
                With .Parameters
                    .Clear()
                    .Add("@scheduleid", MySql.Data.MySqlClient.MySqlDbType.Int32)
                    .Add("@scheduleno", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@DwgName", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@Mtrl_Code", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@Mtrl_Source", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@MProcess", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@Operation", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@cust_code", MySql.Data.MySqlClient.MySqlDbType.VarChar)
                    .Add("@QtyScheduled", MySql.Data.MySqlClient.MySqlDbType.Int32)
                    .Add("@cmbSchID", MySql.Data.MySqlClient.MySqlDbType.Int32)
                    .Add("@N_SchDetailsId", MySql.Data.MySqlClient.MySqlDbType.Int32)
                End With

                For Each part In combSchPart
                    schPart = CombOrders.orderscheduledetails.NeworderscheduledetailsRow
                    With schPart
                        .ScheduleId = combSch.ScheduleId
                        .OrderScheduleNo = combSch.OrdSchNo
                        .ScheduleNo = combSch.ScheduleNo
                        .Cust_Code = combSch.Cust_Code
                        .DwgName = part.DwgName
                        .MProcess = part.MProcess
                        .Operation = part.Operation
                        .Mtrl_Code = part.Mtrl_Code
                        .Mtrl_Source = part.Mtrl_Source
                        .QtyScheduled = part.QtyScheduled
                    End With
                    .CommandText = insertSQL
                    .Parameters("@scheduleid").Value = schPart.ScheduleId
                    .Parameters("@scheduleno").Value = schPart.OrderScheduleNo
                    .Parameters("@DwgName").Value = schPart.DwgName
                    .Parameters("@Mtrl_Code").Value = schPart.Mtrl_Code
                    .Parameters("@Mtrl_Source").Value = schPart.Mtrl_Source
                    .Parameters("@MProcess").Value = schPart.MProcess
                    .Parameters("@Operation").Value = schPart.Operation
                    .Parameters("@cust_code").Value = schPart.Cust_Code
                    .Parameters("@QtyScheduled").Value = schPart.QtyScheduled
                    .Parameters("@cmbSchID").Value = newCmbSch.CmbSchID
                    ''   .Parameters("@N_SchDetailsId").Value = schPart
                    .ExecuteNonQuery()

                    .CommandText = "SELECT Last_Insert_Id();"
                    schPart.SchDetailsID = .ExecuteScalar
                    CombOrders.orderscheduledetails.AddorderscheduledetailsRow(schPart)
                    schPart.AcceptChanges()

                    .Parameters("@N_SchDetailsId").Value = schPart.SchDetailsID
                    .CommandText = updateSQL
                    .ExecuteNonQuery()


                Next


                .Connection.Close()
            End With

        End With
        Return True
    End Function

    Private Sub btnSelectSch_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSelectSch.Click
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
            sch.Selected = True
        Next
    End Sub



    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        BS_SelectedSchedules.EndEdit()
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Rows
            sch.Selected = Not sch.Selected
        Next
    End Sub

    Private Sub Button3_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button3.Click
        For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Rows
            sch.Selected = True
        Next
    End Sub

    Private Sub Button2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button2.Click
        BS_SelectedSchedules.EndEdit()
        For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Rows
            sch.Selected = Not sch.Selected
        Next
    End Sub

    Private Sub Button4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button4.Click
        BS_SchList.EndEdit()
        For Each sch As magod.Orders.orderscheduleRow In Orders1.orderschedule.Select("Selected")
            Dim addsch As magod.Orders.orderscheduleRow = CombOrders.orderschedule.NeworderscheduleRow
            Try
                With addsch
                    CombOrders.orderschedule.ImportRow(sch)
                End With
            Catch ex As System.Data.ConstraintException

            Catch ex As Exception
                MsgBox(ex.Message)
            End Try
            '  CombOrders.orderschedule.AddorderscheduleRow(addsch)
        Next
    End Sub

    Private Sub Button5_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button5.Click
        For Each sch As magod.Orders.orderscheduleRow In CombOrders.orderschedule.Select("Selected")
            sch.Delete()
        Next
        CombOrders.orderschedule.AcceptChanges()
    End Sub

    Private Sub btn_Schedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Schedule.Click
        BS_SelectedSchedules.EndEdit()
        da_schList.Update(CombOrders.orderschedule)
        If CreateScheduleTasks() Then
            MsgBox("Combined Scheduled Tasked")
        End If
    End Sub
    Private Function CreateScheduleTasks() As Boolean
        '***** Delete all old Tasks
        '****** first group according to parameters
        '****** Create Tasks
        '****** add Task Details
        'Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code,  part.MProcess,part.Operation, part.Mtrl_Source, part.Tolerance, part.InspLevel).Distinct()
        Dim tasks = (From part In CombOrders.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
        Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getDBLink.getCommand
        Dim TaskNo As Int16 = 1
        Dim strTaskNo As String
        Dim SchRow As magod.Orders.orderscheduleRow = CombOrders.orderschedule.Rows(0)
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
                    CombOrders.Task_PartsList.Clear()
                    CombOrders.nc_task_list.Clear()
                    .CommandText = "DELETE FROM nc_task_list WHERE ScheduleID=@ScheduleID;"
                    .Parameters.AddWithValue("@ScheduleID", SchRow.ScheduleId)
                    .ExecuteNonQuery()

                    For Each task In tasks
                        strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                        Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, task.Mtrl_Code, task.Mtrl_Source, task.MProcess, task.Operation))

                        Dim newTask As magod.Orders.nc_task_listRow = CombOrders.nc_task_list.Newnc_task_listRow

                        newTask.ScheduleID = SchRow.ScheduleId
                        newTask.Cust_code = SchRow.Cust_Code
                        newTask.order_No = SchRow.Order_No
                        If SchRow.IsOrdSchNoNull Then
                            newTask.ScheduleNo = SchRow.Order_No & " 00"
                        Else
                            newTask.ScheduleNo = SchRow.OrdSchNo
                        End If
                        'newTask.ScheduleNo = schRow.OrdSchNo
                        newTask.DeliveryDate = SchRow.Delivery_Date


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
                        CombOrders.nc_task_list.Addnc_task_listRow(newTask)

                        Dim taskParts = From Part In CombOrders.orderscheduledetails _
                                        Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                        newTask.NoOfDwgs = taskParts.Count

                        Dim taskPartQty As Int32 = 0
                        For Each part In taskParts
                            Dim taskPart As magod.Orders.Task_PartsListRow = CombOrders.Task_PartsList.NewTask_PartsListRow
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
                        .Parameters.Add("@SchDetailsID", MySql.Data.MySqlClient.MySqlDbType.Int32)
                        .Parameters.AddWithValue("@NcTaskId", newTask.NcTaskId)
                        For Each part In taskParts
                            cmd.Parameters("@SchDetailsID").Value = part.SchDetailsID
                            .ExecuteNonQuery()

                        Next
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
                    SchRow.Schedule_Status = "Tasked"
                    .CommandText = "UPDATE magodmis.orderschedule SET Schedule_Status='Tasked' WHERE ScheduleID=@ScheduleID "
                    .Parameters("@ScheduleID").Value = SchRow.ScheduleId
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
#End Region







End Class