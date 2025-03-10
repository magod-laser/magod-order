Public Class CombinedSalesScheduleCreator
    Private tblSelectedTasks As New Magod.Orders.CombinedSchTasksListDataTable
    Private tblSelectedTaskParts As New magod.Orders.CombinedTaskPartsListDataTable
    Private tblSelectedOrderSceduleDetails As New Magod.Orders.orderscheduledetailsDataTable
    Private Da_CombSchedule, Da_CombSchDetails, Da_CombParts As MySql.Data.MySqlClient.MySqlDataAdapter
    Private Sub setUpData()
        With Orders.getCommand
            .CommandText = "SELECT    n.`Mtrl_Code`, n.`Operation`,sum( n.`NoOfDwgs`) as NoOfDwgs, sum(n.`TotalParts`) as TotalParts " _
            & "FROM magodmis.nc_task_list n,machine_data.operationslist o,machine_data.profile_cuttingoperationslist p " _
            & "WHERE n.`CustMtrl`='Magod' AND n.`TStatus`='Created' AND o.`OperationID`=p.`OperationId` " _
            & "AND o.`Operation`=n.`Operation` " _
            & "GROUP BY  n.`Mtrl_Code`, n.`Operation`ORDER BY n.`Mtrl_Code`, n.`Operation`;"
            .Connection.Open()
            Orders1.CombinedSalesTasks.Load(.ExecuteReader)
            .Connection.Close()
        End With

    End Sub

    Public Sub New()
        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        Try
            BS_Cust.DataSource = Orders.CustList
            BS_SalesExec.DataSource = Orders.salesExecList
            Orders1.Tables.Add(tblSelectedTasks)
            Orders1.Tables.Add(tblSelectedTaskParts)

            BS_SelectedTasks.DataSource = tblSelectedTasks
            Dim taskPartRelation As New DataRelation("SelectedTasksToParts", tblSelectedTasks.NcTaskIdColumn, tblSelectedTaskParts.NcTaskIdColumn)
            Orders1.Relations.Add(taskPartRelation)
            BS_SelectedTaskParts.DataSource = BS_SelectedTasks
            BS_SelectedTaskParts.DataMember = "SelectedTasksToParts"
            setDa_CombinedSchedule()

        Catch ex As Exception
            MsgBox(ex.Message)
        End Try



        setUpData()
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
    Private Sub DGV_SalesTasks_CellClick(ByVal sender As System.Object, ByVal e As System.Windows.Forms.DataGridViewCellEventArgs) Handles DGV_SalesTasks.CellClick
        If Not DGV_SalesTasks.CurrentRow.IsNewRow Then
            '**** add Selected Type Of Tasks SalesTasksId
            addTasks(DGV_SalesTasks.CurrentRow.Cells("SalesTasksId").Value, _
                     DGV_SalesTasks.CurrentRow.Cells("MtrlCode").Value, _
                     DGV_SalesTasks.CurrentRow.Cells("Operation").Value)
        End If
    End Sub
    Private Sub addTasks(ByVal SalesTasksId As Integer, ByVal Mtrl_Code As String, ByVal Operation As String)
        Orders1.CombinedSchTasksList.Clear()
        Label_TaskType.Text = String.Format("Task : {0} - {1}", Operation, Mtrl_Code)
        With Orders.getCommand
            .Parameters.Clear()
            .CommandText = "SELECT   n.`Mtrl_Code`, n.`Operation`,n.`MProcess`,@SalesTasksId as SalesTasksId,n.`NcTaskId`,n.ScheduleId,Left( n.`TaskNo`,9) as OrderSchNo," _
                         & "n.`TaskNo`, n.`Cust_Code`, n.`NoOfDwgs`, n.`TotalParts`,c.`Cust_name` " _
                            & "FROM magodmis.nc_task_list n,magodmis.cust_data c,magodmis.orderschedule o " _
                            & "WHERE n.`CustMtrl`='Magod' AND n.`Mtrl_Code`=@Mtrl_Code AND n.`Operation`=@Operation " _
                            & "AND n.`Cust_Code`=c.`Cust_Code` AND n.TStatus='Created' AND n.ScheduleId=n.ScheduleId  " _
                            & "AND Not( n.`TaskNo`  Like '99%' OR n.`TaskNo`  Like '88%' ) AND o.Schedule_Status='Tasked' ;"
            .Parameters.AddWithValue("@Mtrl_Code", Mtrl_Code)
            .Parameters.AddWithValue("@Operation", Operation)
            .Parameters.AddWithValue("@SalesTasksId", SalesTasksId)
            .Connection.Open()
            Orders1.CombinedSchTasksList.Load(.ExecuteReader)
            .Connection.Close()
            .Parameters.Clear()

        End With
    End Sub

    Private Sub btnSelectSch_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSelectSch.Click
        For Each task As magod.Orders.CombinedSchTasksListRow In Orders1.CombinedSchTasksList.Rows
            task.Selected = True
        Next
    End Sub

    Private Sub Button4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button4.Click
        For Each task As magod.Orders.CombinedSchTasksListRow In Orders1.CombinedSchTasksList.Select("Selected")
            ' Dim addTask As magod.Orders.CombinedSchTasksListRow = tblSelectedTasks.NewCombinedSchTasksListRow
            Try
                tblSelectedTasks.ImportRow(task)

            Catch ex As System.Data.ConstraintException


            Catch ex As Exception
                MsgBox(ex.Message)
            End Try

        Next
    End Sub

    Private Sub Btn_PrepareSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_PrepareSchedule.Click

        With Orders.getCommand
            .Parameters.Clear()
            '.CommandText = "SELECT t.`Task_Part_ID`, t.`NcTaskId`, t.`DwgName`, t.`SchDetailsId`, t.`QtyToNest` " _
            '                             & "FROM magodmis.task_partslist t WHERE t.`NcTaskId`=@NcTaskId;"
            .CommandText = "SELECT n.`NcTaskId`, n.`TaskNo`, o.`SchDetailsID`, o.`ScheduleId`, o.`Cust_Code`, o.`DwgName`, o.`Mtrl_Code`," _
                            & "o.`MProcess`, o.`Mtrl_Source`, o.`InspLevel`, o.`QtyScheduled` as QtyToNest, o.`DwgStatus`, o.`Operation`, o.`Tolerance` " _
                            & "FROM magodmis.orderscheduledetails o,magodmis.nc_task_list n WHERE  o.`NcTaskId`=n.`NcTaskId` AND n.`NcTaskId`=@NcTaskId;"
            .Parameters.Add("@NcTaskId", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Connection.Open()
            tblSelectedTaskParts.Clear()
            For Each task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Select("Selected")
                .Parameters("@NcTaskId").Value = task.NcTaskId
                tblSelectedTaskParts.Load(.ExecuteReader)
            Next
            .Connection.Close()
        End With
    End Sub

    Private Sub btn_createCombSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_createCombSchedule.Click
        CreateSalesCombinedSchedule()
    End Sub
    Private Sub CreateSalesCombinedSchedule()
        '***** Only for selcted Tasks
        '***** Check that drawing No Exits in order folder for each part in the task
        '**** if not unmark the Task
        '**** create a new Combined schedule and get CmbScheduleId
        For Each Task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Select("Selected")
            If Task.Selected = False Then
                Task.Delete()
            End If
        Next
        Orders1.CombinedSchTasksList.AcceptChanges()

        '*** Check for drawings

        Dim Schedules = (From task In tblSelectedTasks Select task.ScheduleID, task.TaskNo, task.OrderSchNo).Distinct

        If Schedules.Count > 0 Then '** There are Task for Combined Schedules
            Dim newCmbSch As Magod.Orders.combined_scheduleRow = Orders1.combined_schedule.Newcombined_scheduleRow
            '***** Creates a new combined schedule 
            If InsertCombinedSchedule(newCmbSch) Then
                If AllotAndTaskCombinedSchedule(newCmbSch) Then
                    '***Update Selected Schedules and Tasks as Combined 
                    With Orders.getCommand
                        .Connection.Open()
                        .Parameters.Clear()
                        .Parameters.AddWithValue("@Schedule_Status", String.Format("Comb /{0}", newCmbSch.combined_schedule_no))
                        .Parameters.Add("@NcTaskId", MySql.Data.MySqlClient.MySqlDbType.Int32)
                        For Each sch As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Select("Selected")

                            .CommandText = "UPDATE magodmis.nc_task_list o1 " _
                            & "SET  o1.`TStatus`=@Schedule_Status " _
                            & "WHERE  o1.`NcTaskId`=@NcTaskId ;"
                            .Parameters("@NcTaskId").Value = sch.NcTaskId
                            .ExecuteNonQuery()
                            'sch.Delete()
                        Next
                        .Connection.Close()
                    End With
                   
                    '**** set the Status to Combined in respective Schedules
                    '**** Requery the schedules
                 
                    If CreateScheduleTasks() Then
                        MsgBox("Combined Scheduled Tasked")
                    End If
                    Me.btn_createCombSchedule.Enabled = False
                    '**** add Selected Type Of Tasks SalesTasksId
                    addTasks(DGV_SalesTasks.CurrentRow.Cells("SalesTasksId").Value, _
                             DGV_SalesTasks.CurrentRow.Cells("MtrlCode").Value, _
                             DGV_SalesTasks.CurrentRow.Cells("Operation").Value)
                End If
            End If

        End If

    End Sub

    Private Function AllotAndTaskCombinedSchedule(ByRef newCmbSch As Magod.Orders.combined_scheduleRow) As Boolean
        With newCmbSch
            Dim SQL As New System.Text.StringBuilder
            Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getCommand

            Dim srlNo As New magod.Voucher
            With srlNo
                .VoucherType = "CombinedSchedule_Sales"
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
                Dim combined_schedule_no = "88" & NextSrl

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

                Dim combSch As Magod.Orders.orderscheduleRow = Orders1.orderschedule.NeworderscheduleRow
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
                Orders1.orderschedule.AddorderscheduleRow(combSch)


                .Parameters.AddWithValue("@ScheduleID", combSch.ScheduleId)
                .Parameters.AddWithValue("@CmbSchID", newCmbSch.CmbSchID)
                .CommandText = "UPDATE magodmis.combined_schedule c SET c.`ScheduleID`=@ScheduleID WHERE c.`CmbSchID`=@CmbSchID"
                .ExecuteNonQuery()

                MsgBox("Combined Schedule " & combSch.OrdSchNo & " Created")


                '****** Insert Schedule Details
                Dim combSchPart = From part In Orders1.combined_schedule_part_details _
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
                    schPart = Orders1.orderscheduledetails.NeworderscheduledetailsRow
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
                    Orders1.orderscheduledetails.AddorderscheduledetailsRow(schPart)
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
    Private Function InsertCombinedSchedule(ByRef newCmbSch As Magod.Orders.combined_scheduleRow) As Boolean

        With newCmbSch
            .cmb_schDate = Today
            .Cust_Code = "0000"
            .combined_schedule_no = "Draft"
            Orders1.combined_schedule.Addcombined_scheduleRow(newCmbSch)
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
            Dim Schedules = (From task In tblSelectedTasks Select task.ScheduleID, task.TaskNo, task.OrderSchNo).Distinct
            For Each sch In Schedules


                Dim newComSchDetail As Magod.Orders.combined_schedule_detailsRow = Orders1.combined_schedule_details.Newcombined_schedule_detailsRow
                With newComSchDetail
                    .cmbSchId = newCmbSch.CmbSchID
                    .ScheduleID = sch.ScheduleID
                    .CSSrl = intCsSrl
                    intCsSrl += 1
                End With
                Orders1.combined_schedule_details.Addcombined_schedule_detailsRow(newComSchDetail)
                With Orders.getCommand
                    .CommandText = "INSERT INTO magodmis.combined_schedule_details " _
                        & "(cmbSchId,ScheduleId,OrderSchNo,CSSrl) Values(@cmbSchId,@ScheduleId,@OrderSchNo,@CSSrl);"
                    With .Parameters
                        .Clear()
                        .AddWithValue("@cmbSchId", newCmbSch.CmbSchID)
                        .AddWithValue("@ScheduleId", newComSchDetail.ScheduleID)
                        .AddWithValue("@OrderSchNo", sch.OrderSchNo)
                        .AddWithValue("@CSSrl", newComSchDetail.CSSrl)
                    End With
                    .ExecuteNonQuery()
                    .CommandText = "select last_insert_id();"
                    newComSchDetail.cmbSchDetailsID = .ExecuteScalar
                    newComSchDetail.AcceptChanges()
                End With
                '******* Insert the Parts in the task into Combined Schedules Parts List
                For Each task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Select(String.Format("ScheduleId={0}", newComSchDetail.ScheduleID))
                    For Each part As Magod.Orders.CombinedTaskPartsListRow In tblSelectedTaskParts.Select(String.Format("NcTaskId={0}", task.NcTaskId))
                        Dim cmbPart As Magod.Orders.combined_schedule_part_detailsRow = Orders1.combined_schedule_part_details.Newcombined_schedule_part_detailsRow

                        With cmbPart
                            .cmbSchId = newCmbSch.CmbSchID
                            .ScheduleID = sch.ScheduleID
                            .O_SchDetailsID = part.SchDetailsId
                            .cmbSchDetailsID = newComSchDetail.cmbSchDetailsID
                            .DwgName = task.TaskNo & " " & part.DwgName
                            .Cust_Code = "0000"
                            .Mtrl_Code = task.Mtrl_Code
                            .Operation = task.Operation
                            .MProcess = task.MProcess
                            .Mtrl_Source = "Magod"
                            .InspLevel = part.InspLevel
                            .QtyScheduled = part.QtyToNest

                        End With
                        Orders1.combined_schedule_part_details.Addcombined_schedule_part_detailsRow(cmbPart)
                    Next
                Next
            Next
            Da_CombParts.Update(Orders1.combined_schedule_part_details)
           
            Orders.getCommand.Connection.Close()

        End With
        Return True
    End Function
    Private Function CreateScheduleTasks() As Boolean
        '***** Delete all old Tasks
        '****** first group according to parameters
        '****** Create Tasks
        '****** add Task Details
        'Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code,  part.MProcess,part.Operation, part.Mtrl_Source, part.Tolerance, part.InspLevel).Distinct()
        Dim tasks = (From part In Orders1.orderscheduledetails Select part.Mtrl_Code, part.MProcess, part.Operation, part.Mtrl_Source).Distinct()
        Dim cmd As MySql.Data.MySqlClient.MySqlCommand = Orders.getDBLink.getCommand
        Dim TaskNo As Int16 = 1
        Dim strTaskNo As String
        Dim SchRow As Magod.Orders.orderscheduleRow = Orders1.orderschedule.Rows(0)
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
                    .Parameters.AddWithValue("@ScheduleID", SchRow.ScheduleId)
                    .ExecuteNonQuery()

                    For Each task In tasks
                        strTaskNo = Microsoft.VisualBasic.Right("0" & TaskNo, 2)
                        Console.WriteLine(String.Format("Task No {0} {1} {2} {3} {4}", strTaskNo, task.Mtrl_Code, task.Mtrl_Source, task.MProcess, task.Operation))

                        Dim newTask As Magod.Orders.nc_task_listRow = Orders1.nc_task_list.Newnc_task_listRow

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
                        Orders1.nc_task_list.Addnc_task_listRow(newTask)

                        Dim taskParts = From Part In Orders1.orderscheduledetails _
                                        Where Part.MProcess = newTask.MProcess And Part.Mtrl_Source = newTask.CustMtrl And Part.Mtrl_Code = newTask.Mtrl_Code
                        newTask.NoOfDwgs = taskParts.Count

                        Dim taskPartQty As Int32 = 0
                        For Each part In taskParts
                            Dim taskPart As Magod.Orders.Task_PartsListRow = Orders1.Task_PartsList.NewTask_PartsListRow
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
    Private Function CopyDwgsToCombinedSchedule()
        Return False
    End Function
    Private Sub Button2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button2.Click
        For Each task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Rows
            task.Selected = Not task.Selected
        Next
     
    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        tblSelectedTaskParts.Clear()
        For Each task As Magod.Orders.CombinedSchTasksListRow In Orders1.CombinedSchTasksList.Rows
            task.Selected = Not task.Selected
        Next
    End Sub

    Private Sub Button3_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button3.Click
        tblSelectedTaskParts.Clear()
        For Each task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Rows
            task.Selected = True
        Next

    End Sub

    Private Sub Button5_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button5.Click
        tblSelectedTaskParts.Clear()
        For Each task As Magod.Orders.CombinedSchTasksListRow In tblSelectedTasks.Rows
            If task.Selected Then
                task.Delete()
            End If
        Next
        tblSelectedTasks.AcceptChanges()
    End Sub

    
End Class