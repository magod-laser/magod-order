Imports MySql.Data.MySqlClient
Imports System.Windows.Forms
Imports System.Drawing
Public Class CombSch_Details
    Private combSchRow As Magod.Orders.combined_scheduleRow
    Dim intSchid, intCmbSchid As Integer
    Dim OrderFolder, SchPath As String
    Dim DA_Sch, Da_SchDetails, DA_schTasks, Da_schTaskParts, _
    Da_schTaskMtrl, Da_cmbSchDetails, Da_cmbSchPart, Da_originSch, Da_originSchParts As MySql.Data.MySqlClient.MySqlDataAdapter

    Public Sub New()

        '' This call is required by the Windows Form Designer.
        InitializeComponent()
        '' Add any initialization after the InitializeComponent() call.

    End Sub
  

    Public Sub New(ByVal cmbSchid As Integer)

        ' This call is required by the Windows Form Designer.
        InitializeComponent()
        ' MD = _md
        intCmbSchid = cmbSchid
        ' Add any initialization after the InitializeComponent() call.
        setupForm()
    End Sub

    Private Sub setupForm()

        With Orders.getCommand

            .Connection.Open()
          
            BS_Dealing.DataSource = Orders.salesExecList
            Bs_Unit.DataSource = Orders.getUnitInfo

            .CommandText = "SELECT * FROM magodmis.combined_schedule c WHERE c.`cmbSchID`=@cmbSchID;"
            .Parameters.Clear()
            .Parameters.AddWithValue("@cmbSchID", intCmbSchid)
            Orders1.combined_schedule.Load(.ExecuteReader)
            combSchRow = Orders1.combined_schedule.Rows(0)
            Orders.getDBLink.create_order_folder(combSchRow.combined_schedule_no)
            intSchid = Orders1.combined_schedule.Rows(0).Item("ScheduleId")
          

            .Parameters.AddWithValue("@ScheduleID", intSchid)
            '**** update the order schedule before distributing
            .CommandText = "UPDATE magodmis.orderscheduledetails S, (SELECT t.`SchDetailsId`, t.`DwgName`, t.`QtyCleared`, " _
                    & " t.`QtyProduced` FROM magodmis.task_partslist t,magodmis.nc_task_list n " _
                    & "WHERE t.`TaskNo`=n.`TaskNo` AND n.`ScheduleID`=@ScheduleID) as A " _
                    & "SET S.QtyProduced=a.QtyProduced ,S.QtyInspected=a.qtycleared Where s.schdetailsid=a.schdetailsid;"

          
            .Parameters.Clear()
            .Connection.Close()
        End With
     
        '**** set data adopters
        Dim newRelation = New DataRelation("Rel_SchedulePartsToCombParts", _
                                          Orders1.orderscheduledetails.SchDetailsIDColumn, _
                                          Orders1.combined_schedule_part_details.N_SchDetailsIDColumn)
        Orders1.Relations.Add(newRelation)

        bs_schToCmbParts.DataSource = BS_SchDetails
        bs_schToCmbParts.DataMember = "Rel_SchedulePartsToCombParts"

        BS_OriginalSch.Filter = "ScheduleType<>'Combined'"
        BS_Schedule.Filter = "ScheduleId=" & intSchid
        setDASch()
        setDASchDetails()
        setDa_cmbSchDetails()
        setDA_cmbSchParts()
        setDASchTasks()
        setDASchTaskParts()
        setDAOriginSch()
        'setDASchTaskMtrl()

        OrderFolder = Orders.getWOPath & "\" & combSchRow.combined_schedule_no
        SchPath = OrderFolder & "\" & combSchRow.combined_schedule_no & " 01"
        '****** set Data controls
  
        set_dgvCmbSchParts()
    
    End Sub
#Region "DGV and Text:"

    Private Sub set_dgvCmbSchParts()
        'DwgName, Mtrl_Code, MProcess, Mtrl_Source, LOC, Holes, Part_Area, UnitWt, QtyScheduled, QtyProduced, QtyInspected, QtyCleared, 
        'cmbSchID, SchDetailsId, cmbSchPartId, cmbSchDetailsID, ScheduleID
        Dim col As DataGridViewTextBoxColumn
        ' Dim col1 As DataGridViewCheckBoxColumn
        With Me.DGV_Distribute
            .AutoGenerateColumns = False
            .DataSource = bs_schToCmbParts

            col = New DataGridViewTextBoxColumn
            With col
                .HeaderText = "Schedule"
                .DataPropertyName = "OrderSchNo"
                .ValueType = System.Type.GetType("System.String")
                .ReadOnly = True
                .Width = 70
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleLeft
            End With
            .Columns.Add(col)
         
            col = New DataGridViewTextBoxColumn
            With col
                .HeaderText = "Scheduled"
                .DataPropertyName = "QtyScheduled"
                .ValueType = System.Type.GetType("System.Int64")
                .ReadOnly = True
                .Width = 60
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
            End With
            .Columns.Add(col)

            col = New DataGridViewTextBoxColumn
            With col
                .Name = "Cleared"
                .HeaderText = "Cleared"
                .DataPropertyName = "QtyCleared"
                .ValueType = System.Type.GetType("System.Int64")
                .ReadOnly = False
                .Width = 60
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
            End With
            .Columns.Add(col)


            col = New DataGridViewTextBoxColumn
            With col
                .Name = "Distributed"
                .HeaderText = "Distributed"
                .DataPropertyName = "QtyDistributed"
                .ValueType = System.Type.GetType("System.Int64")
                .ReadOnly = True
                .Width = 60
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
            End With
            .Columns.Add(col)



        End With


    End Sub
    Private Sub setSchDetailsStatus()
        '****** check for details status
        For Each part As Magod.Orders.orderscheduledetailsRow _
                In Orders1.orderscheduledetails.Select("ScheduleId=" & intSchid)
            If part.QtyScheduled = 0 Then
                part.SrlStatus = 0
            ElseIf part.QtyScheduled = Orders1.combined_schedule_part_details.Compute("Sum(QtyDistributed)", String.Format("N_SchDetailsId={0}", part.SchDetailsID)) Then
                part.SrlStatus = 8
            ElseIf part.QtyScheduled = part.QtyCleared Then 'Completed
                part.SrlStatus = 7
            ElseIf part.QtyCleared > 0 Then
                part.SrlStatus = 6
            ElseIf part.QtyScheduled = part.QtyProduced Then
                part.SrlStatus = 5
            ElseIf part.QtyProduced > 0 And part.QtyScheduled = part.QtyProgrammed Then
                part.SrlStatus = 4
            ElseIf part.QtyScheduled = part.QtyProgrammed Then
                part.SrlStatus = 3
            ElseIf part.QtyProgrammed > 0 Then
                part.SrlStatus = 2
            Else
                part.SrlStatus = 1
            End If
        Next

        For Each dr As DataGridViewRow In DGV_schDetails.Rows
            Select Case dr.Cells("SrlStatus").Value
                Case Is = 0
                    dr.DefaultCellStyle.BackColor = Color.Red
                Case Is = 1
                    dr.DefaultCellStyle.BackColor = Color.Coral
                Case Is = 2
                    dr.DefaultCellStyle.BackColor = Color.LightCoral
                Case Is = 3
                    dr.DefaultCellStyle.BackColor = Color.LightPink
                Case Is = 4
                    dr.DefaultCellStyle.BackColor = Color.LightYellow
                Case Is = 5
                    dr.DefaultCellStyle.BackColor = Color.Yellow
                Case Is = 6
                    dr.DefaultCellStyle.BackColor = Color.GreenYellow
                Case Is = 7
                    dr.DefaultCellStyle.BackColor = Color.LightGreen
                Case Is = 8
                    dr.DefaultCellStyle.BackColor = Color.Green

            End Select
        Next
    End Sub
  
  
   
  
