Imports System.Windows.Forms
Public Class import_oldorder
    Dim formok As Boolean
    Dim orderno, strCustCode, strType As String

    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        orderno = dgv_orderno.CurrentRow.Cells("order_no").Value
        formok = True
        Me.Close()
    End Sub

    Public ReadOnly Property isLoadOrder() As Boolean
        Get
            Return formok
        End Get
    End Property
    Public WriteOnly Property CustCode() As String
        Set(ByVal value As String)
            strCustCode = value
        End Set
    End Property
    Private Sub btnCancel_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnCancel.Click
        formok = False
        Me.Close()
    End Sub

    Public Sub New(ByVal orderlist As DataTable)
        Dim col_txt As DataGridViewTextBoxColumn
        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        With Me.dgv_orderno
            .AllowUserToAddRows = False
            .AllowUserToDeleteRows = False
            .AutoGenerateColumns = False
            .DataSource = orderlist
            col_txt = New DataGridViewTextBoxColumn
            With col_txt
                .HeaderText = "Order No"
                .Name = "order_no"
                .DataPropertyName = "order_no"
                .ValueType = System.Type.GetType("System.string")
                .ReadOnly = True
                .Width = 100
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
                .ReadOnly = True
            End With
            .Columns.Add(col_txt)

            col_txt = New DataGridViewTextBoxColumn
            With col_txt
                .HeaderText = "PO No"
                .Name = "purchase_order"
                .DataPropertyName = "purchase_order"
                .ValueType = System.Type.GetType("System.string")
                .ReadOnly = True
                .Width = 100
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
                .ReadOnly = True
            End With
            .Columns.Add(col_txt)
        End With
        ' Add any initialization after the InitializeComponent() call.

    End Sub

    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        ' setUpDGV()
    End Sub
    Public ReadOnly Property order_no() As String
        Get
            Return orderno
        End Get
    End Property
    Private Sub setUpDGV()
        Dim col_txt As DataGridViewTextBoxColumn
        With Me.dgv_orderno
            .AllowUserToAddRows = False
            .AllowUserToDeleteRows = False
            .AutoGenerateColumns = False
            .DataSource = Orders.getOrderList(strType, strCustCode)

            col_txt = New DataGridViewTextBoxColumn
            With col_txt
                .HeaderText = "Order No"
                .Name = "order_no"
                .DataPropertyName = "order_no"
                .ValueType = System.Type.GetType("System.string")
                .ReadOnly = True
                .Width = 100
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
                .ReadOnly = True
            End With
            .Columns.Add(col_txt)

            col_txt = New DataGridViewTextBoxColumn
            With col_txt
                .HeaderText = "PO No"
                .Name = "purchase_order"
                .DataPropertyName = "purchase_order"
                .ValueType = System.Type.GetType("System.string")
                .ReadOnly = True
                .Width = 200
                .DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight
                .ReadOnly = True
            End With
            .Columns.Add(col_txt)
        End With
    End Sub
    Public Property Type() As String
        Get
            Return strType
        End Get
        Set(ByVal value As String)
            strType = value
        End Set
    End Property
    Private Sub import_oldorder_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        setUpDGV()
    End Sub
End Class