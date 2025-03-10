'Imports System.Windows.Forms
'Imports System.Drawing
Imports MySql.Data.MySqlClient
Public Class ImportQtn
   
    Dim strqtnNo, strQtnType, strFormat As String
    Dim da_qtnList, Da_qtnDetails As MySqlDataAdapter
    Dim intQtnId As Integer = 0
    Dim bolOk As Boolean = False
    Friend Sub New(ByVal Format As String)
        ' This call is required by the Windows Form Designer.
        InitializeComponent()
        '   MD = _md
        strFormat = Format
        Try

            setDa()


        Catch ex As Exception
            MsgBox(ex.Message)
        End Try

    End Sub

    Private Sub setDa()
        da_qtnList = Orders.getDBLink.getMySqlDataAdopter
        Da_qtnDetails = Orders.getDBLink.getMySqlDataAdopter

        With da_qtnList
            With .SelectCommand
                .CommandText = "SELECT q.`QtnNo`,q.`QtnID`,q.`QtnType`, q.`Cust_Code`, q.`CustomerName`, q.`ValidUpTo` , q.`EnquiryDate` FROM magodqtn.qtnlist q " _
                                & "WHERE q.`QtnDate` is not null AND q.`QtnFormat`=@QtnFormat ORDER BY q.`QtnNo` Desc;"
                .Parameters.AddWithValue("@QtnFormat", strFormat)
            End With

            .Fill(QtnData1.QtnList)
        End With


        With Da_qtnDetails
            With .SelectCommand
                Select Case strFormat
                    Case "Service"
                        .CommandText = "SELECT * FROM magodqtn.qtn_itemslist q WHERE q.`QtnId`=@QtnId;"

                    Case Else
                        .CommandText = "SELECT * FROM magodqtn.qtn_profiledetails q WHERE q.`QtnId`=@QtnId;"

                End Select
                '.CommandText = "SELECT * FROM magodqtn.qtn_profiledetails q WHERE q.`QtnId`=@QtnId;"
                .Parameters.Add("@QtnId", MySqlDbType.Int32)
            End With
        End With
    End Sub
  

   


    Private Sub cmb_qtnNo_SelectionChangeCommitted(ByVal sender As Object, ByVal e As System.EventArgs) Handles cmb_qtnNo.SelectionChangeCommitted
        intQtnId = Me.cmb_qtnNo.SelectedValue
        If Today > QtnData1.QtnList.FindByQtnID(intQtnId).ValidUpto Then
            Label_Valid.BackColor = Drawing.Color.Red
            Label_Valid.ForeColor = Drawing.Color.White
            Label_Valid.Text = "Quotation Not Valid"
        Else
            Label_Valid.BackColor = Drawing.Color.Green
            Label_Valid.ForeColor = Drawing.Color.White
            Label_Valid.Text = "Quotation Valid"
        End If
      

        'If Me.TextBox_QtnType.Text = "Sales" Then
        '    Me.DGV_QtnDetails.Columns("MtrlCost").Visible = True
        'Else
        '    Me.DGV_QtnDetails.Columns("MtrlCost").Visible = False
        'End If




    End Sub

  

    Public ReadOnly Property qtnNo() As String
        Get
            Return strqtnNo
        End Get
    End Property
   
    Public ReadOnly Property LoadQuote() As Boolean
        Get
            Return bolOk
        End Get
    End Property
  

    Private Sub btnLoad_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnLoad.Click
        bolOk = True
        Me.Visible = False
        Me.Close()
    End Sub


    Private Sub cmb_qtnNo_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmb_qtnNo.SelectedIndexChanged

        If Not Me.cmb_qtnNo.SelectedValue Is Nothing Then
            intQtnId = Me.cmb_qtnNo.SelectedValue
            QtnData1.qtn_profileDetails.Clear()
            QtnData1.qtn_itemslist.Clear()
            Da_qtnDetails.SelectCommand.Parameters("@QtnId").Value = intQtnId
            Select Case strFormat
                Case "Service"

                    Da_qtnDetails.Fill(QtnData1.qtn_itemslist)
                Case Else

                    Da_qtnDetails.Fill(QtnData1.qtn_profileDetails)
            End Select


        End If
    End Sub
    Public ReadOnly Property QtnId() As Int32
        Get
            Return intQtnId
        End Get
      
    End Property
    Public ReadOnly Property QtnItemsList() As magod.QtnData.qtn_itemslistDataTable
        Get
            Return QtnData1.qtn_itemslist
        End Get
    End Property
    Public ReadOnly Property QtnProfilesList() As Magod.QtnData.qtn_profileDetailsDataTable
        Get
            Return QtnData1.qtn_profileDetails
        End Get
    End Property
    Public ReadOnly Property getQtn() As Magod.QtnData.QtnListRow
        Get
            Return QtnData1.QtnList.FindByQtnID(intQtnId)
        End Get
    End Property
End Class