#End Region

#Region "Data Adoptors"


    Private Sub setDASch()
        DA_Sch = Orders.getDBLink.getMySqlDataAdopter
        With DA_Sch
            With .SelectCommand
                .CommandText = "SELECT o.*, " _
                        & "concat(c.Cust_name,' ','(',c.cust_code,')') as Cust_Name " _
                        & "FROM magodmis.orderschedule o, magodmis.cust_data c " _
                        & "WHERE o.scheduleid=@scheduleid AND c.cust_code=o.cust_code;"

                .Parameters.AddWithValue("@scheduleid", intSchid)

            End With
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.orderschedule " _
                & "SET Special_Instructions=@Special_Instructions,Schedule_Status=@Schedule_Status,Delivery_Date=@Delivery_Date,Dealing_Engineer=@Dealing_Engineer " _
                & " WHERE scheduleID=@scheduleID;"
                With .Parameters
                    .Add("@Special_Instructions", MySqlDbType.VarChar, 200, "Special_Instructions")
                    .Add("@Schedule_Status", MySqlDbType.VarChar, 20, "Schedule_Status")
                    .Add("@Delivery_Date", MySqlDbType.Date, 20, "Delivery_Date")
                    .Add("@Dealing_Engineer", MySqlDbType.VarChar, 50, "Dealing_Engineer")
                    .Add("@scheduleID", MySqlDbType.Int32, 20, "scheduleID")
                End With
            End With
            .Fill(Orders1.orderschedule)
        End With
    End Sub
    Private Sub setDASchDetails()
        Da_SchDetails = Orders.getDBLink.getMySqlDataAdopter
        With Da_SchDetails
            With .SelectCommand
                .CommandText = "SELECT o.`SchDetailsID`, o.`Schedule_Srl`, " _
                & "o.`DwgName`, o.`Mtrl_Code`, o.`MProcess`, o.`Mtrl_Source`, o.`QtyScheduled`, " _
                & "o.`QtyProgrammed`, o.`QtyProduced`, o.`QtyInspected`, o.`QtyCleared`, " _
                & "o.`Rejections`, o.`Tester`,o.`LOC`, o.`Holes`, o.`Part_Area`, o.`UnitWt` " _
                & "FROM magodmis.orderscheduledetails o WHERE o.`ScheduleID`=@ScheduleID;"
                .CommandText = "SELECT o.* " _
              & "FROM magodmis.orderscheduledetails o WHERE o.`ScheduleID`=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchid)
            End With

            With .UpdateCommand
                .CommandText = "UPDATE magodmis.orderscheduledetails SET qtyCleared=@QtyCleared WHERE SchDetailsId=@SchDetailsId;"
                With .Parameters
                    .Add("@QtyCleared", MySqlDbType.Int32, 20, "QtyCleared")
                    .Add("@SchDetailsId", MySqlDbType.Int32, 20, "SchDetailsId")
                End With
            End With
            .Fill(Orders1.orderscheduledetails)
        End With
    End Sub
    Private Sub setDASchTasks()
        DA_schTasks = Orders.getDBLink.getMySqlDataAdopter
        With DA_schTasks
            With .SelectCommand
                .CommandText = " SELECT * FROM magodmis.nc_task_list n WHERE n.`ScheduleID`=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchid)
            End With
            .Fill(Orders1.nc_task_list)
        End With
    End Sub
    Private Sub setDASchTaskParts()
        Da_schTaskParts = Orders.getDBLink.getMySqlDataAdopter
        With Da_schTaskParts
            With .SelectCommand
                .CommandText = "SELECT t.* FROM magodmis.task_partslist t,magodmis.nc_task_list n " _
                    & "WHERE t.`TaskNo`=n.`TaskNo` AND n.`ScheduleID`=@ScheduleID;"
                .Parameters.AddWithValue("@ScheduleID", intSchid)
            End With
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.task_partslist t SET  " _
                & "t.`QtyProduced`=@QtyProduced, t.`QtyCleared`=@QtyCleared WHERE t.`Task_Part_ID`=@Task_Part_ID;"
                With .Parameters
                    .Add("@QtyProduced", MySqlDbType.Int32, 20, "QtyProduced")
                    .Add("@QtyCleared", MySqlDbType.Int32, 20, "QtyCleared")
                    .Add("@Task_Part_ID", MySqlDbType.Int32, 20, "Task_Part_ID")
                End With
            End With
            .Fill(Orders1.Task_PartsList)
        End With
    End Sub
    Private Sub setDAOriginSch()
        Da_originSch = Orders.getDBLink.getMySqlDataAdopter
        With Da_originSch
            With .SelectCommand
                .CommandText = "SELECT  o.*, c.`cmbSchId` " _
                            & "FROM magodmis.combined_schedule_details c,magodmis.orderschedule o " _
                            & "WHERE c.`cmbSchId`=@cmbSchId AND c.`scheduleId`=o.`ScheduleID`;"
                .Parameters.AddWithValue("@cmbSchId", intCmbSchid)

            End With
            .Fill(Orders1.orderschedule)
            '  .Fill(DS_Form, "OriginalSch")
        End With
        Da_originSchParts = Orders.getDBLink.getMySqlDataAdopter
        With Da_originSchParts
            With .SelectCommand
                .CommandText = "SELECT o.`DwgName`, o.`QtyScheduled`, o.`QtyProgrammed`, o.`QtyProduced`," _
                            & "o.`QtyInspected`, o.`QtyCleared`, o.`Schedule_Srl`, o.`QtyPacked`, o.`QtyDelivered`,o.`ScheduleID` " _
                            & "FROM magodmis.combined_schedule_details c,magodmis.orderscheduledetails o " _
                            & "WHERE c.`cmbSchID`=@cmbSchID AND c.`ScheduleId`=o.`ScheduleID`;"

                .Parameters.AddWithValue("@cmbSchId", intCmbSchid)

            End With
            .Fill(Orders1.orderscheduledetails)
            '   .Fill(DS_Form, "OriginSchParts")
        End With
    End Sub
    'Private Sub setDASchTaskMtrl()
    '    Da_schTaskMtrl = MD.getOdbcDataAdopter
    '    With Da_schTaskMtrl
    '        With .SelectCommand
    '            .CommandText = "SELECT t.* FROM magodmis.task_material_list t,magodmis.nc_task_list n " _
    '                & "WHERE t.`TaskNo`=n.`TaskNo` AND n.`ScheduleID`=@;"
    '            .Parameters.Add("@schId",  MySqlDbType.Int).Value = intSchid
    '        End With
    '        With .InsertCommand
    '            .CommandText = "INSERT INTO magodmis.task_material_list (Taskno,length,width,Quantity,Limittoqty) " _
    '                            & "Values(@,@,@,@,@);"
    '            With .Parameters
    '                .Add("@TaskNo",  MySqlDbType.VarChar, 20, "Taskno")
    '                .Add("@length",  MySqlDbType.Int, 20, "Length")
    '                .Add("@Width",  MySqlDbType.Int, 20, "Width")
    '                .Add("@Quantity",  MySqlDbType.Int, 20, "Quantity")
    '                .Add("@limittoqty",  MySqlDbType.Int, 20, "limittoqty")
    '            End With
    '        End With
    '        With .UpdateCommand
    '            .CommandText = "UPDATE  magodmis.task_material_list " _
    '                    & "SET length=@,width=@,Quantity=@,Limittoqty=@ " _
    '                            & "WHERE id=@;"
    '            With .Parameters
    '                .Add("@length",  MySqlDbType.Int, 20, "Length")
    '                .Add("@Width",  MySqlDbType.Int, 20, "Width")
    '                .Add("@Quantity",  MySqlDbType.Int, 20, "Quantity")
    '                .Add("@limittoqty",  MySqlDbType.Int, 20, "limittoqty")
    '                .Add("@ID",  MySqlDbType.Int, 20, "ID")
    '            End With
    '        End With
    '        With .DeleteCommand
    '            .CommandText = "DELETE FROM magodmis.task_material_list WHERE ID=@;"
    '            .Parameters.Add("@ID",  MySqlDbType.Int, 20, "ID")
    '        End With
    '        .Fill(DS_Form, "Sch_TaskMtrl")
    '    End With
    'End Sub
    Private Sub setDa_cmbSchDetails()
        Da_cmbSchDetails = Orders.getDBLink.getMySqlDataAdopter
        With Da_cmbSchDetails
            With .SelectCommand
                .CommandText = "SELECT * " _
                            & "FROM magodmis.combined_schedule_details c WHERE c.`cmbSchId`=@cmbSchId;"
                .Parameters.AddWithValue("@cmbSchid", intCmbSchid)
            End With
            .Fill(Orders1.combined_schedule_details)
           
        End With
    End Sub
    Private Sub setDA_cmbSchParts()
        Da_cmbSchPart = Orders.getDBLink.getMySqlDataAdopter
        With Da_cmbSchPart
            With .SelectCommand
                .CommandText = "SELECT c.*, c1.`OrderSchNo` " _
                            & "FROM magodmis.combined_schedule_part_details c,magodmis.combined_schedule_details c1 " _
                            & "WHERE c.`cmbSchID`=@cmbSchID AND c1.`cmbSchDetailsID`=c.`cmbSchDetailsID`;"
                ' c.`OrderSchNo` FROM magodmis.combined_schedule_details c;
                .Parameters.AddWithValue("@cmbSchid", intCmbSchid)
            End With
            With .UpdateCommand
                .CommandText = "UPDATE magodmis.combined_schedule_part_details c " _
                    & "SET c.`QtyCleared`=@QtyCleared, c.`QtyDistributed`=@QtyDistributed, " _
                    & "c.`LOC`=@LOC, c.`Holes`=@Holes, c.`Part_Area`=@Part_Area, c.`UnitWt`=@UnitWt " _
                    & "WHERE c.`cmbSchPartId`=@cmbSchPartId;"
                With .Parameters
                    .Add("@QtyCleared", MySqlDbType.Int32, 20, "QtyCleared")
                    .Add("@QtyDistributed", MySqlDbType.Int32, 20, "QtyDistributed")
                    .Add("@LOC", MySqlDbType.Double, 20, "LOC")
                    .Add("@Holes", MySqlDbType.Int32, 20, "Holes")
                    .Add("@Part_Area", MySqlDbType.Double, 20, "Part_Area")
                    .Add("@UnitWt", MySqlDbType.Double, 20, "UnitWt")
                    .Add("@cmbSchPartId", MySqlDbType.Int32, 20, "cmbSchPartId")
                End With
            End With
            Try
                .Fill(Orders1.combined_schedule_part_details)
            Catch ex As Exception
                MsgBox(ex.Message)
            End Try

        End With
    End Sub
#End Region

    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        Save_SchToCmbDetails_distribution()
    End Sub

    Private Sub Form_combSch_Details_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        Me.WindowState = FormWindowState.Maximized
        '  setSchDetailsStatus()
        SetScheduleClosed()
        SetScheduleStatus()
        setSchDetailsStatus()
    End Sub

    Private Sub btn_UpdateTaskParts_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_UpdateTaskParts.Click
        '******* Update Parts as Cleared in the Nc_task_list
        BS_ReltaskPartlist.EndEdit()
        If Check_Task_PartUpDating() Then

            Da_SchDetails.Update(Orders1.orderscheduledetails)

        End If



    End Sub

    Private Sub resetScheduleDetails()
        '  Dim cmd As OdbcCommand = MD.getCommand
        'With Orders.getCommand

        '    .Connection.Open()

        '    .CommandText = "UPDATE magodmis.orderscheduledetails S, (SELECT t.`SchDetailsId`, t.`DwgName`, t.`QtyCleared`, " _
        '            & " t.`QtyProduced` FROM magodmis.task_partslist t,magodmis.nc_task_list n " _
        '            & "WHERE t.`TaskNo`=n.`TaskNo` AND n.`ScheduleID`=@ScheduleID) as A " _
        '            & "SET S.QtyProduced=a.QtyProduced ,S.QtyInspected=a.qtycleared, " _
        '            & "S.QtyCleared=a.qtycleared Where s.schdetailsid=a.schdetailsid;"
        '    .Parameters.Add("@ScheduleID", MySqlDbType.Int32).Value = intSchid
        '    .ExecuteNonQuery()

        '    .Connection.Close()
        'End With
        'DS_Form.Tables("CmbSchedulePartsList").Clear()
        'DS_Form.Tables("ScheduleDetails").Clear()
        'Da_SchDetails.Fill(DS_Form, "ScheduleDetails")
        'Da_cmbSchPart.Fill(DS_Form, "CmbSchedulePartsList")
    End Sub

    Private Sub DGV_cmbSchDetails_DataError(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewDataErrorEventArgs)
        MsgBox(e.Exception.Message)
    End Sub

    Private Function Check_Cmb_redistribution() As Boolean
        ''***********
        '' Return True if the Total of Parts in QtyCleared for each Dwg in CmbSchedulePartslist
        ''is not greater than the QtyCleared in Orderscheduledetails 
        ''*********
        'Dim QtyOK As Boolean = True
        'Try
        '    '*** End Editing
        '    BS_SchDetails.EndEdit()
        '    bs_schToCmbParts.EndEdit()

        '    Dim EnuSch As IEnumerator

        '    EnuSch = BS_SchDetails.GetEnumerator
        '    BS_SchDetails.MoveFirst()
        '    Dim TotSchQty As Integer = 0
        '    Do While EnuSch.MoveNext
        '        TotSchQty = 0
        '        For Each dr As Object In bs_schToCmbParts
        '            TotSchQty += dr.item("QtyCleared")
        '        Next
        '        If TotSchQty > BS_SchDetails.Current.Item("QtyCleared") Then

        '            QtyOK = False
        '            Me.DGV_schDetails.CurrentRow.DefaultCellStyle.BackColor = Color.Coral
        '        Else
        '            Me.DGV_schDetails.CurrentRow.DefaultCellStyle.BackColor = Color.LightGray
        '        End If
        '        bs_schToCmbParts.EndEdit()
        '        BS_SchDetails.MoveNext()
        '    Loop
        '    Return QtyOK
        'Catch ex As Exception
        '    QtyOK = False
        '    MsgBox(ex.Message)
        '    QtyOK = False
        'End Try

    End Function
    Private Function Check_Task_PartUpDating() As Boolean
        '***********
        ' Return True if the Total of Parts in QtyCleared for each Dwg in CmbSchedulePartslist
        'is not greater than the QtyCleared in Orderscheduledetails 
        '*********
        Dim QtyOK As Boolean = True
        Try
            '*** End Editing      

            Dim QtyDistributed As Integer
            For Each part As magod.Orders.Task_PartsListRow In Orders1.Task_PartsList.Rows
                QtyDistributed = Orders1.combined_schedule_part_details.Compute("Sum(QtyDistributed)", String.Format("N_SchDetailsId={0}", part.SchDetailsId))
                If part.QtyCleared < QtyDistributed Then
                    MsgBox(String.Format("Cannot Change Qty Cleared For Drawing {0} To {1} {2}because Qty {3} has already been distributed to Original Schedules", _
                                         part.DwgName, part.QtyCleared, vbCrLf, QtyDistributed))
                    QtyOK = False
                Else
                    Dim schPart As magod.Orders.orderscheduledetailsRow = Orders1.orderscheduledetails.FindBySchDetailsID(part.SchDetailsId)
                    If Not schPart Is Nothing Then
                        If schPart.QtyCleared < part.QtyCleared Then
                            schPart.QtyCleared = part.QtyCleared
                        End If

                    End If
                End If
            Next
           
            Return QtyOK


        Catch ex As Exception
            QtyOK = False
            MsgBox(ex.Message)
            QtyOK = False
        End Try

    End Function
    Private Function Check_Distribution_Complete()
        '***********
        ' Return True if the Total of Parts in QtyDistributed for each Dwg in CmbSchedulePartslist
        'is Equal QtyCleared in Orderscheduledetails 
        '*********
        Dim QtyOK As Boolean = True
        Try
            '*** End Editing      

            Dim QtyDistributed As Integer
            For Each part As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Rows
                QtyDistributed = Orders1.combined_schedule_part_details.Compute("Sum(QtyDistributed)", String.Format("N_SchDetailsId={0}", part.SchDetailsID))
                If part.QtyCleared <> QtyDistributed Then
                    MsgBox(String.Format("Qty Cleared For Drawing {0} : {1} {2}Has not been Distributed To  Original Schedule : {3} ", _
                                         part.DwgName, part.QtyCleared, vbCrLf, QtyDistributed))
                    QtyOK = False
               
                End If
            Next

          
            Return QtyOK


        Catch ex As Exception

            MsgBox(ex.Message)
            QtyOK = False
        End Try
        Return QtyOK
    End Function
    Private Function Check_Ok_for_Cancel() As Boolean
        '***********
        ' Return True if The QtyProduced for all is 0
        '*********
        Dim QtyOK As Boolean = True
        Try
            '*** End Editing      

            Dim QtyProgrammed, QtyProduced As Integer

            QtyProgrammed = Orders1.orderscheduledetails.Compute("Sum([QtyProgrammed])", Nothing)
            QtyProduced = Orders1.orderscheduledetails.Compute("Sum([QtyProduced])", Nothing)
            If QtyProduced > 0 Or QtyProgrammed > 0 Then
                MsgBox("Production in Progress, cannot cancel")
                QtyOK = False

            End If
           
            Return QtyOK


        Catch ex As Exception

            MsgBox(ex.Message)
            QtyOK = False
        End Try
        Return QtyOK
    End Function
    Private Sub btnDistribute_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnDistribute.Click
        ' ******* Startegy for distributing Parts from the combined schedule 
        '  in order schedule details to
        ' combined schedule parts list
        ' If the there is only one srl in combinedParts then update qty
        'If there is more than but qty of both are equal
        ' Dim EnuSch As IEnumerator
        Dim TotQtyScheduled As Int32
        Try
            '**** The part Parameters of the CombinedScheduleParts are upadated to the Combined Schedule Part deatials
            For Each part As magod.Orders.orderscheduledetailsRow In Orders1.orderscheduledetails.Select(String.Format("ScheduleId={0}", combSchRow.ScheduleID))
                For Each schPart As magod.Orders.combined_schedule_part_detailsRow In Orders1.combined_schedule_part_details.Select(String.Format("N_SchDetailsID={0}", part.SchDetailsID))
                    schPart.LOC = part.LOC
                    schPart.Holes = part.Holes
                    schPart.Part_Area = part.Part_Area
                    schPart.UnitWt = part.UnitWt
                Next
                ' Console.WriteLine(part.DwgName & " Qty " & part.QtyScheduled)
                TotQtyScheduled = Orders1.combined_schedule_part_details.Compute("Sum([QtyScheduled])", String.Format("N_SchDetailsID={0}", part.SchDetailsID))
                If TotQtyScheduled = part.QtyCleared Then
                    For Each schPart As magod.Orders.combined_schedule_part_detailsRow In Orders1.combined_schedule_part_details.Select(String.Format("N_SchDetailsID={0}", part.SchDetailsID))
                        schPart.QtyCleared = schPart.QtyScheduled
                    Next
                ElseIf Not part.QtyCleared = 0 Then
                    MsgBox("Distribute manually for " & part.DwgName)
                    'Save_SchToCmbDetails_distribution()
                    ' Exit Sub
                End If
            Next


        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
        Save_SchToCmbDetails_distribution()
        setSchDetailsStatus()
        MsgBox("Parts Distributed")
        
    End Sub

    Private Sub btnUpdateSchedule_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnUpdateSchedule.Click
        '**** First Check and save distribution to CombinedPartsList
        Save_SchToCmbDetails_distribution()
        ''**** Update The Qty in Original Schedule
        Dim upDateTaskPara As String = " UPDATE magodmis.combined_schedule_part_details c, magodmis.task_partslist t " _
        & "SET t.`LOC`=c.`LOC`, t.`Pierces`=c.`Holes`, t.`Part_Area`=c.`Part_Area`,  t.`Unit_Wt`=c.`UnitWt`, " _
        & "t.`QtyProduced`=t.`QtyProduced`+ ( c.`QtyCleared`-c.`QtyDistributed`),  t.`QtyCleared`=t.`QtyCleared`+  ( c.`QtyCleared`-c.`QtyDistributed`) " _
        & "WHERE c.`cmbSchId`=@cmbSchId AND t.`SchDetailsId`=c.`O_SchDetailsID` AND c.`cmbSchPartID`=@cmbSchPartID"

        Dim upDateCombinedTaskParts As String = "UPDATE magodmis.combined_schedule_part_details c SET c.`QtyDistributed`=c.`QtyCleared` " _
                    & "WHERE c.`cmbSchPartID`=@cmbSchPartID;"

        Dim UpadteOriginalScheduleProductionData As String = "UPDATE magodmis.task_partslist t,magodmis.orderscheduledetails o " _
        & "SET o.`QtyProduced`=t.`QtyCleared`, o.`LOC`=t.`LOC`, o.`Holes`=t.`Pierces`, o.`Part_Area`=t.`Part_Area`, o.`UnitWt`=t.`Unit_Wt` " _
                & "WHERE o.`ScheduleId`=@ScheduleId AND o.`SchDetailsId`=t.`SchDetailsId`;"

        '        UPDATE magodmis.task_partslist t,magodmis.orderscheduledetails o
        'SET o.`QtyProduced`=t.`QtyCleared`, o.`LOC`=t.`LOC`, o.`Holes`=t.`Pierces`, o.`Part_Area`=t.`Part_Area`, o.`UnitWt`=t.`Unit_Wt`
        'WHERE o.`ScheduleId`=@ScheduleId AND o.`SchDetailsId`=t.`SchDetailsId`;
        '**** Set Produced Qty for Schedule
     
        With Orders.getCommand
            .Parameters.Clear()
            .Parameters.AddWithValue("@cmbSchId", intCmbSchid)
            .Parameters.AddWithValue("@ScheduleId", intSchid)
            .Parameters.Add("@cmbSchPartID", MySql.Data.MySqlClient.MySqlDbType.Int32)
            .Connection.Open()
            Try


                .CommandText = "START TRANSACTION;"
                .ExecuteNonQuery()
                For Each part As magod.Orders.combined_schedule_part_detailsRow In Orders1.combined_schedule_part_details.Rows
                    If part.QtyCleared > part.QtyDistributed Then
                        .Parameters("@cmbSchPartID").Value = part.cmbSchPartID

                        '***** Update Task Parameters and QtyProduced and claeared for  of Original Schedule Task
                        .CommandText = upDateTaskPara
                        .ExecuteNonQuery()

                        '***** Upadte  Qty Distributed in Combined scheduleParts
                        .CommandText = upDateCombinedTaskParts
                        .ExecuteNonQuery()
                    End If
                Next

                '**** Set Produced Qty for Schedule
                .CommandText = UpadteOriginalScheduleProductionData
                For Each sch As magod.Orders.combined_schedule_detailsRow In Orders1.combined_schedule_details.Rows
                    .Parameters("@ScheduleId").Value = sch.ScheduleID
                    .ExecuteNonQuery()
                Next


                .CommandText = "COMMIT;"
                .ExecuteNonQuery()
            Catch ex As Exception
                MsgBox(ex.Message)
                .CommandText = "ROLLBACK;"
                .ExecuteNonQuery()
            Finally
                .Connection.Close()
                .Parameters.Clear()
                .CommandText = ""
            End Try 
        End With
        reloadCombinedSchedules()
        SetScheduleStatus()

    End Sub

    Private Sub reloadCombinedSchedules()
        '***** Delete Original Schedules
        Orders1.combined_schedule_part_details.Clear()
        Orders1.orderscheduledetails.Clear()

        '***** Delete Combined Schedule Parts List

        Da_SchDetails.Fill(Orders1.orderscheduledetails)
        Da_cmbSchPart.Fill(Orders1.combined_schedule_part_details)
        Da_originSchParts.Fill(Orders1.orderscheduledetails)

    End Sub
    Private Sub Save_SchToCmbDetails_distribution()
        If Not Check_Task_PartUpDating() Then
            MsgBox("Recheck Distribution before saving")
        End If

        Try
            BS_Schedule.EndEdit()
            DA_Sch.Update(Orders1.orderschedule)

            BS_SchDetails.MoveFirst()
            BS_SchDetails.EndEdit()
            Da_SchDetails.Update(Orders1.orderscheduledetails)

            bs_schToCmbParts.EndEdit()
            Da_cmbSchPart.Update(Orders1.combined_schedule_part_details)


        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub DGV_Distribute_CellValidating(ByVal sender As Object, ByVal e As System.Windows.Forms.DataGridViewCellValidatingEventArgs) Handles DGV_Distribute.CellValidating
        If Me.DGV_Distribute.Columns(e.ColumnIndex).Name = "Cleared" Then
            If e.FormattedValue < Me.DGV_Distribute.Rows(e.RowIndex).Cells("Distributed").Value Then
                MsgBox("Quantity once cleared cannot reduced")
                e.Cancel = True
            End If
        End If




    End Sub

    Protected Overrides Sub Finalize()
        MyBase.Finalize()
    End Sub

    Private Sub SetScheduleStatus()

        'If Not (BS_Schedule.Current.item("Schedule_Status") = "Created" _
        '   Or BS_Schedule.Current.item("Schedule_Status") = "Cancelled" _
        '    Or BS_Schedule.Current.item("Schedule_Status") = "Suspended" _
        '     Or BS_Schedule.Current.item("Schedule_Status") = "Closed" _
        '      Or BS_Schedule.Current.item("Schedule_Status") = "ShortClosed") _
        '   Then
        '    setSchDetailsStatus()
        '    Dim ordSch As Magod.Orders.orderscheduleRow = Orders1.orderschedule.Rows(0)
        '    Dim schStatusInt As Int16 = Orders1.orderscheduledetails.Compute("Min([SrlStatus])", "ScheduleId=" & intSchid)
        '    Select Case schStatusInt
        '        Case Is = 0
        '            ordSch.Schedule_Status = "Created"
        '        Case Is = 1
        '            ordSch.Schedule_Status = "Tasked"
        '        Case Is = 8
        '            ordSch.Schedule_Status = "Closed"
        '            Me.btn_UpdateTaskParts.Enabled = False
        '            Me.btnDistribute.Enabled = False
        '            Me.btnSave.Enabled = False
        '            Me.btnShortClose.Enabled = False
        '            Me.btnUpdateSchedule.Enabled = False
        '            Me.btnCancel.Enabled = False
        '        Case Is = 7
        '            ordSch.Schedule_Status = "Completed"
        '        Case Is = 3
        '            ordSch.Schedule_Status = "Programmed"
        '        Case Else
        '            ordSch.Schedule_Status = "Processing"


        '    End Select
        'Else
        '    Me.btn_UpdateTaskParts.Enabled = False
        '    Me.btnDistribute.Enabled = False
        '    Me.btnSave.Enabled = False
        '    Me.btnShortClose.Enabled = False
        '    Me.btnUpdateSchedule.Enabled = False
        '    Me.btnCancel.Enabled = False
        'End If
        'DA_Sch.Update(Orders1.orderschedule)


    End Sub
    Private Sub SetScheduleClosed()
        '**** Set Schedule Status to Closed if All Parts Shedule Have Been Distributed
        Dim EnumParts As IEnumerator
        Dim Check As Boolean = True
        EnumParts = Bs_cmbSchPartList.GetEnumerator
        Do While EnumParts.MoveNext
            If Not (EnumParts.Current.item("QtyDistributed") _
               = EnumParts.Current.item("QtyScheduled")) Then
                Check = False
                Exit Do
            End If
        Loop
        If Check Then
            BS_Schedule.Current.item("Schedule_Status") = "Closed"
            BS_Schedule.EndEdit()
            DA_Sch.Update(Orders1.orderschedule)
            SetScheduleStatus()
        End If
    End Sub
    Private Sub ShortClose()
        '*** First Check Condition For Short Close
        'SetScheduleStatus()
        ''*** Exit If Schedule Completed
        'If BS_Schedule.Current.item("Schedule_Status") = "Completed" Then
        '    MsgBox("Cannot Short Close a completed Schedule. Distribute and close it.")
        '    Exit Sub
        'End If
        ''**** Check For ShortClose Condition
        '' ALL parts Cleared must be Distributed
        'Dim cmd As OdbcCommand = MD.getCommand
        'Dim Cmd1 As OdbcCommand = MD.getCommand

        'Try
        '    If Check_Distribution_Complete() Then
        '        '*** Status to be changed to 'ShortClosed'
        '        '*** For each Original Schedule
        '        ' Update the Qty for programming,production etc to Qty Cleared
        '        ' Update the Schedule status to 'Tasked'
        '        Dim enumDet As IEnumerator

        '        enumDet = bs_CmbSchDetails.GetEnumerator
        '        BS_SchDetails.MoveFirst()
        '        With Cmd1
        '            .Connection.Open()
        '            .CommandText = "Use magodmis;"
        '            .ExecuteNonQuery()
        '            .CommandText = "SET AUTOCOMMIT=0;"
        '            .ExecuteNonQuery()
        '            .CommandText = "START TRANSACTION;"
        '            .ExecuteNonQuery()
        '            .CommandText = "UPDATE magodmis.orderschedule SET Schedule_status='Tasked' " _
        '                        & "WHERE ScheduleId=@;"
        '            .Parameters.Add("@ScheduleId",  MySqlDbType.Int)
        '        End With

        '        With cmd
        '            .Connection.Open()
        '            cmd.CommandText = "Use magodmis;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "SET AUTOCOMMIT=0;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "START TRANSACTION;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "UPDATE magodmis.OrderScheduleDetails " _
        '                        & "SET QtyProgrammed=QtyProgrammed + @, " _
        '                        & "QtyProduced=QtyProduced + @,QtyInspected=QtyInspected + @ " _
        '                        & "Where SchDetailsID=@;"
        '            With cmd.Parameters
        '                .Add("@QtyProgrammed",  MySqlDbType.Int)
        '                .Add("@QtyProduced",  MySqlDbType.Int)
        '                .Add("@QtyInspected",  MySqlDbType.Int)
        '                .Add("@SchDetailsID",  MySqlDbType.Int)
        '            End With
        '            'o.`QtyProgrammed`, o.`QtyProduced`, o.`QtyInspected`
        '            Do While enumDet.MoveNext
        '                ' Console.WriteLine(enumDet.Current.item("OrderSchNo"))
        '                For Each obj As Object In BS_RelSchToParts
        '                    With cmd
        '                        .Parameters("@QtyProgrammed").Value = obj.item("QtyDistributed")
        '                        .Parameters("@QtyProduced").Value = obj.item("QtyDistributed")
        '                        .Parameters("@QtyInspected").Value = obj.item("QtyDistributed")
        '                        .Parameters("@SchDetailsID").Value = obj.item("O_SchDetailsID")
        '                    End With
        '                    ' Console.WriteLine(obj.item("DwgName") & " " & obj.item("QtyDistributed"))
        '                    cmd.ExecuteNonQuery()
        '                Next

        '                Cmd1.Parameters("@ScheduleId").Value = bs_CmbSchDetails.Current.item("ScheduleId")
        '                Cmd1.ExecuteNonQuery()

        '                bs_CmbSchDetails.MoveNext()
        '            Loop
        '            BS_Schedule.Current.item("Schedule_Status") = "ShortClosed"
        '        End With

        '    End If
        '    cmd.CommandText = "COMMIT;"
        '    cmd.ExecuteNonQuery()
        '    cmd.CommandText = "SET AUTOCOMMIT=1;"
        '    cmd.ExecuteNonQuery()

        '    Cmd1.CommandText = "COMMIT;"
        '    Cmd1.ExecuteNonQuery()
        '    Cmd1.CommandText = "SET AUTOCOMMIT=1;"
        '    Cmd1.ExecuteNonQuery()

        '    ' Save Schedule Status
        '    BS_Schedule.EndEdit()
        '    DA_Sch.Update(DS_Form, "Schedule")
        '    SetScheduleStatus()

        'Catch ex As Exception
        '    MsgBox(ex.Message)
        '    cmd.CommandText = "ROLLBACK;"
        '    cmd.ExecuteNonQuery()
        '    Cmd1.CommandText = "ROLLBACK;"
        '    cmd.ExecuteNonQuery()
        'Finally
        '    If cmd.Connection.State <> ConnectionState.Closed Then
        '        cmd.Connection.Close()
        '    End If
        '    If Cmd1.Connection.State <> ConnectionState.Closed Then
        '        Cmd1.Connection.Close()
        '    End If
        'End Try
    End Sub
    Private Sub CancelSchedule()
        '*** First Check Condition For Short Close
        'SetScheduleStatus()
        ''*** Exit If Schedule Completed
        'If Not BS_Schedule.Current.item("Schedule_Status") = "Tasked" Then
        '    MsgBox("Cannot Cancel a Schedule Once Production Started, Short close it.")
        '    Exit Sub
        'End If
        ''**** Check For ShortClose Condition
        '' ALL parts Cleared must be Distributed
        'Dim cmd As OdbcCommand = MD.getCommand
        'Dim Cmd1 As OdbcCommand = MD.getCommand

        'Try
        '    If Check_Ok_for_Cancel() Then
        '        '*** Status to be changed to 'ShortClosed'
        '        '*** For each Original Schedule
        '        ' Update the Qty for programming,production etc to Qty Cleared
        '        ' Update the Schedule status to 'Tasked'
        '        Dim enumDet As IEnumerator

        '        enumDet = bs_CmbSchDetails.GetEnumerator
        '        BS_SchDetails.MoveFirst()
        '        With Cmd1
        '            .Connection.Open()
        '            .CommandText = "Use magodmis;"
        '            .ExecuteNonQuery()
        '            .CommandText = "SET AUTOCOMMIT=0;"
        '            .ExecuteNonQuery()
        '            .CommandText = "START TRANSACTION;"
        '            .ExecuteNonQuery()
        '            .CommandText = "UPDATE magodmis.orderschedule SET Schedule_status='Tasked' " _
        '                        & "WHERE ScheduleId=@;"
        '            .Parameters.Add("@ScheduleId",  MySqlDbType.Int)
        '        End With

        '        With cmd
        '            .Connection.Open()
        '            cmd.CommandText = "Use magodmis;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "SET AUTOCOMMIT=0;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "START TRANSACTION;"
        '            cmd.ExecuteNonQuery()
        '            cmd.CommandText = "UPDATE magodmis.OrderScheduleDetails " _
        '                        & "SET QtyProgrammed=QtyProgrammed - @, " _
        '                        & "QtyProduced=QtyProduced - @,QtyInspected=QtyInspected - @ " _
        '                        & "Where SchDetailsID=@;"
        '            With cmd.Parameters
        '                .Add("@QtyProgrammed",  MySqlDbType.Int)
        '                .Add("@QtyProduced",  MySqlDbType.Int)
        '                .Add("@QtyInspected",  MySqlDbType.Int)
        '                .Add("@SchDetailsID",  MySqlDbType.Int)
        '            End With
        '            'o.`QtyProgrammed`, o.`QtyProduced`, o.`QtyInspected`
        '            Do While enumDet.MoveNext
        '                ' Console.WriteLine(enumDet.Current.item("OrderSchNo"))
        '                For Each obj As Object In BS_RelSchToParts
        '                    With cmd
        '                        .Parameters("@QtyProgrammed").Value = obj.item("QtyDistributed")
        '                        .Parameters("@QtyProduced").Value = obj.item("QtyDistributed")
        '                        .Parameters("@QtyInspected").Value = obj.item("QtyDistributed")
        '                        .Parameters("@SchDetailsID").Value = obj.item("O_SchDetailsID")
        '                    End With
        '                    ' Console.WriteLine(obj.item("DwgName") & " " & obj.item("QtyDistributed"))
        '                    cmd.ExecuteNonQuery()
        '                Next

        '                Cmd1.Parameters("@ScheduleId").Value = bs_CmbSchDetails.Current.item("ScheduleId")
        '                Cmd1.ExecuteNonQuery()

        '                bs_CmbSchDetails.MoveNext()
        '            Loop
        '            BS_Schedule.Current.item("Schedule_Status") = "Cancelled"
        '        End With

        '    End If
        '    cmd.CommandText = "COMMIT;"
        '    cmd.ExecuteNonQuery()
        '    Cmd1.CommandText = "COMMIT;"
        '    Cmd1.ExecuteNonQuery()
        '    cmd.CommandText = "SET AUTOCOMMIT=1;"
        '    cmd.ExecuteNonQuery()
        '    Cmd1.CommandText = "SET AUTOCOMMIT=1;"
        '    Cmd1.ExecuteNonQuery()
        '    ' Save Schedule Status
        '    BS_Schedule.EndEdit()
        '    DA_Sch.Update(DS_Form, "Schedule")
        '    SetScheduleStatus()

        'Catch ex As Exception
        '    MsgBox(ex.Message)
        '    cmd.CommandText = "ROLLBACK;"
        '    cmd.ExecuteNonQuery()
        '    Cmd1.CommandText = "ROLLBACK;"
        '    cmd.ExecuteNonQuery()
        'Finally
        '    If cmd.Connection.State <> ConnectionState.Closed Then
        '        cmd.Connection.Close()
        '    End If
        '    If Cmd1.Connection.State <> ConnectionState.Closed Then
        '        Cmd1.Connection.Close()
        '    End If
        'End Try
    End Sub

    Private Sub btnShortClose_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnShortClose.Click
        ShortClose()
    End Sub




    Private Sub btnCancel_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCancel.Click
        CancelSchedule()
    End Sub

    Private Sub btnopenFolder_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnopenFolder.Click
        Using X As New OpenFileDialog
            X.DefaultExt = ".dxf"
            X.InitialDirectory = OrderFolder & "\DXF"
            X.ShowDialog()
        End Using
    End Sub

    Private Sub btnCopyDwg_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCopyDwg.Click
        '*** For Each Schedule in CmbSchDetails
        ' get the The Path for Drawing if Exist
        ' Check For Dwg If Exists Copy
        Dim WOFolder As String
        Dim FromDwgName, ToDwgName As String
        Dim Finfo As IO.FileInfo
        For Each sch As magod.Orders.combined_schedule_detailsRow In Orders1.combined_schedule_details.Rows
            WOFolder = Orders.getWOPath & "\" & Microsoft.VisualBasic.Left(sch.OrderSchNo, 6)
            Dim Filt As String = String.Format("cmbSchDetailsID={0}", sch.cmbSchDetailsID)
            For Each part As magod.Orders.combined_schedule_part_detailsRow In Orders1.combined_schedule_part_details.Select(Filt)
                FromDwgName = part.DwgName & ".DXF"
                If (combSchRow.combined_schedule_no Like "88*") Then
                    FromDwgName = Microsoft.VisualBasic.Right(FromDwgName, FromDwgName.Length - 13)
                End If
                ToDwgName = part.DwgName & ".DXF"
                Finfo = New IO.FileInfo(WOFolder & "\DXF\" & part.DwgName & ".DXF")
                Finfo = New IO.FileInfo(WOFolder & "\DXF\" & FromDwgName)
                Console.WriteLine(Finfo.FullName)
                If Finfo.Exists Then
                    Finfo.CopyTo(OrderFolder & "\DXF\" & ToDwgName, True)
                End If

            Next
        Next

       


    End Sub

    Private Sub btn_Print_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_Print.Click

        showSchedule()
    End Sub
    Private Sub showSchedule()
        Save_SchToCmbDetails_distribution()

        If Orders1.orderscheduledetails.Rows.Count = 0 Then
            Exit Sub
        End If
        ReportManager1.DataSources.Clear()
        ReportManager1.DataSources.Add("Sch", BS_Schedule)
        ReportManager1.DataSources.Add("SchDetails", BS_SchDetails)
        ReportManager1.DataSources.Add("Unit", BS_Unit)

        '888 Me.FileReportSlot1.DesignTemplate()
        '** Me.InlineReportSlot1.DesignTemplate()
        Me.InlineReportSlot1.Prepare()

        Me.Cursor = Cursors.WaitCursor
        'If Not FileReportSlot1.Equals(Nothing) Then
        '    FileReportSlot1.Prepare()
        '    FileReportSlot1.RenderDocument()
        'Else
        '    MsgBox("Add 'rpt_schedule' to Reports folder in the application")
        '    Exit Sub
        'End If


        '/************************

        '***** If this is the first time send PDF to Store
        Try
            Orders.getDBLink.CheckCreateDir(SchPath, True)
            Dim schpdfPath = SchPath & "\" & combSchRow.combined_schedule_no & "_01.pdf"
            Dim FileInfo As IO.FileInfo
            FileInfo = New IO.FileInfo(schpdfPath)
            If Not FileInfo.Exists Then
                Me.InlineReportSlot1.RenderDocument()
                Dim PdfExportFilter1 As New PerpetuumSoft.Reporting.Export.Pdf.PdfExportFilter
                With PdfExportFilter1

                    .Compress = True
                    .Export(Me.InlineReportSlot1.Document, schpdfPath, False)
                End With
            End If

            Me.Cursor = Cursors.Default
            Using preViewForm As New PerpetuumSoft.Reporting.View.PreviewForm(Me.InlineReportSlot1)
                preViewForm.WindowState = System.Windows.Forms.FormWindowState.Maximized
                preViewForm.ShowDialog()
            End Using


        Catch ex As Exception
            MsgBox(ex.Message)

        End Try




    End Sub
  
    Private Sub btn_NcProgram_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btn_NcProgram.Click
        magod_Nc_Sigma_Programmer.NCPgm.StartupPath = Application.StartupPath
        magod_Nc_Sigma_Programmer.NCPgm.UserName = "production"
        magod_Nc_Sigma_Programmer.NCPgm.PassWord = "production"
        magod_Nc_Sigma_Programmer.NCPgm.Function = "Production"
        magod_Nc_Sigma_Programmer.NCPgm.SetUp()

        Using X As New magod_Nc_Sigma_Programmer.Form_SigmaProgramming(combSchRow.ScheduleID)
            X.ShowDialog()
            ' refreshSchedule()
        End Using
    End Sub
End Class